// Simple Navbar Component JavaScript (Navigation Only)
class NavbarComponent {
  constructor() {
    this.header = null;
    this.mobileMenuToggle = null;
    this.navbar = null;
    this.isMenuOpen = false;

    this.init();
  }

  init() {
    this.bindElements();
    this.bindEvents();
    this.updateActiveNavLink();
    this.initScrollEffect();
  }

  bindElements() {
    this.header = document.querySelector(".main-header");
    this.mobileMenuToggle = document.getElementById("mobileMenuToggle");
    this.navbar = document.getElementById("navbar");
  }

  bindEvents() {
    // Mobile menu toggle
    if (this.mobileMenuToggle) {
      this.mobileMenuToggle.addEventListener("click", () =>
        this.toggleMobileMenu()
      );
    }

    // Handle navigation links
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMobileMenu());
    });

    // Handle window resize
    window.addEventListener("resize", () => this.handleResize());

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        this.isMenuOpen &&
        this.mobileMenuToggle &&
        !this.mobileMenuToggle.contains(e.target) &&
        this.navbar &&
        !this.navbar.contains(e.target)
      ) {
        this.closeMobileMenu();
      }
    });
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

  // Public method to highlight current page
  setActivePage(page) {
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const linkPage = link.getAttribute("data-page");
      link.classList.toggle("active", linkPage === page);
    });
  }
}

// Initialize navbar when DOM is loaded
let navbarComponent;

document.addEventListener("DOMContentLoaded", function () {
  navbarComponent = new NavbarComponent();
});

// Make navbarComponent available globally
window.navbarComponent = navbarComponent;

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = NavbarComponent;
}
