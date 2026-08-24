// ================================
// Theme - Переключение темы: системная / светлая / тёмная
// Используется на index.html и detail.html
// ================================

const STORAGE_KEY = 'theme';
const MODES = ['system', 'light', 'dark'];

const LABELS = {
    system: '🌓 Системная',
    light: '☀️ Светлая',
    dark: '🌙 Тёмная'
};

const media = window.matchMedia('(prefers-color-scheme: light)');

/**
 * Разрешить режим в конкретную тему
 * @param {string} mode - system | light | dark
 * @returns {string} light | dark
 */
function resolve(mode) {
    if (mode === 'light' || mode === 'dark') return mode;
    return media.matches ? 'light' : 'dark';
}

/**
 * Применить режим темы и сохранить выбор
 * @param {string} mode - system | light | dark
 */
function applyTheme(mode) {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.dataset.theme = resolve(mode);
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
        btn.textContent = LABELS[mode];
        btn.title = `Тема: ${LABELS[mode].slice(2).toLowerCase()} (нажмите, чтобы сменить)`;
    });
}

/**
 * Следующий режим по циклу: system -> light -> dark -> system
 */
function nextMode(current) {
    return MODES[(MODES.indexOf(current) + 1) % MODES.length];
}

/**
 * Инициализация переключателя темы
 */
export function initTheme() {
    let current = localStorage.getItem(STORAGE_KEY);
    if (!MODES.includes(current)) current = 'system';

    // Кнопки могут быть на обеих страницах
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
        btn.addEventListener('click', () => {
            current = nextMode(current);
            applyTheme(current);
        });
    });

    // Пока выбрана "системная" - следим за сменой темы ОС
    const onMediaChange = () => {
        if (!MODES.includes(localStorage.getItem(STORAGE_KEY))) {
            applyTheme('system');
        }
    };
    if (media.addEventListener) {
        media.addEventListener('change', onMediaChange);
    } else if (media.addListener) {
        media.addListener(onMediaChange); // старые Safari
    }

    applyTheme(current);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}
