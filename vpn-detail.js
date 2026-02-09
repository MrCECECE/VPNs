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
                <p>${escapeHtml(vpn.shortDescription)}</p>
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
            <a href="${escapeHtml(vpn.playStoreLink)}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="download-btn-large">
                📲 Скачать в Google Play
            </a>
        </div>

        <div class="description-section">
            <h2>📝 Описание</h2>
            <p>${escapeHtml(vpn.description)}</p>
        </div>

        <div class="features-section">
            <h2>✨ Особенности</h2>
            <ul class="features-list">
                ${vpn.features.map(feature => `<li>${escapeHtml(feature)}</li>`).join('')}
            </ul>
        </div>
    `;
    
    console.log(`🚀 VPN ${vpn.name} загружен`);
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
        
        const vpnData = await response.json();
        
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
