/** @odoo-module **/

import { NavBar } from "@web/webclient/navbar/navbar";
import { patch } from "@web/core/utils/patch";
import { onMounted } from "@odoo/owl";

patch(NavBar.prototype, {
    setup() {
        super.setup();

        if (!this.state.isAppsGridMenuOpen) {
            this.state.isAppsGridMenuOpen = false;
        }

        onMounted(() => {
            this.veritypack_renderAppsGridOverlay();
            this.veritypack_replaceAppsMenuButton();
        });
    },

    openAppsGridMenu() {
        this.state.isAppsGridMenuOpen = true;
        document.body.style.overflow = 'hidden';
        this.veritypack_renderAppsGridOverlay();
    },

    closeAppsGridMenu() {
        this.state.isAppsGridMenuOpen = false;
        document.body.style.overflow = '';
        this.veritypack_renderAppsGridOverlay();
    },

    onNavBarDropdownItemSelection(app) {
        super.onNavBarDropdownItemSelection(app);
    },

    onGridAppClick(ev, app) {
        this.closeAppsGridMenu();
        this.onNavBarDropdownItemSelection(app);
    },

    veritypack_replaceAppsMenuButton() {
        const appsMenuContainer = document.querySelector('.o_navbar_apps_menu');
        if (appsMenuContainer && !appsMenuContainer.classList.contains('veritypack-grid-replaced')) {
            appsMenuContainer.classList.add('veritypack-grid-replaced');
            appsMenuContainer.innerHTML = `
                <button class="custom_home_menu_button border-0 bg-transparent" 
                        data-hotkey="h" 
                        title="Home Menu">
                    <i class="oi oi-apps"></i>
                </button>
            `;
            const customButton = appsMenuContainer.querySelector('.custom_home_menu_button');
            if (customButton) {
                customButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openAppsGridMenu();
                });
            }
        }
    },

    veritypack_renderAppsGridOverlay() {
        let overlayContainer = document.getElementById('veritypack_apps_grid_overlay');
        if (!overlayContainer) {
            overlayContainer = document.createElement('div');
            overlayContainer.id = 'veritypack_apps_grid_overlay';
            document.body.appendChild(overlayContainer);
        }

        overlayContainer.innerHTML = '';
        if (this.state.isAppsGridMenuOpen) {
            const overlayHtml = this.veritypack_buildOverlayHTML();
            overlayContainer.innerHTML = overlayHtml;
            this.veritypack_attachOverlayEventListeners(overlayContainer);
        }
    },

    veritypack_buildOverlayHTML() {
        const apps = this.menuService.getApps();
        const appCards = apps.map(app => {
            let iconUrl = '';
            if (app.webIcon && typeof app.webIcon === 'string' && app.webIcon.includes(',')) {
                const parts = app.webIcon.split(',');
                iconUrl = `/${parts[0].trim()}/${parts[1].trim()}`;
            } else if (app.webIcon && typeof app.webIcon === 'string' && (app.webIcon.startsWith('/') || app.webIcon.startsWith('http') || app.webIcon.startsWith('data:'))) {
                iconUrl = app.webIcon;
            } else if (app.webIconData) {
                iconUrl = app.webIconData.startsWith('data:') ? app.webIconData : `data:image/png;base64,${app.webIconData}`;
            } else if (app.xmlid) {
                const mod = app.xmlid.split('.')[0];
                iconUrl = `/${mod}/static/description/icon.png`;
            } else {
                iconUrl = '/base/static/description/icon.png';
            }
            const iconHtml = `<img src="${iconUrl}" onerror="this.onerror=null;this.src='/base/static/description/icon.png';" alt=""/>`;

            return `
                <a href="${this.getMenuItemHref(app)}" 
                   class="custom_home_menu_app_card"
                   data-menu-xmlid="${app.xmlid || ''}"
                   data-section="${app.id}"
                   data-app-id="${app.id}">
                  <div class="custom_home_menu_app_icon">
                    ${iconHtml}
                  </div>
                  <div class="custom_home_menu_app_name">${app.name}</div>
                </a>
            `;
        }).join('');

        return `
            <div class="custom_home_menu_overlay">
              <button class="custom_home_menu_close" title="Close" aria-label="Close">
                  &times;
              </button>
              <div class="custom_home_menu_container">
                <div class="custom_home_menu_grid">
                  ${appCards}
                </div>
              </div>
            </div>
        `;
    },

    veritypack_attachOverlayEventListeners(container) {
        const overlay = container.querySelector('.custom_home_menu_overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeAppsGridMenu();
                }
            });
        }
        
        const closeBtn = container.querySelector('.custom_home_menu_close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeAppsGridMenu();
            });
        }

        const appCards = container.querySelectorAll('.custom_home_menu_app_card');
        appCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const appId = parseInt(card.dataset.appId);
                const app = this.menuService.getApps().find(a => a.id === appId);
                if (app) {
                    this.onGridAppClick(e, app);
                }
            });
        });
    },
});

patch(NavBar, {
    template: "web.NavBar",
});
