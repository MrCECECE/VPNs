/**
 * VPN Detail Page - Загрузка и отображение данных VPN
 * Использует общие утилиты из js/utils-shared.js
 */

import { escapeHtml, getRatingClass, renderRatingStars, formatNumber } from './js/utils-shared.js';

// ================================
// Render Functions
// ================================

/**
 * Отрендерить страницу с детальной информацией VPN
 * @param {Object} vpn - Данные VPN
 */
function renderVPNDetail(vpn) {
    // Обновить title
    document.getElementById('page-title').textContent = `${vpn.name} - VPN Speed Test`;
    
    // Обновить meta description
    document.querySelector('meta[name="description"]').content = `Подробная информация о VPN сервисе ${vpn.name}`;
    
    const screenshots = Array.isArray(vpn.screenshots) ? vpn.screenshots : [];

    // Рендерить контент
    const container = document.getElementById('vpn-content');
    container.innerHTML = `
        <div class="detail-header">
            <img src="${escapeHtml(vpn.icon)}" 
                 alt="${escapeHtml(vpn.name)}" 
                 class="detail-icon"
                 width="100"
                 height="100"
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

        ${screenshots.length > 0 ? `
        <section class="screenshots-section">
            <h2>📱 Скриншоты</h2>
            <div class="screenshots-strip">
                ${screenshots.map((src, i) => `
                    <button type="button" class="screenshot-thumb" data-index="${i}">
                        <img src="${escapeHtml(src)}"
                             alt="Скриншот ${i + 1} — ${escapeHtml(vpn.name)}"
                             loading="lazy"
                             onerror="this.closest('.screenshot-thumb').remove()">
                    </button>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <div class="action-section">
            <a href="${escapeHtml(vpn.link)}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="download-btn-large">
                📲 Скачать в Google Play
            </a>
        </div>
    `;
    
    if (screenshots.length > 0) {
        initLightbox(screenshots);
    }

    console.log(`🚀 VPN ${vpn.name} загружен`);
}

// ================================
// Lightbox - Полноэкранный просмотр скриншотов
// ================================

/**
 * Инициализировать лайтбокс для скриншотов
 * @param {string[]} screenshots - Пути к скриншотам
 */
function initLightbox(screenshots) {
    let currentIndex = 0;

    const overlay = document.createElement('div');
    overlay.id = 'lightbox';
    overlay.className = 'lightbox';
    overlay.hidden = true;
    overlay.innerHTML = `
        <button type="button" class="lightbox-close" aria-label="Закрыть">✕</button>
        <button type="button" class="lightbox-nav lightbox-prev" aria-label="Предыдущий">‹</button>
        <img class="lightbox-img" src="" alt="Просмотр скриншота">
        <button type="button" class="lightbox-nav lightbox-next" aria-label="Следующий">›</button>
    `;
    document.body.appendChild(overlay);

    const img = overlay.querySelector('.lightbox-img');

    function show(index) {
        currentIndex = (index + screenshots.length) % screenshots.length;
        img.src = screenshots[currentIndex];
    }

    function open(index) {
        show(index);
        overlay.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function close() {
        overlay.hidden = true;
        img.src = '';
        document.body.style.overflow = '';
    }

    document.querySelectorAll('#vpn-content .screenshot-thumb').forEach((thumb, i) => {
        thumb.addEventListener('click', () => open(i));
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('lightbox-close')) close();
        if (e.target.classList.contains('lightbox-prev')) show(currentIndex - 1);
        if (e.target.classList.contains('lightbox-next')) show(currentIndex + 1);
    });

    document.addEventListener('keydown', (e) => {
        if (overlay.hidden) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') show(currentIndex - 1);
        if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
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
        
        // no-cache: всегда сверять с сервером, чтобы данные не застаивались
        const response = await fetch('vpn-data.json', { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error('Не удалось загрузить данные');
        }
        const vpnDataRaw = await response.json();
        console.log('Данные загружены с сервера');
        
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
