# 🛡️ VPN Speed Test

Сравнение скоростей бесплатных VPN-сервисов. Тёмная тема, карточки с иконками, поиск, сортировка и цветовая индикация скорости.

🔗 **[Открыть сайт](https://mrcecece.github.io/VPNs/)**

## 📊 Тестируемые сервисы

| Сервис | ↓ Скачивание | ↑ Загрузка | Рейтинг |
|--------|-------------|------------|---------|
| JumpJump VPN | 73,7 Mbps | 63,8 Mbps | ⭐ 4.7 |
| NashVPN | 70,6 Mbps | 43,5 Mbps | ⭐ 3.2 |
| AdGuard | 19,4 Mbps | 31,1 Mbps | ⭐ 4.3 |
| Octohide VPN | 4,94 Mbps | 6,98 Mbps | ⭐ 3.4 |
| VPN Proxy Master | 2,83 Mbps | 62,0 Mbps | ⭐ 4.6 |
| Turbo VPN | 2,81 Mbps | 2,79 Mbps | ⭐ 4.6 |

> Данные актуальны на 10.02.2025

## 🚀 Возможности

- 🔍 Поиск по названию
- 📊 Сортировка по скорости
- 🟢🟡🔴 Цветовая индикация (быстро / средне / медленно)
- 📱 Адаптивный дизайн
- ⚡ Без внешних зависимостей

## 📁 Структура

```
├── index.html          # Главная страница
├── detail.html         # Страница деталей VPN
├── vpn-data.json       # Данные сервисов
├── css/                # Стили
├── js/                 # Логика
└── assets/             # Иконки сервисов
```

## ➕ Добавить VPN

1. Создайте папку `assets/Имя VPN/` с файлом `icon.webp`
2. Добавьте запись в [`vpn-data.json`](vpn-data.json):

```json
{
    "id": "my-vpn",
    "name": "My VPN",
    "icon": "assets/My VPN/icon.webp",
    "link": "https://play.google.com/store/apps/details?id=...",
    "detailLink": "detail.html?vpn=my-vpn",
    "download": 25.0,
    "upload": 15.0,
    "rating": 4.5,
    "reviewCount": "10 тыс."
}
```

## 📝 Лицензия

MIT
