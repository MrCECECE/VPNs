// ================================
// Sort Functions - Логика сортировки
// ================================
import { currentSort, filteredData, vpnData } from './vpn-data.js';
import { renderCards } from './render.js';

/**
 * Обновить иконки сортировки в заголовках
 */
export function updateSortIcons() {
    document.querySelectorAll('button.sortable').forEach(btn => {
        btn.classList.remove('sorted', 'sorted-asc', 'sorted-desc');
        
        if (btn.dataset.sort === currentSort.column) {
            btn.classList.add('sorted');
            btn.classList.add(currentSort.direction === 'asc' ? 'sorted-asc' : 'sorted-desc');
        }
    });
}

/**
 * Сортировать по столбцу
 * @param {string} column - Имя столбца для сортировки
 */
export function sortTable(column) {
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
 * Сбросить сортировку и показать все
 */
export function resetSort() {
    currentSort.column = null;
    currentSort.direction = 'asc';
    
    // Убрать класс sorted со всех кнопок
    document.querySelectorAll('button.sortable').forEach(btn => {
        btn.classList.remove('sorted', 'sorted-asc', 'sorted-desc');
    });
    
    // Показать все данные
    filteredData.length = 0;
    vpnData.forEach(item => filteredData.push(item));
    
    renderCards();
}
