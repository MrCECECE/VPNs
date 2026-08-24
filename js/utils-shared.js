// ================================
// Shared Utility Functions
// Используются в main.js и vpn-detail.js
// ================================

/**
 * Форматировать число с запятой
 * @param {number} num - Число для форматирования
 * @returns {string} Отформатированная строка
 */
export function formatNumber(num) {
    return num.toString().replace('.', ',');
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
 * Половина звезды рисуется CSS-ом в .half-star (два слоя текста):
 * символ ⯪ отсутствует в шрифтах мобильных ОС
 * @param {number} rating - Рейтинг
 * @returns {string} HTML звёзд
 */
export function renderRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';
    for (let i = 0; i < fullStars; i++) stars += '★';
    if (hasHalfStar) stars += '<span class="half-star" aria-hidden="true"></span>';
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
