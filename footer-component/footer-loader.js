// Footer Component Loader
class FooterLoader {
  constructor(options = {}) {
    this.basePath = options.basePath || "./components/footer";
    this.containerId = options.containerId || "footer-container";
    this.autoInit = options.autoInit !== false;

    if (this.autoInit) {
      this.init();
    }
  }

  async init() {
    try {
      await this.loadComponent();
      await this.loadStyles();
    } catch (error) {
      console.error("Failed to load footer component:", error);
    }
  }

  async loadComponent() {
    let container = document.getElementById(this.containerId);
    if (!container) {
      container = document.createElement("div");
      container.id = this.containerId;
      document.body.appendChild(container);
    }

    try {
      const response = await fetch(`${this.basePath}/footer-component.html`);
      if (!response.ok) throw new Error("Failed to fetch footer HTML");

      const html = await response.text();
      container.innerHTML = html;
    } catch (error) {
      console.error("Error loading footer HTML:", error);
      this.loadFallbackHTML(container);
    }
  }

  async loadStyles() {
    if (document.getElementById("footer-styles")) return;

    const link = document.createElement("link");
    link.id = "footer-styles";
    link.rel = "stylesheet";
    link.href = `${this.basePath}/footer-component.css`;

    link.onerror = () => {
      console.error("Failed to load footer CSS");
      this.loadFallbackStyles();
    };

    document.head.appendChild(link);
  }

  loadFallbackHTML(container) {
    container.innerHTML = `
      <footer style="background: #1f2937; color: white; padding: 3rem 5% 2rem; margin-top: 4rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto;">
          <div>
            <h3 style="font-size: 1.3rem; margin-bottom: 1rem;">About Us</h3>
            <a href="../location_map/location.html" style="display: block; color: #9ca3af; text-decoration: none; padding: 0.5rem 0; transition: color 0.3s;">Store Location</a>
            <a href="../career/career.html" style="display: block; color: #9ca3af; text-decoration: none; padding: 0.5rem 0; transition: color 0.3s;">Career</a>
          </div>
          <div>
            <h3 style="font-size: 1.3rem; margin-bottom: 1rem;">Information</h3>
            <a href="../privacy/privacy.html" style="display: block; color: #9ca3af; text-decoration: none; padding: 0.5rem 0; transition: color 0.3s;">Privacy Policy</a>
            <a href="../contactUs/contactus.html" style="display: block; color: #9ca3af; text-decoration: none; padding: 0.5rem 0; transition: color 0.3s;">Contact Us</a>
          </div>
          <div>
            <h3 style="font-size: 1.3rem; margin-bottom: 1rem;">Follow Us</h3>
            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
              <a href="#" style="width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#" style="width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="#" style="width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;">
                <i class="fab fa-youtube"></i>
              </a>
              <a href="#" style="width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none;">
                <i class="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 2rem; padding-top: 2rem; text-align: center; color: #9ca3af;">
          <p>&copy; 2024 Popular Online Bookstore. All rights reserved.</p>
        </div>
      </footer>
    `;
  }

  loadFallbackStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .footer a:hover { 
        color: #2563eb !important; 
        padding-left: 10px !important; 
      }
      .footer .social-icon:hover { 
        background: #2563eb !important; 
        transform: translateY(-3px) !important; 
      }
    `;
    document.head.appendChild(style);
  }
}

// Auto-initialize when script loads
document.addEventListener("DOMContentLoaded", function () {
  const footerContainer = document.getElementById("footer-container");
  const autoLoad = document.querySelector("[data-footer-autoload]");

  if (footerContainer || autoLoad) {
    window.footerLoader = new FooterLoader({
      basePath: "./components/footer",
      containerId: "footer-container",
    });
  }
});

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = FooterLoader;
}
