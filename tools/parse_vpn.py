#!/usr/bin/env python3
"""
Парсер Google Play для сайта VPN Speed Test.

Читает ссылки из links.txt, скачивает иконки и скриншоты,
обновляет vpn-data.json.

Использование:
    python parse_vpn.py            # читает links.txt рядом со скриптом
    python parse_vpn.py my.txt     # читает указанный файл со ссылками
"""

import io
import json
import re
import sys
import time
from datetime import date
from pathlib import Path
from urllib.parse import urlparse, parse_qs, quote

import requests
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent.parent   # корень репозитория
ASSETS_DIR = BASE_DIR / "assets"
DATA_FILE = BASE_DIR / "vpn-data.json"
DEFAULT_LINKS_FILE = Path(__file__).resolve().parent / "links.txt"

MAX_SCREENSHOTS = 6
ICON_SIZE = 256
SCREENSHOT_MAX_WIDTH = 720
REQUEST_TIMEOUT = 30
DELAY_BETWEEN_APPS = 1.0

PLAY_PAGE_URL = "https://play.google.com/store/apps/details"
LD_JSON_RE = re.compile(
    r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',
    re.DOTALL,
)
SCREENSHOT_RE = re.compile(
    r'https://play-lh\.googleusercontent\.com/[A-Za-z0-9_-]{10,}=[^"\\\s\'<>]+'
)
UNSAFE_CHARS_RE = re.compile(r'[<>:"/\\|?*\x00-\x1f]')

session = requests.Session()
session.headers.update({
    "User-Agent": ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                   "AppleWebKit/537.36 (KHTML, like Gecko) "
                   "Chrome/124.0 Safari/537.36"),
    "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
})


def read_links(path: Path) -> list[str]:
    """Прочитать ссылки из файла, игнорируя пустые строки и комментарии."""
    if not path.exists():
        print(f"[ERR] Файл со ссылками не найден: {path}")
        sys.exit(1)

    links = []
    for line_no, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "play.google.com/store/apps/details" not in line:
            print(f"[WARN] Строка {line_no} не похожа на ссылку Google Play, пропущена: {line}")
            continue
        links.append(line)
    return links


def extract_package_id(url: str) -> str | None:
    """Достать id пакета из ссылки Google Play."""
    try:
        pkg = parse_qs(urlparse(url).query).get("id", [None])[0]
    except ValueError:
        return None
    return re.sub(r"[^\w.]", "", pkg) if pkg else None


def fetch_page(package_id: str) -> str:
    """Скачать страницу приложения в русской локали."""
    url = f"{PLAY_PAGE_URL}?id={quote(package_id)}&hl=ru&gl=RU"
    resp = session.get(url, timeout=REQUEST_TIMEOUT)
    resp.raise_for_status()
    return resp.text


def parse_app_info(html: str) -> dict:
    """Достать название, иконку, рейтинг и отзывы из ld+json."""
    match = LD_JSON_RE.search(html)
    if not match:
        raise ValueError("на странице не найдены данные ld+json")

    data = json.loads(match.group(1))
    name = (data.get("name") or "").strip()
    icon = (data.get("image") or "").strip()
    if not name or not icon:
        raise ValueError("в ld+json нет имени или иконки")

    rating_data = data.get("aggregateRating") or {}
    rating = float(rating_data.get("ratingValue") or 0)
    count = int(float(rating_data.get("ratingCount") or 0))

    return {"name": name, "icon_url": icon, "rating": rating, "count": count}


def extract_screenshot_urls(html: str) -> list[str]:
    """Достать уникальные ссылки на скриншоты и заменить размер на большой."""
    seen, result = set(), []
    for url in SCREENSHOT_RE.findall(html):
        if "w526-h296" not in url:
            continue
        base = url.split("=")[0]
        if base in seen:
            continue
        seen.add(base)
        result.append(f"{base}=w720-h1600-rw")
        if len(result) >= MAX_SCREENSHOTS:
            break
    return result


def download_image(url: str) -> Image.Image:
    """Скачать изображение и вернуть объект PIL."""
    resp = session.get(url, timeout=REQUEST_TIMEOUT)
    resp.raise_for_status()
    img = Image.open(io.BytesIO(resp.content))
    img.load()
    return img


def save_webp(img: Image.Image, dest: Path, max_side: int) -> None:
    """Сохранить изображение как webp с ограничением размера."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.thumbnail((max_side, max_side * 4), Image.LANCZOS)
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA")
    img.save(dest, "WEBP", quality=85, method=6)


def safe_folder_name(name: str) -> str:
    """Придумать безопасное имя папки по названию приложения."""
    cleaned = UNSAFE_CHARS_RE.sub("", name)
    cleaned = re.sub(r"\s+", " ", cleaned).strip().rstrip(".")
    return cleaned[:60] or "Unknown VPN"


def humanize_count(n: int) -> str:
    """Формат числа отзывов по-русски: 117,2 тыс., 1,62 млн."""
    def fmt(value: float, decimals: int, unit: str) -> str:
        s = f"{value:.{decimals}f}".rstrip("0").rstrip(".").replace(".", ",")
        return f"{s} {unit}"

    if n >= 1_000_000:
        return fmt(n / 1_000_000, 2, "млн")
    if n >= 1_000:
        return fmt(n / 1_000, 1, "тыс.")
    return str(n)


def package_id_of(service: dict) -> str | None:
    """Достать id пакета из ссылки существующей записи."""
    link = service.get("link", "")
    if "play.google.com" not in link:
        return None
    return extract_package_id(link)


def find_existing(data: dict, package_id: str) -> dict | None:
    """Найти запись и по полю id, и по пакету в ссылке."""
    for service in data["services"]:
        if service.get("id") == package_id or package_id_of(service) == package_id:
            return service
    return None


def load_data() -> dict:
    if DATA_FILE.exists():
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    return {"lastUpdated": "", "services": []}


def save_data(data: dict) -> None:
    data["lastUpdated"] = date.today().isoformat()
    DATA_FILE.write_text(
        json.dumps(data, ensure_ascii=False, indent=4) + "\n",
        encoding="utf-8",
    )


def process_link(link: str, data: dict) -> str:
    """Обработать одну ссылку. Возвращает статус: added/updated."""
    package_id = extract_package_id(link)
    if not package_id:
        raise ValueError("не удалось определить id пакета в ссылке")

    html = fetch_page(package_id)
    info = parse_app_info(html)
    screenshot_urls = extract_screenshot_urls(html)

    existing = find_existing(data, package_id)
    if existing:
        # Обновляем существующую запись, не меняя id и пути к ассетам
        folder_name = existing["icon"].split("/")[1] if "/" in existing.get("icon", "") \
            else safe_folder_name(info["name"])
        entry_id = existing.get("id", package_id)
    else:
        folder_name = safe_folder_name(info["name"])
        entry_id = package_id

    app_dir = ASSETS_DIR / folder_name

    icon_path_rel = f"assets/{folder_name}/icon.webp"
    save_webp(download_image(info["icon_url"]), app_dir / "icon.webp", ICON_SIZE)
    print(f"       иконка -> {icon_path_rel}")

    screenshots_rel = []
    for i, shot_url in enumerate(screenshot_urls, 1):
        shot_rel = f"assets/{folder_name}/screenshots/{i:02d}.webp"
        save_webp(download_image(shot_url), app_dir / "screenshots" / f"{i:02d}.webp",
                  SCREENSHOT_MAX_WIDTH)
        screenshots_rel.append(shot_rel)
    print(f"       скриншотов скачано: {len(screenshots_rel)}")

    fields = {
        "name": info["name"],
        "icon": icon_path_rel,
        "link": f"https://play.google.com/store/apps/details?id={package_id}",
        "rating": round(info["rating"], 1),
        "reviewCount": humanize_count(info["count"]),
        "screenshots": screenshots_rel,
    }

    if existing:
        old_shots = existing.get("screenshots", [])
        # Название не трогаем - оставляем как определил владелец сайта
        fields.pop("name", None)
        existing.update({k: v for k, v in fields.items() if v})
        if not screenshots_rel and old_shots:
            existing["screenshots"] = old_shots
        return "updated"

    data["services"].append({
        "id": entry_id,
        "detailLink": f"detail.html?vpn={entry_id}",
        **fields,
    })
    return "added"


def main() -> None:
    # Чтобы русский текст не бился в консоли Windows
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except (AttributeError, OSError):
            pass

    links_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_LINKS_FILE
    links = read_links(links_path)
    if not links:
        print("[ERR] В файле нет ни одной ссылки.")
        sys.exit(1)

    data = load_data()
    stats = {"added": 0, "updated": 0, "failed": 0}

    for i, link in enumerate(links, 1):
        print(f"[{i}/{len(links)}] {link}")
        try:
            status = process_link(link, data)
            stats[status] += 1
            print(f"  [OK] {'добавлен' if status == 'added' else 'обновлён'}")
        except Exception as exc:  # noqa: BLE001 - батч не должен падать целиком
            stats["failed"] += 1
            print(f"  [ERR] {exc}")
        if i < len(links):
            time.sleep(DELAY_BETWEEN_APPS)

    if stats["added"] or stats["updated"]:
        save_data(data)
        print(f"\nvpn-data.json обновлён (lastUpdated = {data['lastUpdated']})")

    print(f"\nИтого: добавлено {stats['added']}, обновлено {stats['updated']}, "
          f"ошибок {stats['failed']}.")


if __name__ == "__main__":
    main()
