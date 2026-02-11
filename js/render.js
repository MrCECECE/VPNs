// ================================
// Render Functions - Рендеринг карточек
// ================================
import { escapeHtml, getSpeedClass, getSpeedLabel, getRatingClass, renderRatingStars, formatNumber } from './utils.js';
import { filteredData } from './vpn-data.js';

/**
 * Отрендерить карточки VPN сервисов
 */
export function renderCards() {
    const container = document.getElementById('cards-container');
    
    if (!container) return;
    
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
                        <div class="vpn-rating">
                            <span class="rating-stars ${getRatingClass(item.rating)}">${renderRatingStars(item.rating)}</span>
                            <span class="rating-value">${formatNumber(item.rating)}</span>
                            <span class="review-count">${escapeHtml(item.reviewCount)} отзывов</span>
                        </div>
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
