// ================================
// Shared Utility Functions
// Используются в main.js и vpn-detail.js
// ================================

// Пороги для определения класса скорости (main page)
const SPEED_THRESHOLDS = {
    main: { high: 10, medium: 5 },
    detail: { high: 50, medium: 10 }
};

/**
 * Получить класс скорости на основе значения
 * @param {number} speed - Скорость в Mbps
 * @param {string} mode - 'main' или 'detail'
 * @returns {string} Класс скорости
 */
export function getSpeedClass(speed, mode = 'main') {
    const t = SPEED_THRESHOLDS[mode] || SPEED_THRESHOLDS.main;
    if (speed >= t.high) return 'high';
    if (speed >= t.medium) return 'medium';
    return 'low';
}

/**
 * Форматировать число с запятой
 * @param {number} num - Число для форматирования
 * @returns {string} Отформатированная строка
 */
export function formatNumber(num) {
    return num.toString().replace('.', ',');
}

/**
 * Получить текстовую метку скорости
 * @param {number} speed - Скорость в Mbps
 * @param {string} mode - 'main' или 'detail'
 * @returns {string} Текстовая метка
 */
export function getSpeedLabel(speed, mode = 'main') {
    const t = SPEED_THRESHOLDS[mode] || SPEED_THRESHOLDS.main;
    if (speed >= t.high) return 'Быстро';
    if (speed >= t.medium) return 'Средне';
    return 'Медленно';
}

/**
 * Получить класс рейтинга на основе значения
 * @param {number} rating - Рейтинг
 * @returns {string} Класс рейтинга
 */
export function getRatingClass(rating) {
    if (rating >= 4.5) return 'excellent';
    if (rating >= 4.0) return 'good';
    if (rating >= 3.5) return 'average';
    return 'low';
}

/**
 * Рендерить звёзды рейтинга
 * @param {number} rating - Рейтинг
 * @returns {string} HTML звёзд
 */
export function renderRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '★';
    if (hasHalfStar) stars += '⯪';
    for (let i = 0; i < emptyStars; i++) stars += '☆';
    return stars;
}

/**
 * Экранировать HTML
 * @param {string} text - Текст для экранирования
 * @returns {string} Экранированный текст
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
