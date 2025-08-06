// Navbar Component Loader
// This script loads the navbar component into any page

class NavbarLoader {
  constructor(options = {}) {
    this.basePath = options.basePath || "../components";
    this.containerId = options.containerId || "navbar-container";
    this.autoInit = options.autoInit !== false;

    if (this.autoInit) {
      this.init();
    }
  }

  async init() {
    try {
      await this.loadComponent();
      await this.loadStyles();
      await this.loadScript();
    } catch (error) {
      console.error("Failed to load navbar component:", error);
    }
  }

  async loadComponent() {
    // Create container if it doesn't exist
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = this.containerId;
      document.body.insertBefore(container, document.body.firstChild);
    }

    try {
      const response = await fetch(`${this.basePath}/navbar-component.html`);
      if (!response.ok) throw new Error("Failed to fetch navbar HTML");

      const html = await response.text();
      container.innerHTML = html;
    } catch (error) {
      console.error("Error loading navbar HTML:", error);
      // Fallback to inline HTML
      this.loadFallbackHTML(container);
    }
  }

  async loadStyles() {
    // Check if styles already loaded
    if (document.getElementById("navbar-styles")) return;

    const link = document.createElement("link");
    link.id = "navbar-styles";
    link.rel = "stylesheet";
    link.href = `${this.basePath}/navbar-component.css`;

    // Add error handling
    link.onerror = () => {
      console.error("Failed to load navbar CSS");
      this.loadFallbackStyles();
    };

    document.head.appendChild(link);
  }

  async loadScript() {
    // Check if script already loaded
    if (window.navbarComponent) return;

    const script = document.createElement("script");
    script.src = `${this.basePath}/navbar-component.js`;
    script.defer = true;

    script.onerror = () => {
      console.error("Failed to load navbar JavaScript");
    };

    document.head.appendChild(script);
  }

  loadFallbackHTML(container) {
    // Minimal fallback navbar
    container.innerHTML = `
            <header class="main-header" style="position: sticky; top: 0; z-index: 1000; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 1rem 0;">
                <div style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 40px; height: 40px; background: #667eea; color: white; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: bold;">PO</div>
                        <a href="../index.html" style="font-size: 1.5rem; font-weight: bold; color: #333; text-decoration: none;">POPULAR ONLINE</a>
                    </div>
                    <nav style="display: flex; gap: 2rem;">
                        <a href="../index.html" style="color: #666; text-decoration: none; padding: 0.5rem 1rem;">Home</a>
                        <a href="../ourbook/ourbook.html" style="color: #666; text-decoration: none; padding: 0.5rem 1rem;">Our Books</a>
                        <a href="../stationery/stationery.html" style="color: #666; text-decoration: none; padding: 0.5rem 1rem;">Stationery</a>
                        <a href="../promotion/promotion.html" style="color: #666; text-decoration: none; padding: 0.5rem 1rem;">Promotion</a>
                        <a href="../review/review.html" style="color: #666; text-decoration: none; padding: 0.5rem 1rem;">Reviews</a>
                    </nav>
                    <div style="display: flex; gap: 1rem;">
                        <button style="background: none; border: 1px solid #ddd; padding: 0.5rem; border-radius: 8px; cursor: pointer;">
                            <i class="fas fa-search"></i>
                        </button>
                        <button style="background: none; border: 1px solid #ddd; padding: 0.5rem; border-radius: 8px; cursor: pointer;">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                        <button style="background: none; border: 1px solid #ddd; padding: 0.5rem; border-radius: 8px; cursor: pointer;">
                            <i class="fas fa-user"></i>
                        </button>
                    </div>
                </div>
            </header>
        `;
  }

  loadFallbackStyles() {
    // Minimal fallback styles
    const style = document.createElement("style");
    style.textContent = `
            .main-header { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            @media (max-width: 768px) {
                .main-header nav { display: none; }
                .main-header div:last-child { gap: 0.5rem; }
            }
        `;
    document.head.appendChild(style);
  }

  // Method to update navbar after dynamic changes
  refresh() {
    if (window.navbarComponent) {
      window.navbarComponent.updateActiveNavLink();
      window.navbarComponent.loadCartCount();
    }
  }

  // Method to set active page programmatically
  setActivePage(page) {
    if (window.navbarComponent) {
      window.navbarComponent.setActivePage(page);
    }
  }

  // Method to show notifications
  showNotification(message, type = "info") {
    if (window.navbarComponent) {
      window.navbarComponent.showNotification(message, type);
    }
  }

  // Method to update cart count
  updateCartCount(count) {
    if (window.navbarComponent) {
      window.navbarComponent.setCartCount(count);
    }
  }
}

// Auto-initialize when script loads
document.addEventListener("DOMContentLoaded", function () {
  // Check if navbar loader should be initialized
  const navbarContainer = document.getElementById("navbar-container");
  const autoLoad = document.querySelector("[data-navbar-autoload]");

  if (navbarContainer || autoLoad) {
    window.navbarLoader = new NavbarLoader({
      basePath: "../components",
      containerId: "navbar-container",
    });
  }
});

// Global utility functions
window.loadNavbar = function (options = {}) {
  return new NavbarLoader(options);
};

window.updateNavbarCart = function (count) {
  if (window.navbarLoader) {
    window.navbarLoader.updateCartCount(count);
  }
};

window.setActiveNavPage = function (page) {
  if (window.navbarLoader) {
    window.navbarLoader.setActivePage(page);
  }
};

window.showNavbarNotification = function (message, type = "info") {
  if (window.navbarLoader) {
    window.navbarLoader.showNotification(message, type);
  }
};

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = NavbarLoader;
}
