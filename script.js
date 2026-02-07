// ================================
// VPN Speed Test Data
// ================================
const vpnData = [
    {
        id: 'adguard',
        name: 'AdGuard',
        icon: 'assets/AdGuard/icon.webp',
        link: 'https://play.google.com/store/apps/details?id=com.adguard.vpn&pcampaignid=web_share',
        detailLink: 'assets/AdGuard/adguard.html',
        download: 19.4,
        upload: 31.1
    },
    {
        id: 'turbo-vpn',
        name: 'Turbo VPN',
        icon: 'assets/Turbo VPN/icon.webp',
        link: 'https://play.google.com/store/apps/details?id=free.vpn.unblock.proxy.turbovpn&pcampaignid=web_share',
        detailLink: 'assets/Turbo VPN/turbo-vpn.html',
        download: 2.81,
        upload: 2.79
    },
    {
        id: 'octohide-vpn',
        name: 'Octohide VPN',
        icon: 'assets/Octohide VPN/icon.webp',
        link: 'https://play.google.com/store/apps/details?id=octohide.vpn&pcampaignid=web_share',
        detailLink: 'assets/Octohide VPN/octohide-vpn.html',
        download: 4.94,
        upload: 6.98
    },
    {
        id: 'vpn-proxy-master',
        name: 'VPN Proxy Master',
        icon: 'assets/VPN Proxy Master/icon.webp',
        link: 'https://play.google.com/store/apps/details?id=free.vpn.unblock.proxy.vpn.master.pro&pcampaignid=web_share',
        detailLink: 'assets/VPN Proxy Master/vpn-proxy-master.html',
        download: 2.83,
        upload: 62.0
    },
    {
        id: 'jumpjump-vpn',
        name: 'JumpJump VPN',
        icon: 'assets/JumpJump VPN/icon.webp',
        link: 'https://play.google.com/store/apps/details?id=app.jumpjumpvpn.jumpjumpvpn&pcampaignid=web_share',
        detailLink: 'assets/JumpJump VPN/jumpjump-vpn.html',
        download: 73.7,
        upload: 63.8
    },
    {
        id: 'nashvpn',
        name: 'NashVPN',
        icon: 'assets/NashVPN/icon.webp',
        link: 'https://play.google.com/store/apps/details?id=com.nashvpn.vpn&pcampaignid=web_share',
        detailLink: 'assets/NashVPN/nashvpn.html',
        download: 70.6,
        upload: 43.5
    }
];

// ================================
// State
// ================================
let currentSort = {
    column: null,
    direction: 'asc'
};

let filteredData = [...vpnData];

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

// ================================
// Render Functions
// ================================

/**
 * Отрендерить карточки VPN сервисов
 */
function renderCards() {
    const container = document.getElementById('cards-container');
    
    if (filteredData.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                😕 Ничего не найдено. Попробуйте изменить запрос поиска.
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredData.map((item, index) => `
        <a href="${escapeHtml(item.detailLink)}" class="vpn-card-link" style="animation-delay: ${index * 0.1}s">
            <div class="vpn-card">
                <div class="card-header">
                    <img src="${escapeHtml(item.icon)}" 
                         alt="${escapeHtml(item.name)}" 
                         class="vpn-icon"
                         loading="lazy"
                         onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔒</text></svg>'">
                    <div class="vpn-info">
                        <h3 class="vpn-name">${escapeHtml(item.name)}</h3>
                    </div>
                </div>
                
                <div class="card-speeds">
                    <div class="speed-item">
                        <span class="speed-label">↓ Скачивание</span>
                        <span class="speed-badge ${getSpeedClass(item.download)}">
                            ${formatNumber(item.download)} Mbps
                        </span>
                    </div>
                    <div class="speed-item">
                        <span class="speed-label">↑ Загрузка</span>
                        <span class="speed-badge ${getSpeedClass(item.upload)}">
                            ${formatNumber(item.upload)} Mbps
                        </span>
                    </div>
                </div>
                
                <div class="speed-indicators">
                    <div class="indicator">
                        <span class="indicator-label">Скачивание</span>
                        <div class="indicator-bar">
                            <div class="indicator-fill ${getSpeedClass(item.download)}" 
                                 style="width: ${Math.min(item.download * 1.5, 100)}%"></div>
                        </div>
                        <span class="indicator-value">${getSpeedLabel(item.download)}</span>
                    </div>
                    <div class="indicator">
                        <span class="indicator-label">Загрузка</span>
                        <div class="indicator-bar">
                            <div class="indicator-fill ${getSpeedClass(item.upload)}" 
                                 style="width: ${Math.min(item.upload * 1.5, 100)}%"></div>
                        </div>
                        <span class="indicator-value">${getSpeedLabel(item.upload)}</span>
                    </div>
                </div>
                
                <div class="card-footer">
                    <span class="view-details">Подробнее →</span>
                </div>
            </div>
        </a>
    `).join('');
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
// Sort Functions
// ================================

/**
 * Сортировать по столбцу
 * @param {string} column - Имя столбца для сортировки
 */
function sortTable(column) {
    // Изменить направление сортировки
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }
    
    // Обновить иконки сортировки
    updateSortIcons();
    
    // Сортировать данные
    filteredData.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];
        
        // Для числовых значений
        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return currentSort.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        // Для строк
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
        
        if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });
    
    renderCards();
}

/**
 * Обновить иконки сортировки в заголовках
 */
function updateSortIcons() {
    document.querySelectorAll('button.sortable').forEach(btn => {
        btn.classList.remove('sorted', 'sorted-asc', 'sorted-desc');
        
        if (btn.dataset.sort === currentSort.column) {
            btn.classList.add('sorted');
            btn.classList.add(currentSort.direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
        }
    });
}

/**
 * Сбросить сортировку и показать все
 */
function resetSort() {
    currentSort.column = null;
    currentSort.direction = 'asc';
    
    // Убрать класс sorted со всех кнопок
    document.querySelectorAll('button.sortable').forEach(btn => {
        btn.classList.remove('sorted', 'sorted-asc', 'sorted-desc');
    });
    
    // Показать все данные
    filteredData = [...vpnData];
    renderCards();
}

// ================================
// Filter Functions
// ================================

/**
 * Фильтровать по поисковому запросу
 * @param {string} query - Поисковый запрос
 */
function filterTable(query) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredData = [...vpnData];
    } else {
        filteredData = vpnData.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Применить текущую сортировку
    if (currentSort.column) {
        sortTable(currentSort.column);
    } else {
        renderCards();
    }
}

// ================================
// Event Listeners
// ================================

/**
 * Инициализировать обработчики событий
 */
function initEventListeners() {
    // Сортировка по клику на кнопку
    document.querySelectorAll('button.sortable').forEach(btn => {
        btn.addEventListener('click', () => {
            sortTable(btn.dataset.sort);
        });
    });
    
    // Кнопка "Показать все"
    const showAllBtn = document.getElementById('show-all-btn');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', () => {
            resetSort();
            // Очистить поиск если есть
            const searchInput = document.getElementById('search');
            if (searchInput) {
                searchInput.value = '';
            }
        });
    }
    
    // Поиск с debounce
    const searchInput = document.getElementById('search');
    let debounceTimer;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            filterTable(e.target.value);
        }, 150);
    });
}

// ================================
// Initialization
// ================================

/**
 * Инициализация приложения
 */
function init() {
    renderCards();
    initEventListeners();
    
    console.log('🚀 VPN Speed Test карточки инициализированы');
    console.log(`📊 Всего сервисов: ${vpnData.length}`);
}

// Запустить при загрузке DOM
document.addEventListener('DOMContentLoaded', init);
