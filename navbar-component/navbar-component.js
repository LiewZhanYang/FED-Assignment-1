// Navbar Component JavaScript
class NavbarComponent {
  constructor() {
    this.header = null;
    this.mobileMenuToggle = null;
    this.navbar = null;
    this.userMenuToggle = null;
    this.userDropdown = null;
    this.searchToggle = null;
    this.searchContainer = null;
    this.searchInput = null;
    this.searchClose = null;
    this.cartCount = null;

    this.isMenuOpen = false;
    this.isUserMenuOpen = false;
    this.isSearchOpen = false;

    this.init();
  }

  init() {
    this.bindElements();
    this.bindEvents();
    this.updateActiveNavLink();
    this.initScrollEffect();
    this.loadCartCount();
  }

  bindElements() {
    this.header = document.querySelector(".main-header");
    this.mobileMenuToggle = document.getElementById("mobileMenuToggle");
    this.navbar = document.getElementById("navbar");
    this.userMenuToggle = document.getElementById("userMenuToggle");
    this.userDropdown = document.getElementById("userDropdown");
    this.searchToggle = document.getElementById("searchToggle");
    this.searchContainer = document.getElementById("searchContainer");
    this.searchInput = document.getElementById("searchInput");
    this.searchClose = document.getElementById("searchClose");
    this.cartCount = document.getElementById("cartCount");
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener("click", () =>
        this.toggleMobileMenu()
      );
    }

    // User menu toggle
    if (this.userMenuToggle) {
      this.userMenuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleUserMenu();
      });
    }

    // Search toggle
    if (this.searchToggle) {
      this.searchToggle.addEventListener("click", () => this.toggleSearch());
    }

    if (this.searchClose) {
      this.searchClose.addEventListener("click", () => this.closeSearch());
    }

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => this.handleOutsideClick(e));

    // Handle escape key
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));

    // Search functionality
    if (this.searchInput) {
      this.searchInput.addEventListener("input", (e) => this.handleSearch(e));
      this.searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.performSearch();
        }
      });
    }

    // Search submit
    const searchSubmit = document.querySelector(".search-submit");
    if (searchSubmit) {
      searchSubmit.addEventListener("click", () => this.performSearch());
    }

    // Handle navigation links
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMobileMenu());
    });

    // Handle window resize
    window.addEventListener("resize", () => this.handleResize());
  }

  toggleMobileMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.classList.toggle("active", this.isMenuOpen);
    }

    if (this.navbar) {
      this.navbar.classList.toggle("active", this.isMenuOpen);
    }

    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isMenuOpen ? "hidden" : "auto";

    // Close other menus
    if (this.isMenuOpen) {
      this.closeUserMenu();
      this.closeSearch();
    }
  }

  closeMobileMenu() {
    this.isMenuOpen = false;

    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.classList.remove("active");
    }

    if (this.navbar) {
      this.navbar.classList.remove("active");
    }

    document.body.style.overflow = "auto";
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;

    if (this.userDropdown) {
      this.userDropdown.classList.toggle("active", this.isUserMenuOpen);
    }

    // Close other menus
    if (this.isUserMenuOpen) {
      this.closeMobileMenu();
      this.closeSearch();
    }
  }

  closeUserMenu() {
    this.isUserMenuOpen = false;

    if (this.userDropdown) {
      this.userDropdown.classList.remove("active");
    }
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;

    if (this.searchContainer) {
      this.searchContainer.classList.toggle("active", this.isSearchOpen);
    }

    if (this.isSearchOpen && this.searchInput) {
      setTimeout(() => {
        this.searchInput.focus();
      }, 300);

      // Close other menus
      this.closeMobileMenu();
      this.closeUserMenu();
    }
  }

  closeSearch() {
    this.isSearchOpen = false;

    if (this.searchContainer) {
      this.searchContainer.classList.remove("active");
    }

    if (this.searchInput) {
      this.searchInput.value = "";
    }
  }

  handleOutsideClick(e) {
    // Close user menu if clicking outside
    if (
      this.isUserMenuOpen &&
      !this.userMenuToggle.contains(e.target) &&
      !this.userDropdown.contains(e.target)
    ) {
      this.closeUserMenu();
    }

    // Close mobile menu if clicking outside
    if (
      this.isMenuOpen &&
      !this.mobileMenuToggle.contains(e.target) &&
      !this.navbar.contains(e.target)
    ) {
      this.closeMobileMenu();
    }

    // Close search if clicking outside
    if (
      this.isSearchOpen &&
      !this.searchToggle.contains(e.target) &&
      !this.searchContainer.contains(e.target)
    ) {
      this.closeSearch();
    }
  }

  handleKeyDown(e) {
    if (e.key === "Escape") {
      this.closeUserMenu();
      this.closeMobileMenu();
      this.closeSearch();
    }
  }

  handleResize() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768 && this.isMenuOpen) {
      this.closeMobileMenu();
    }
  }

  updateActiveNavLink() {
    const currentPage = this.getCurrentPage();
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const page = link.getAttribute("data-page");
      link.classList.toggle("active", page === currentPage);
    });
  }

  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split("/").pop();

    // Map filenames to page identifiers
    const pageMap = {
      "index.html": "home",
      "ourbook.html": "books",
      "stationery.html": "stationery",
      "promotion.html": "promotion",
      "review.html": "reviews",
    };

    return pageMap[filename] || "home";
  }

  initScrollEffect() {
    let lastScrollY = 0;

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      if (this.header) {
        // Add scrolled class for styling
        this.header.classList.toggle("scrolled", currentScrollY > 50);

        // Hide header on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          this.header.style.transform = "translateY(-100%)";
        } else {
          this.header.style.transform = "translateY(0)";
        }

        lastScrollY = currentScrollY;
      }
    });
  }

  handleSearch(e) {
    const query = e.target.value.trim();

    if (query.length >= 2) {
      this.showSearchSuggestions(query);
    } else {
      this.hideSearchSuggestions();
    }
  }

  showSearchSuggestions(query) {
    const suggestions = this.getSearchSuggestions(query);
    const suggestionsContainer = document.getElementById("searchSuggestions");

    if (suggestionsContainer && suggestions.length > 0) {
      suggestionsContainer.innerHTML = suggestions
        .map(
          (item) => `
                <div class="suggestion-item" onclick="navbarComponent.selectSuggestion('${
                  item.title
                }')">
                    <i class="fas fa-${
                      item.type === "book" ? "book" : "search"
                    }"></i>
                    <span>${item.title}</span>
                    ${
                      item.type === "book"
                        ? `<span class="suggestion-price">${item.price}</span>`
                        : ""
                    }
                </div>
            `
        )
        .join("");

      suggestionsContainer.style.display = "block";
    }
  }

  hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById("searchSuggestions");
    if (suggestionsContainer) {
      suggestionsContainer.style.display = "none";
    }
  }

  getSearchSuggestions(query) {
    // Mock suggestions - replace with actual search API
    const mockSuggestions = [
      { title: "Elon Musk Biography", type: "book", price: 12.99 },
      { title: "JavaScript Programming", type: "book", price: 29.99 },
      { title: "Python for Beginners", type: "book", price: 24.99 },
      { title: "Web Development", type: "category" },
      { title: "Science Fiction", type: "category" },
      { title: "Business Books", type: "category" },
    ];

    return mockSuggestions
      .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }

  selectSuggestion(title) {
    if (this.searchInput) {
      this.searchInput.value = title;
    }
    this.hideSearchSuggestions();
    this.performSearch();
  }

  performSearch() {
    const query = this.searchInput ? this.searchInput.value.trim() : "";

    if (query) {
      // Track search event
      this.trackEvent("search_performed", { query });

      // Navigate to search results page
      window.location.href = `../search/search.html?q=${encodeURIComponent(
        query
      )}`;
    }
  }

  loadCartCount() {
    // Load cart count from localStorage or API
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    this.updateCartCount(cart.length);
  }

  updateCartCount(count) {
    if (this.cartCount) {
      this.cartCount.textContent = count > 0 ? count : "";
      this.cartCount.style.display = count > 0 ? "flex" : "none";
    }
  }

  // Public method to update cart count from other components
  setCartCount(count) {
    this.updateCartCount(count);
  }

  // Track events for analytics
  trackEvent(eventName, eventData = {}) {
    console.log("Navbar Event:", eventName, eventData);

    // Example: Google Analytics
    // gtag('event', eventName, eventData);

    // Example: Custom analytics
    // analytics.track(eventName, eventData);
  }

  // Public method to highlight current page
  setActivePage(page) {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const linkPage = link.getAttribute("data-page");
      link.classList.toggle("active", linkPage === page);
    });
  }

  // Method to show notification in navbar
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `navbar-notification ${type}`;
    notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

    // Add to header
    if (this.header) {
      this.header.appendChild(notification);

      // Auto remove after 5 seconds
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 5000);
    }
  }

  getNotificationIcon(type) {
    const icons = {
      success: "check-circle",
      error: "exclamation-triangle",
      warning: "exclamation-circle",
      info: "info-circle",
    };
    return icons[type] || "info-circle";
  }
}

// Initialize navbar when DOM is loaded
let navbarComponent;

document.addEventListener("DOMContentLoaded", function () {
  navbarComponent = new NavbarComponent();
});

// Listen for cart updates from other components
window.addEventListener("cartUpdated", function (e) {
  if (navbarComponent) {
    navbarComponent.setCartCount(e.detail.count);
  }
});

// Add notification styles
const notificationStyles = document.createElement("style");
notificationStyles.textContent = `
    .navbar-notification {
        position: fixed;
        top: 100px;
        right: 2rem;
        background: var(--glass-bg, rgba(255, 255, 255, 0.95));
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border, rgba(0, 0, 0, 0.1));
        border-radius: 12px;
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        min-width: 300px;
    }
    
    .navbar-notification.success {
        border-left: 4px solid #4ecdc4;
        color: #2d5a5a;
    }
    
    .navbar-notification.error {
        border-left: 4px solid #ff6b6b;
        color: #8b2635;
    }
    
    .navbar-notification.warning {
        border-left: 4px solid #ffa726;
        color: #8b5a00;
    }
    
    .navbar-notification.info {
        border-left: 4px solid #2196f3;
        color: #1565c0;
    }
    
    .navbar-notification button {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0.25rem;
        margin-left: auto;
        opacity: 0.6;
        transition: opacity 0.3s ease;
    }
    
    .navbar-notification button:hover {
        opacity: 1;
    }
    
    .suggestion-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem;
        cursor: pointer;
        transition: background 0.3s ease;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .suggestion-item:hover {
        background: rgba(102, 126, 234, 0.05);
    }
    
    .suggestion-item:last-child {
        border-bottom: none;
    }
    
    .suggestion-item i {
        color: #667eea;
        width: 16px;
        text-align: center;
    }
    
    .suggestion-price {
        margin-left: auto;
        font-weight: 600;
        color: #667eea;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .navbar-notification {
            right: 1rem;
            left: 1rem;
            min-width: auto;
        }
    }
`;

document.head.appendChild(notificationStyles);

// Export for use in other components
if (typeof module !== "undefined" && module.exports) {
  module.exports = NavbarComponent;
}
