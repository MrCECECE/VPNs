// ================================
// Filter Functions - Логика фильтрации
// ================================
import { filteredData, vpnData, currentSort, currentFilters } from './vpn-data.js';
import { sortTable } from './sort.js';
import { renderCards } from './render.js';

/**
 * Фильтровать по поисковому запросу (для совместимости)
 * @param {string} query - Поисковый запрос
 */
export function filterTable(query) {
    currentFilters.search = query;
    applyFilters();
}

/**
 * Обновить отображение значений фильтров
 */
export function updateFilterDisplays() {
    // Rating
    const ratingValue = document.getElementById('rating-value');
    if (ratingValue) {
        ratingValue.textContent = currentFilters.rating > 0 ? `${currentFilters.rating.toFixed(1)}+` : '0+';
    }
    
    // Download
    const downloadValue = document.getElementById('download-value');
    if (downloadValue) {
        downloadValue.textContent = currentFilters.download > 0 ? `${currentFilters.download}+` : '0+';
    }
    
    // Upload
    const uploadValue = document.getElementById('upload-value');
    if (uploadValue) {
        uploadValue.textContent = currentFilters.upload > 0 ? `${currentFilters.upload}+` : '0+';
    }
}

/**
 * Применить фильтры
 */
export function applyFilters() {
    let tempData = vpnData;
    
    // Фильтр по поиску
    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase().trim();
        tempData = tempData.filter(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Фильтр по рейтингу
    if (currentFilters.rating > 0) {
        tempData = tempData.filter(item => item.rating >= currentFilters.rating);
    }
    
    // Фильтр по скачиванию
    if (currentFilters.download > 0) {
        tempData = tempData.filter(item => item.download >= currentFilters.download);
    }
    
    // Фильтр по загрузке
    if (currentFilters.upload > 0) {
        tempData = tempData.filter(item => item.upload >= currentFilters.upload);
    }
    
    filteredData.length = 0;
    tempData.forEach(item => filteredData.push(item));
    
    // Применить текущую сортировку
    if (currentSort.column) {
        sortTable(currentSort.column);
    } else {
        renderCards();
    }
}

/**
 * Сбросить все фильтры
 */
export function resetFilters() {
    currentFilters.rating = 0;
    currentFilters.download = 0;
    currentFilters.upload = 0;
    currentFilters.search = '';
    
    // Сбросить значения ползунков в UI
    const ratingFilter = document.getElementById('rating-filter');
    const downloadFilter = document.getElementById('download-filter');
    const uploadFilter = document.getElementById('upload-filter');
    const searchInput = document.getElementById('search');
    
    if (ratingFilter) ratingFilter.value = 0;
    if (downloadFilter) downloadFilter.value = 0;
    if (uploadFilter) uploadFilter.value = 0;
    if (searchInput) searchInput.value = '';
    
    // Обновить отображение
    updateFilterDisplays();
    
    // Применить фильтры
    applyFilters();
}

/**
 * Инициализировать обработчики фильтров
 */
export function initFilterListeners() {
    // Rating filter
    const ratingFilter = document.getElementById('rating-filter');
    if (ratingFilter) {
        ratingFilter.addEventListener('input', (e) => {
            currentFilters.rating = parseFloat(e.target.value);
            updateFilterDisplays();
            applyFilters();
        });
    }
    
    // Download filter
    const downloadFilter = document.getElementById('download-filter');
    if (downloadFilter) {
        downloadFilter.addEventListener('input', (e) => {
            currentFilters.download = parseFloat(e.target.value);
            updateFilterDisplays();
            applyFilters();
        });
    }
    
    // Upload filter
    const uploadFilter = document.getElementById('upload-filter');
    if (uploadFilter) {
        uploadFilter.addEventListener('input', (e) => {
            currentFilters.upload = parseFloat(e.target.value);
            updateFilterDisplays();
            applyFilters();
        });
    }
    
    // Reset button
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}
