// Main Page Script (Carousel and Product interactions only)
let currentSlideIndex = 0;

// DOM Elements
const slides = document.querySelectorAll(".carousel-slide");
const dots = document.querySelectorAll(".dot");

// Enhanced Carousel Functionality
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active", "prev");
    if (i === index) {
      slide.classList.add("active");
    } else if (i < index) {
      slide.classList.add("prev");
    }
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  currentSlideIndex = index;
}

function changeSlide(direction) {
  const newIndex =
    (currentSlideIndex + direction + slides.length) % slides.length;
  showSlide(newIndex);
}

function currentSlide(index) {
  showSlide(index - 1);
}

// Auto-play carousel
function startCarouselAutoplay() {
  setInterval(() => {
    changeSlide(1);
  }, 5000);
}

// Heart/Wishlist Functionality
function initializeWishlistButtons() {
  document.querySelectorAll(".action-btn.heart").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      this.classList.toggle("active");

      if (this.classList.contains("active")) {
        this.style.background = "var(--secondary-color)";
        this.style.color = "white";
        showToast("Added to wishlist! ❤️", "success");
      } else {
        this.style.background = "rgba(220, 38, 38, 0.1)";
        this.style.color = "var(--secondary-color)";
        showToast("Removed from wishlist", "info");
      }
    });
  });
}

// Share Functionality
function initializeShareButtons() {
  document.querySelectorAll(".action-btn.share").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation();
      const productCard = this.closest(".product-card");
      const productData = JSON.parse(productCard.dataset.product);

      if (navigator.share) {
        navigator.share({
          title: productData.title,
          text: `Check out this book: ${productData.title} for ${productData.price}`,
          url: window.location.href,
        });
      } else {
        // Fallback - copy to clipboard
        const url = `${window.location.href}#product-${productData.id}`;
        navigator.clipboard
          .writeText(url)
          .then(() => {
            showToast("Product link copied to clipboard!", "success");
          })
          .catch(() => {
            showToast("Unable to copy link", "error");
          });
      }
    });
  });
}

// Toast Notification System
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  const icons = {
    success: "check-circle",
    warning: "exclamation-triangle",
    error: "times-circle",
    info: "info-circle",
  };

  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <i class="fas fa-${icons[type] || icons.info}"></i>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    toast.style.transform = "translateX(400px)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Intersection Observer for Animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${
          Array.from(entry.target.parentNode.children).indexOf(entry.target) *
          0.1
        }s`;
        entry.target.classList.add("fade-in-up");
      }
    });
  }, observerOptions);

  // Observe product cards
  document.querySelectorAll(".product-card").forEach((card) => {
    observer.observe(card);
  });
}

// Product Card Hover Effects
function initializeProductCardEffects() {
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
}

// Search functionality
function createSearchBar() {
  const searchContainer = document.getElementById("searchBarContainer");
  if (!searchContainer) return;

  searchContainer.innerHTML = `
    <div class="search-bar">
      <input type="text" 
             class="search-input" 
             id="searchInput" 
             placeholder="Search books..." 
             autocomplete="off">
    </div>
  `;

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        this.style.display = "none";
        this.value = "";
      }
    });
  }
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const productData = JSON.parse(card.dataset.product);
    const title = productData.title.toLowerCase();

    if (title.includes(query)) {
      card.style.display = "block";
      card.style.opacity = "1";
    } else {
      card.style.opacity = query ? "0.3" : "1";
    }
  });
}

// Keyboard Navigation
function initializeKeyboardNavigation() {
  document.addEventListener("keydown", function (e) {
    // Escape key - close search
    if (e.key === "Escape") {
      const searchInput = document.getElementById("searchInput");
      if (searchInput && searchInput.style.display !== "none") {
        searchInput.style.display = "none";
        searchInput.value = "";
        handleSearch({ target: { value: "" } }); // Clear search
      }
    }

    // Arrow keys for carousel
    if (e.key === "ArrowLeft") {
      changeSlide(-1);
    }

    if (e.key === "ArrowRight") {
      changeSlide(1);
    }

    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.style.display =
          searchInput.style.display === "none" ? "block" : "none";
        if (searchInput.style.display === "block") {
          searchInput.focus();
        }
      }
    }
  });
}

// Performance Optimization - Lazy Loading Images
function initializeLazyLoading() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      }
    });
  });

  // Observe images with data-src attribute
  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize carousel
  if (slides.length > 0) {
    showSlide(0);
    startCarouselAutoplay();
  }

  // Initialize all interactive features
  initializeWishlistButtons();
  initializeShareButtons();
  initializeScrollAnimations();
  initializeProductCardEffects();
  initializeKeyboardNavigation();
  initializeLazyLoading();

  // Create search functionality
  createSearchBar();

  // Add stagger animation to product cards
  document.querySelectorAll(".product-card").forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Welcome message
  setTimeout(() => {
    showToast("Welcome to Popular Online Bookstore! 📚", "success");
  }, 1000);
});

// Export functions for global access (if needed)
window.bookstoreApp = {
  showSlide,
  changeSlide,
  currentSlide,
  showToast,
};
