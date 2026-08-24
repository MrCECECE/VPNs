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
    // Rating (поле - числовой input)
    const ratingValue = document.getElementById('rating-value');
    if (ratingValue) {
        ratingValue.value = currentFilters.rating > 0 ? currentFilters.rating.toFixed(1) : '0';
    }
}

/**
 * Применить значение, введённое с клавиатуры в поле рейтинга
 * @param {HTMLInputElement} ratingValue - Поле ввода
 */
function commitRatingInput(ratingValue) {
    let val = parseFloat(String(ratingValue.value).replace(',', '.'));
    if (Number.isNaN(val)) val = 0;
    val = Math.min(5, Math.max(0, val));

    ratingValue.value = val > 0 ? val.toFixed(1) : '0';

    // Синхронизировать ползунок
    const ratingFilter = document.getElementById('rating-filter');
    if (ratingFilter) ratingFilter.value = val;

    currentFilters.rating = val;
    applyFilters();
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
    currentFilters.search = '';
    
    // Сбросить значения ползунков в UI
    const ratingFilter = document.getElementById('rating-filter');
    const searchInput = document.getElementById('search');
    
    if (ratingFilter) ratingFilter.value = 0;
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

    // Rating ручной ввод с клавиатуры
    const ratingValue = document.getElementById('rating-value');
    if (ratingValue) {
        ratingValue.addEventListener('change', () => commitRatingInput(ratingValue));
        ratingValue.addEventListener('blur', () => commitRatingInput(ratingValue));
        ratingValue.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') ratingValue.blur();
        });
    }
    
    // Reset button
    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}
