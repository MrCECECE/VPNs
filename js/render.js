// ================================
// Render Functions - Рендеринг компактного списка VPN
// ================================
import { escapeHtml, getRatingClass, renderRatingStars, formatNumber } from './utils-shared.js';
import { filteredData, currentFilters } from './vpn-data.js';

const FALLBACK_ICON = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔒</text></svg>";

/**
 * Отрендерить компактный список VPN сервисов
 */
export function renderCards() {
    const container = document.getElementById('cards-container');

    if (!container) return;

    if (filteredData.length === 0) {
        const hasSearch = currentFilters.search || currentFilters.rating > 0;
        container.innerHTML = `
            <div class="no-results">
                😕 ${hasSearch ? 'Ничего не найдено. Попробуйте изменить запрос.' : 'Пока нет добавленных VPN сервисов.'}
            </div>
        `;
        return;
    }

    // Использовать DocumentFragment для оптимизации производительности
    const fragment = document.createDocumentFragment();
    const template = document.createElement('template');

    filteredData.forEach((item, index) => {
        template.innerHTML = `
            <li class="vpn-row" style="animation-delay: ${Math.min(index, 14) * 0.035}s">
                <a href="${escapeHtml(item.detailLink)}" class="vpn-row-main">
                    <img src="${escapeHtml(item.icon)}"
                         alt=""
                         class="vpn-icon"
                         width="44"
                         height="44"
                         loading="lazy"
                         onerror="this.onerror=null;this.src='${FALLBACK_ICON}'">
                    <span class="vpn-row-info">
                        <span class="vpn-name">${escapeHtml(item.name)}</span>
                        <span class="vpn-meta">
                            <span class="rating-stars ${getRatingClass(item.rating)}" aria-hidden="true">${renderRatingStars(item.rating)}</span>
                            <span class="rating-value">${formatNumber(item.rating)}</span>
                            <span class="review-count">${escapeHtml(item.reviewCount)} отзывов</span>
                        </span>
                    </span>
                    <span class="row-arrow" aria-hidden="true">→</span>
                </a>
                <a href="${escapeHtml(item.link)}"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="vpn-row-gplay"
                   title="${escapeHtml(item.name)} в Google Play"
                   aria-label="Открыть ${escapeHtml(item.name)} в Google Play">
                    <svg class="kOqhQd" aria-hidden="true" width="18" height="18" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0,0h40v40H0V0z"></path><g><path d="M19.7,19.2L4.3,35.3c0,0,0,0,0,0c0.5,1.7,2.1,3,4,3c0.8,0,1.5-0.2,2.1-0.6l0,0l17.4-9.9L19.7,19.2z" fill="#EA4335"></path><path d="M35.3,16.4L35.3,16.4l-7.5-4.3l-8.4,7.4l8.5,8.3l7.5-4.2c1.3-0.7,2.2-2.1,2.2-3.6C37.5,18.5,36.6,17.1,35.3,16.4z" fill="#FBBC04"></path><path d="M4.3,4.7C4.2,5,4.2,5.4,4.2,5.8v28.5c0,0.4,0,0.7,0.1,1.1l16-15.7L4.3,4.7z" fill="#4285F4"></path><path d="M19.8,20l8-7.9L10.5,2.3C9.9,1.9,9.1,1.7,8.3,1.7c-1.9,0-3.6,1.3-4,3c0,0,0,0,0,0L19.8,20z" fill="#34A853"></path></g></svg>
                </a>
            </li>
        `;
        fragment.appendChild(template.content.firstElementChild);
    });

    container.innerHTML = '';
    container.appendChild(fragment);
}
