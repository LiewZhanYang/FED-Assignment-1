// Global Variables
let currentSlideIndex = 0;
let cart = [];
let cartCount = 0;

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

// Enhanced Cart Functionality
function updateCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

function addToCart(button) {
  const productCard = button.closest(".product-card");
  const productData = JSON.parse(productCard.dataset.product);

  // Add loading state
  const originalText = button.innerHTML;
  button.innerHTML = '<div class="loading"></div>';
  button.disabled = true;

  setTimeout(() => {
    // Check if product already exists in cart
    const existingItem = cart.find((item) => item.id === productData.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...productData,
        quantity: 1,
      });
    }

    cartCount++;
    updateCartCount();
    updateCartDisplay();

    // Show success feedback
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.background = "var(--success-color)";

    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = "var(--primary-color)";
      button.disabled = false;
    }, 1500);

    // Show toast notification
    showToast("Product added to cart!", "success");
  }, 800);
}

function removeFromCart(productId) {
  const itemIndex = cart.findIndex((item) => item.id === productId);
  if (itemIndex > -1) {
    cartCount -= cart[itemIndex].quantity;
    cart.splice(itemIndex, 1);
    updateCartCount();
    updateCartDisplay();
    showToast("Product removed from cart", "info");
  }
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    const oldQuantity = item.quantity;
    item.quantity += change;

    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    cartCount += change;
    updateCartCount();
    updateCartDisplay();
  }
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cartItems");

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="cart-empty" style="text-align: center; padding: 2rem; color: #9ca3af;">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartItems.innerHTML = `
        ${cart
          .map(
            (item) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${
                          item.id
                        }, -1)">-</button>
                        <span style="margin: 0 10px; font-weight: 600;">${
                          item.quantity
                        }</span>
                        <button class="qty-btn" onclick="updateQuantity(${
                          item.id
                        }, 1)">+</button>
                        <button class="qty-btn" onclick="removeFromCart(${
                          item.id
                        })" style="margin-left: 10px; color: var(--secondary-color);">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `
          )
          .join("")}
        <div style="border-top: 2px solid var(--border-color); margin-top: 1rem; padding-top: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 1.2rem; font-weight: 700;">
                <span>Total:</span>
                <span style="color: var(--primary-color);">$${total.toFixed(
                  2
                )}</span>
            </div>
        </div>
    `;
}

function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  if (!cartSidebar) return;

  cartSidebar.classList.toggle("open");

  // Add backdrop
  if (cartSidebar.classList.contains("open")) {
    const backdrop = document.createElement("div");
    backdrop.className = "cart-backdrop";
    backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
    document.body.appendChild(backdrop);

    setTimeout(() => (backdrop.style.opacity = "1"), 10);

    backdrop.onclick = () => {
      toggleCart();
    };
  } else {
    const backdrop = document.querySelector(".cart-backdrop");
    if (backdrop) {
      backdrop.style.opacity = "0";
      setTimeout(() => backdrop.remove(), 300);
    }
  }
}

function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!", "warning");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  showToast(
    `Proceeding to checkout with total: $${total.toFixed(2)}`,
    "success"
  );

  // Simulate checkout process
  setTimeout(() => {
    cart = [];
    cartCount = 0;
    updateCartCount();
    updateCartDisplay();
    toggleCart();
    showToast("Order placed successfully! 🎉", "success");
  }, 2000);
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
          text: `Check out this book: ${productData.title} for $${productData.price}`,
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

// Smooth Scrolling for Navigation
function initializeSmoothScrolling() {
  document.querySelectorAll(".navbar a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Header Scroll Effect
function initializeHeaderScrollEffect() {
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.98)";
      header.style.backdropFilter = "blur(20px)";
    } else {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.backdropFilter = "blur(10px)";
    }

    // Hide/show header on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastScrollY = currentScrollY;
  });
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
    // Escape key - close cart or search
    if (e.key === "Escape") {
      const cartSidebar = document.getElementById("cartSidebar");
      const searchInput = document.getElementById("searchInput");

      if (cartSidebar && cartSidebar.classList.contains("open")) {
        toggleCart();
      } else if (searchInput && searchInput.style.display !== "none") {
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

function goToBooks() {
  // Try multiple possible paths
  const possiblePaths = [
    "ourbook.html",
    "ourbook/ourbook.html",
    "./ourbook/ourbook.html",
    "../ourbook/ourbook.html",
  ];

  // Try each path until one works
  window.location.href = "ourbook/ourbook.html";
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

// Theme Toggle (Optional feature)
function initializeThemeToggle() {
  // You can add a theme toggle button if needed
  const theme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", theme);
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
  initializeSmoothScrolling();
  initializeHeaderScrollEffect();
  initializeScrollAnimations();
  initializeProductCardEffects();
  initializeKeyboardNavigation();
  initializeLazyLoading();
  initializeThemeToggle();

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

// Handle window resize
window.addEventListener("resize", () => {
  // Adjust cart sidebar for mobile
  const cartSidebar = document.getElementById("cartSidebar");
  if (cartSidebar && window.innerWidth <= 768) {
    cartSidebar.style.width = "100vw";
  } else if (cartSidebar) {
    cartSidebar.style.width = "400px";
  }
});

// Export functions for global access (if needed)
window.bookstoreApp = {
  showSlide,
  changeSlide,
  currentSlide,
  addToCart,
  removeFromCart,
  updateQuantity,
  toggleCart,
  checkout,
  showToast,
};
