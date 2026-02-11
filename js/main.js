// ================================
// Main Module - Главный модуль инициализации
// ================================
import { renderCards } from './render.js';
import { sortTable } from './sort.js';
import { resetSort } from './sort.js';
import { filterTable, resetFilters, initFilterListeners } from './filter.js';
import { loadVpnData, filteredData, currentFilters } from './vpn-data.js';

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
            // Сбросить фильтры
            resetFilters();
        });
    }
    
    // Поиск с debounce
    const searchInput = document.getElementById('search');
    if (searchInput) {
        let debounceTimer;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                currentFilters.search = e.target.value;
                filterTable(e.target.value);
            }, 150);
        });
    }
}

/**
 * Инициализация приложения
 */
async function init() {
    // Загрузить данные из JSON файла
    await loadVpnData();
    
    // Инициализировать обработчики фильтров
    initFilterListeners();
    
    // Рендерить карточки после загрузки данных
    renderCards();
    initEventListeners();
    
    console.log('🚀 VPNS карточки инициализированы');
    console.log(`📊 Всего сервисов: ${filteredData.length}`);
}

// Запустить при загрузке DOM
document.addEventListener('DOMContentLoaded', init);

/**
 * Beta Mode - Переключение beta-режима
 */
function initBetaMode() {
    const betaBtn = document.getElementById('beta-btn');
    
    if (!betaBtn) return;
    
    // Проверить сохранённое состояние
    const isBetaMode = localStorage.getItem('betaMode') === 'true';
    
    // Применить сохранённое состояние
    if (isBetaMode) {
        document.body.classList.add('beta-mode');
    }
    
    // Обработчик клика
    betaBtn.addEventListener('click', () => {
        const body = document.body;
        const isEnabled = body.classList.toggle('beta-mode');
        
        // Сохранить состояние
        localStorage.setItem('betaMode', isEnabled);
        
        // Показать уведомление
        showBetaToast(isEnabled ? '✨ Beta-режим включён!' : '👋 Beta-режим выключен');
        
        console.log(`🚀 Beta Mode: ${isEnabled ? 'ON' : 'OFF'}`);
    });
}

/**
 * Показать toast-уведомление
 */
function showBetaToast(message) {
    const toast = document.getElementById('beta-toast');
    const toastMessage = document.getElementById('beta-toast-message');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    // Добавить класс для анимации появления
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Скрыть через 3 секунды
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 400);
    }, 3000);
}

/**
 * Toggle Filter - Сворачивание/разворачивание фильтров
 */
function initToggleFilter() {
    const toggleBtn = document.getElementById('toggle-filter-btn');
    const filterContent = document.getElementById('filter-content');
    
    if (!toggleBtn || !filterContent) return;
    
    // Проверить сохранённое состояние
    const isCollapsed = localStorage.getItem('filterCollapsed') === 'true';
    
    // Применить сохранённое состояние
    if (isCollapsed) {
        filterContent.classList.add('hidden');
        toggleBtn.classList.add('collapsed');
    }
    
    // Обработчик клика
    toggleBtn.addEventListener('click', () => {
        const isHidden = filterContent.classList.toggle('hidden');
        toggleBtn.classList.toggle('collapsed');
        
        // Сохранить состояние
        localStorage.setItem('filterCollapsed', isHidden);
        
        console.log(`🎛️ Filter: ${isHidden ? 'collapsed' : 'expanded'}`);
    });
}

// Инициализировать beta-режим
initBetaMode();

// Инициализировать переключение фильтра
initToggleFilter();
