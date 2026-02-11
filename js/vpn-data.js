// ================================
// VPN Data - Данные VPN сервисов (загружаются из JSON файла)
// ================================
export let vpnData = [];
export let currentSort = {
    column: null,
    direction: 'asc'
};
export let filteredData = [];
export let lastUpdated = null;
// Текущие значения фильтров
export let currentFilters = {
    rating: 0,
    download: 0,
    upload: 0,
    search: ''
};

/**
 * Загрузить данные из JSON файла
 */
export async function loadVpnData() {
    try {
        const response = await fetch('vpn-data.json');
        if (!response.ok) {
            throw new Error('Ошибка загрузки данных');
        }
        const data = await response.json();
        
        // Извлечь дату обновления
        lastUpdated = data.lastUpdated || null;
        
        // Извлечь сервисы
        vpnData = data.services || data;
        filteredData = [...vpnData];
        
        // Обновить дату в интерфейсе
        updateLastUpdatedDisplay();
        
        console.log(`📊 Загружено сервисов: ${vpnData.length}`);
        if (lastUpdated) {
            console.log(`📅 Обновлено: ${lastUpdated}`);
        }
        return vpnData;
    } catch (error) {
        console.error('Ошибка загрузки VPN данных:', error);
        return [];
    }
}

/**
 * Обновить отображение даты обновления
 */
function updateLastUpdatedDisplay() {
    const dateElement = document.getElementById('last-updated');
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
