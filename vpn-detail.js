/**
 * VPN Detail Page - Загрузка и отображение данных VPN
 */

// ================================
// Utility Functions
// ================================

/**
 * Получить класс скорости на основе значения
 * @param {number} speed - Скорость в Mbps
 * @returns {string} Класс скорости
 */
function getSpeedClass(speed) {
    if (speed >= 50) return 'high';
    if (speed >= 10) return 'medium';
    return 'low';
}

/**
 * Форматировать число с запятой
 * @param {number} num - Число для форматирования
 * @returns {string} Отформатированная строка
 */
function formatNumber(num) {
    return num.toString().replace('.', ',');
}

/**
 * Получить текстовую метку скорости
 * @param {number} speed - Скорость в Mbps
 * @returns {string} Текстовая метка
 */
function getSpeedLabel(speed) {
    if (speed >= 50) return 'Быстро';
    if (speed >= 10) return 'Средне';
    return 'Медленно';
}

/**
 * Получить класс рейтинга на основе значения
 * @param {number} rating - Рейтинг
 * @returns {string} Класс рейтинга
 */
function getRatingClass(rating) {
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
function renderRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    if (hasHalfStar) {
        stars += '⯪';
    }
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    return stars;
}

/**
 * Экранировать HTML
 * @param {string} text - Текст для экранирования
 * @returns {string} Экранированный текст
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ================================
// Render Functions
// ================================

/**
 * Рендерить страницу с детальной информацией VPN
 * @param {Object} vpn - Данные VPN
 */
function renderVPNDetail(vpn) {
    // Обновить title
    document.getElementById('page-title').textContent = `${vpn.name} - VPN Speed Test`;
    
    // Обновить meta description
    document.querySelector('meta[name="description"]').content = `Подробная информация о VPN сервисе ${vpn.name}`;
    
    // Рендерить контент
    const container = document.getElementById('vpn-content');
    container.innerHTML = `
        <div class="detail-header">
            <img src="${escapeHtml(vpn.icon)}" 
                 alt="${escapeHtml(vpn.name)}" 
                 class="detail-icon"
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔒</text></svg>'">
            <div class="detail-title">
                <h1>${escapeHtml(vpn.name)}</h1>
                <div class="vpn-rating-detail">
                    <span class="rating-stars ${getRatingClass(vpn.rating)}">${renderRatingStars(vpn.rating)}</span>
                    <span class="rating-value">${formatNumber(vpn.rating)}</span>
                    <span class="review-count">${escapeHtml(vpn.reviewCount)} отзывов</span>
                </div>
            </div>
        </div>

        <div class="speed-section">
            <h2>📊 Результаты тестирования</h2>
            <div class="speed-grid">
                <div class="speed-item">
                    <span class="speed-label">↓ Скачивание</span>
                    <span class="speed-value ${getSpeedClass(vpn.download)}">
                        ${formatNumber(vpn.download)} Mbps
                    </span>
                </div>
                <div class="speed-item">
                    <span class="speed-label">↑ Загрузка</span>
                    <span class="speed-value ${getSpeedClass(vpn.upload)}">
                        ${formatNumber(vpn.upload)} Mbps
                    </span>
                </div>
            </div>
        </div>

        <div class="action-section">
            <a href="${escapeHtml(vpn.link)}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="download-btn-large">
                📲 Скачать в Google Play
            </a>
        </div>
    `;
    
    console.log(`🚀 VPN ${vpn.name} загружен`);
}

/**
 * Обновить отображение даты обновления
 * @param {string} lastUpdated - Дата в формате YYYY-MM-DD
 */
function updateLastUpdatedDisplay(lastUpdated) {
    const dateElement = document.getElementById('footer-date');
    if (dateElement && lastUpdated) {
        const date = new Date(lastUpdated);
        const months = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        const formattedDate = `${months[date.getMonth()]} ${date.getFullYear()}`;
        dateElement.textContent = `📅 Обновлено: ${formattedDate}`;
    }
}

/**
 * Показать сообщение об ошибке
 */
function showError(message) {
    const container = document.getElementById('vpn-content');
    container.innerHTML = `
        <div class="no-results">
            😕 ${escapeHtml(message)}
            <br><br>
            <a href="index.html" class="download-btn-large">← Вернуться к списку</a>
        </div>
    `;
}

// ================================
// Initialization
// ================================

/**
 * Инициализация страницы
 */
async function init() {
    try {
        // Получить параметр VPN из URL
        const urlParams = new URLSearchParams(window.location.search);
        const vpnId = urlParams.get('vpn');
        
        if (!vpnId) {
            showError('VPN не выбран. Пожалуйста, выберите VPN из списка.');
            return;
        }
        
        // Загрузить данные
        const response = await fetch('vpn-data.json');
        
        if (!response.ok) {
            throw new Error('Не удалось загрузить данные');
        }
        
        const vpnDataRaw = await response.json();
        
        console.log('Загруженные данные:', vpnDataRaw);
        
        // Поддержка новой структуры с services или старой - массив
        const vpnData = vpnDataRaw.services || vpnDataRaw;
        
        console.log('VPN данные:', vpnData);
        
        // Проверка что vpnData это массив
        if (!Array.isArray(vpnData)) {
            throw new Error('Данные VPN не являются массивом');
        }
        
        // Обновить дату обновления
        if (vpnDataRaw.lastUpdated) {
            updateLastUpdatedDisplay(vpnDataRaw.lastUpdated);
        }
        
        // Найти VPN
        const vpn = vpnData.find(v => v.id === vpnId);
        
        if (!vpn) {
            showError(`VPN с ID "${vpnId}" не найден.`);
            return;
        }
        
        // Рендерить
        renderVPNDetail(vpn);
        
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        showError('Произошла ошибка при загрузке данных. Попробуйте обновить страницу.');
    }
}

// Запустить при загрузке
document.addEventListener('DOMContentLoaded', init);
