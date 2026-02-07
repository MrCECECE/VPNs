# 🚀 VPN Speed Test - GitHub Pages

Красивый и современный сайт для отображения сравнительной таблицы VPN сервисов с иконками, ссылками на скачивание, интерактивной сортировкой, поиском и цветовой индикацией скорости.

![VPN Speed Test](https://via.placeholder.com/800x400/0d1117/f0f6fc?text=VPN+Speed+Test)

## ✨ Особенности

- 🎨 **Тёмная тема** в стиле GitHub
- 📱 **Иконки сервисов** для каждого VPN
- 🔗 **Кнопки скачивания** на Google Play
- 🔍 **Поиск** по названию сервиса
- 📊 **Сортировка** по скорости скачивания/загрузки
- 🎯 **Цветовая индикация** скорости:
  - 🟢 Зелёный: >50 Mbps (быстро)
  - 🟡 Жёлтый: 10-50 Mbps (средне)
  - 🔴 Красный: <10 Mbps (медленно)
- 📱 **Адаптивный дизайн** для всех устройств
- ⚡ **Быстрая загрузка** (без внешних зависимостей)

## 📋 Данные сервисов

| Сервис | Скачивание | Загрузка | Ссылка |
|--------|------------|----------|--------|
| AdGuard | 19,4 Mbps | 31,1 Mbps | [Google Play](https://play.google.com/store/apps/details?id=com.adguard.vpn) |
| Turbo VPN | 2,81 Mbps | 2,79 Mbps | [Google Play](https://play.google.com/store/apps/details?id=free.vpn.unblock.proxy.turbovpn) |
| Octohide VPN | 4,94 Mbps | 6,98 Mbps | [Google Play](https://play.google.com/store/apps/details?id=octohide.vpn) |
| VPN Proxy Master | 2,83 Mbps | 62,0 Mbps | [Google Play](https://play.google.com/store/apps/details?id=free.vpn.unblock.proxy.vpn.master.pro) |
| JumpJump VPN | 73,7 Mbps | 63,8 Mbps | [Google Play](https://play.google.com/store/apps/details?id=app.jumpjumpvpn.jumpjumpvpn) |
| NashVPN | 70,6 Mbps | 43,5 Mbps | [Google Play](https://play.google.com/store/apps/details?id=com.nashvpn.vpn) |

## 📁 Структура проекта

```
vpn-speed-test/
├── index.html           # Главная страница
├── styles.css           # Стили (карточки, анимации, адаптивность)
├── script.js           # Логика (иконки, ссылки, сортировка)
├── README.md           # Этот файл
├── PLAN.md             # План реализации
└── assets/
    ├── AdGuard/
    │   ├── icon.webp
    │   └── link.txt
    ├── Turbo VPN/
    │   ├── icon.webp
    │   └── link.txt
    ├── Octohide VPN/
    │   ├── icon.webp
    │   └── link.txt
    ├── VPN Proxy Master/
    │   ├── icon.webp
    │   └── link.txt
    ├── JumpJump VPN/
    │   ├── icon.webp
    │   └── link.txt
    └── NashVPN/
        ├── icon.webp
        └── link.txt
```

## 🚀 Развёртывание на GitHub Pages

### Способ 1: Через веб-интерфейс GitHub

1. **Создайте репозиторий**
   - Перейдите на [GitHub](https://github.com)
   - Нажмите кнопку "New repository"
   - Назовите репозиторий (например: `vpn-speed-test`)
   - Сделайте его публичным (Public)

2. **Загрузите файлы**
   - Нажмите "uploading an existing file"
   - Перетащите ВСЮ папку проекта ВКЛЮЧАЯ папку `assets/`
   - Нажмите "Commit changes"

3. **Включите GitHub Pages**
   - Перейдите в Settings → Pages
   - В разделе "Source" выберите: `main` (или `master`)
   - Нажмите "Save"
   - Подождите 1-2 минуты

4. **Ваш сайт готов!**
   - URL будет: `https://ваше-имя.github.io/vpn-speed-test/`

### Способ 2: Через Git

```bash
# Клонируйте репозиторий (если ещё не клонирован)
git clone https://github.com/ваше-имя/vpn-speed-test.git
cd vpn-speed-test

# Создайте новую ветку для страниц
git checkout -b gh-pages

# Или используйте существующую main ветку
git branch -M main

# Отправьте на GitHub (включая папку assets!)
git add .
git commit -m "Add VPN Speed Test site with icons"
git push -u origin main

# Включите GitHub Pages в настройках репозитория
```

### Способ 3: Через GitHub CLI

```bash
# Создайте репозиторий и загрузите файлы одной командой
gh repo create vpn-speed-test --public --source=. --push

# Включите Pages
gh api repos/{owner}/{repo}/pages -X POST -f source='{"branch":"main"}'
```

## 🎨 Дизайн карточек

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│   [icon]  AdGuard                        [↓ 19.4]   │
│           📲 Скачать из Google Play                  │
│                                                      │
│   Скачивание  ████████░░░░░░░░░░░░░  19.4 Mbps     │
│   Загрузка    ██████████████████░░░░  31.1 Mbps     │
└─────────────────────────────────────────────────────┘
```

### Элементы карточки:
1. **Иконка** - изображение сервиса (60x60px)
2. **Название** - имя VPN сервиса
3. **Кнопка "Скачать"** - переход на Google Play
4. **Скорость скачивания/загрузки** - с цветовой индикацией
5. **Визуальные полосы** - прогресс-бары скорости

## 🔧 Редактирование данных

### Добавление нового сервиса

1. Добавьте папку в `assets/`:
   ```
   assets/
   └── Новый VPN/
       ├── icon.webp
       └── link.txt
   ```

2. Обновите массив `vpnData` в файле [`script.js`](script.js):

```javascript
const vpnData = [
    {
        id: 'new-vpn',
        name: 'Новый VPN',
        icon: 'assets/Новый VPN/icon.webp',
        link: 'https://play.google.com/store/apps/details?id=...',
        download: 25.0,
        upload: 15.0
    },
    // ... остальные сервисы
];
```

### Изменение цветовой индикации

В файле [`styles.css`](styles.css) измените переменные:

```css
:root {
    --speed-high: #3fb950;      /* Зелёный */
    --speed-medium: #d29922;   /* Жёлтый */
    --speed-low: #f85149;       /* Красный */
}
```

## 🌐 Браузерная поддержка

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 📱 Адаптивность

Сайт полностью адаптивен и отлично смотрится на:
- 🖥️ Настольных компьютерах (3 колонки)
- 📱 Планшетах (2 колонки)
- 📱 Мобильных телефонах (1 колонка)

## 📝 Лицензия

MIT License - свободное использование и модификация.

## 🤝 Вклад

Приветствуются предложения и улучшения! Создавайте issues или pull requests.

---

**Сделано с ❤️ для удобного сравнения VPN сервисов**
