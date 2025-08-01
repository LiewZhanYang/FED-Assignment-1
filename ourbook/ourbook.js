// Enhanced Our Books Page JavaScript

// Global Variables
let currentView = "grid";
let activeCategory = "english";
let searchQuery = "";
let priceRange = 100;
let sortBy = "default";
let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

// Sample book data for demonstration
const bookDatabase = {
  english: [
    {
      id: 1,
      title: "Elon Musk Biography",
      author: "Walter Isaacson",
      price: 12.99,
      originalPrice: 15.99,
      category: "english",
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
      rating: 4.2,
      description: "The definitive biography of tech visionary Elon Musk.",
    },
    {
      id: 2,
      title: "Not Here To Stay",
      author: "Contemporary Author",
      price: 40.5,
      originalPrice: 45.5,
      category: "english",
      image:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
      rating: 4.8,
      description: "A thought-provoking contemporary novel.",
    },
  ],
  chinese: [
    {
      id: 5,
      title: "古典文学精选",
      author: "经典作品集",
      price: 25.99,
      originalPrice: 35.99,
      category: "chinese",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      rating: 4.9,
      description: "精选古典文学经典作品合集",
    },
  ],
  fiction: [
    {
      id: 10,
      title: "The Midnight Library",
      author: "Matt Haig",
      price: 22.99,
      originalPrice: 28.99,
      category: "fiction",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      rating: 4.6,
      description: "A magical story about the choices we make in life.",
    },
  ],
  business: [
    {
      id: 15,
      title: "Think and Grow Rich",
      author: "Napoleon Hill",
      price: 18.99,
      originalPrice: 24.99,
      category: "business",
      image:
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop",
      rating: 4.5,
      description: "The classic guide to wealth and success.",
    },
  ],
};

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  initializeEnhancedFeatures();
  loadCategoryBooks();
  updateWishlistDisplay();
  createScrollToTopButton();
});

// Initialize enhanced features
function initializeEnhancedFeatures() {
  // Initialize price slider
  const priceSlider = document.getElementById("priceRange");
  if (priceSlider) {
    priceSlider.addEventListener("input", handlePriceFilter);
    updatePriceDisplay(priceSlider.value);
  }

  // Initialize sort select
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", handleSort);
  }

  // Initialize view toggle
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      toggleView(this.dataset.view);
    });
  });

  // Initialize category links
  document.querySelectorAll(".category-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const category = this.dataset.category;
      switchCategory(category);
      scrollToSection(this.getAttribute("href"));
    });
  });

  // Initialize search functionality
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        performSearch();
      }
    });
  }

  // Initialize scroll spy
  initializeScrollSpy();

  // Initialize intersection observer for animations
  initializeAnimationObserver();
}

// Toggle search overlay
function toggleSearch() {
  const searchOverlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("searchInput");

  if (searchOverlay.classList.contains("active")) {
    searchOverlay.classList.remove("active");
    document.body.style.overflow = "";
  } else {
    searchOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    setTimeout(() => searchInput.focus(), 300);
  }
}

// Toggle sidebar (mobile)
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("active");

  // Add backdrop for mobile
  if (sidebar.classList.contains("active")) {
    const backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
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
      toggleSidebar();
    };
  } else {
    const backdrop = document.querySelector(".sidebar-backdrop");
    if (backdrop) {
      backdrop.style.opacity = "0";
      setTimeout(() => backdrop.remove(), 300);
    }
  }
}

// Switch category
function switchCategory(category) {
  activeCategory = category;

  // Update active category link
  document.querySelectorAll(".category-link").forEach((link) => {
    link.classList.remove("active");
  });
  document
    .querySelector(`[data-category="${category}"]`)
    .classList.add("active");

  // Load books for category
  loadCategoryBooks(category);
}

// Load books for category
function loadCategoryBooks(category = activeCategory) {
  const books = bookDatabase[category] || [];
  const container = document.querySelector(`#${category}-book .products-grid`);

  if (!container) return;

  container.innerHTML = books.map((book) => createBookCard(book)).join("");

  // Initialize card animations
  setTimeout(() => {
    container.querySelectorAll(".product-card").forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add("fade-in-up");
    });
  }, 100);
}

// Create book card HTML
function createBookCard(book) {
  const discount = Math.round(
    ((book.originalPrice - book.price) / book.originalPrice) * 100
  );
  const isWishlisted = wishlist.includes(book.id);

  return `
        <div class="product-card" data-product='${JSON.stringify(book)}'>
            <div class="product-image">
                <img src="${book.image}" alt="${book.title}" loading="lazy">
                <div class="discount-badge">-${discount}%</div>
                <div class="product-actions">
                    <button class="action-btn heart ${
                      isWishlisted ? "active" : ""
                    }" onclick="toggleWishlist(this)">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn cart" onclick="addToCart(this)">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <button class="action-btn share" onclick="shareProduct(this)">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
                <div class="quick-view" onclick="quickView(this)">
                    <i class="fas fa-eye"></i>
                    Quick View
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${book.title}</h3>
                <p class="product-author">by ${book.author}</p>
                <div class="product-rating">
                    ${generateStarRating(book.rating)}
                    <span>(${book.rating})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${book.price.toFixed(2)}</span>
                    <span class="original-price">$${book.originalPrice.toFixed(
                      2
                    )}</span>
                </div>
        </div>
    `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close quick view modal
function closeQuickView() {
  const modal = document.getElementById("quickViewModal");
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Add to cart from modal
function addToCartFromModal(productId) {
  // Find the product data
  let productData = null;
  for (const category in bookDatabase) {
    const book = bookDatabase[category].find((b) => b.id === productId);
    if (book) {
      productData = book;
      break;
    }
  }

  if (productData) {
    // Use the existing addToCart functionality
    addToCartData(productData);
    closeQuickView();
  }
}

// Toggle wishlist from modal
function toggleWishlistFromModal(productId) {
  const isWishlisted = wishlist.includes(productId);

  if (isWishlisted) {
    wishlist = wishlist.filter((id) => id !== productId);
    showToast("Removed from wishlist", "info");
  } else {
    wishlist.push(productId);
    showToast("Added to wishlist! ❤️", "success");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistDisplay();
}

// Add to cart with product data
function addToCartData(productData) {
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
  showToast(`${productData.title} added to cart!`, "success");
}

// Handle price filter
function handlePriceFilter(e) {
  priceRange = parseFloat(e.target.value);
  updatePriceDisplay(priceRange);
  filterProducts();
}

// Update price display
function updatePriceDisplay(value) {
  const maxPriceElement = document.getElementById("maxPrice");
  if (maxPriceElement) {
    maxPriceElement.textContent = `${value}`;
  }
}

// Handle sorting
function handleSort(e) {
  sortBy = e.target.value;
  sortProducts();
}

// Handle search
function handleSearch(e) {
  searchQuery = e.target.value.toLowerCase();
  filterProducts();
}

// Perform search
function performSearch() {
  filterProducts();
  if (searchQuery) {
    showToast(`Searching for "${searchQuery}"...`, "info");
  }
}

// Filter products
function filterProducts() {
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const productData = JSON.parse(card.dataset.product);
    const matchesSearch =
      !searchQuery ||
      productData.title.toLowerCase().includes(searchQuery) ||
      productData.author.toLowerCase().includes(searchQuery);
    const matchesPrice = productData.price <= priceRange;

    if (matchesSearch && matchesPrice) {
      card.classList.remove("hidden");
      card.style.display = "";
    } else {
      card.classList.add("hidden");
      card.style.display = "none";
    }
  });
}

// Sort products
function sortProducts() {
  const containers = document.querySelectorAll(".products-grid");

  containers.forEach((container) => {
    const cards = Array.from(container.querySelectorAll(".product-card"));

    cards.sort((a, b) => {
      const dataA = JSON.parse(a.dataset.product);
      const dataB = JSON.parse(b.dataset.product);

      switch (sortBy) {
        case "price-low":
          return dataA.price - dataB.price;
        case "price-high":
          return dataB.price - dataA.price;
        case "name":
          return dataA.title.localeCompare(dataB.title);
        case "discount":
          const discountA =
            ((dataA.originalPrice - dataA.price) / dataA.originalPrice) * 100;
          const discountB =
            ((dataB.originalPrice - dataB.price) / dataB.originalPrice) * 100;
          return discountB - discountA;
        default:
          return 0;
      }
    });

    // Re-append sorted cards
    cards.forEach((card) => container.appendChild(card));
  });

  showToast("Products sorted successfully!", "success");
}

// Toggle view (grid/list)
function toggleView(view) {
  currentView = view;

  // Update active button
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-view="${view}"]`).classList.add("active");

  // Update grid classes
  document.querySelectorAll(".products-grid").forEach((grid) => {
    if (view === "list") {
      grid.classList.add("list-view");
    } else {
      grid.classList.remove("list-view");
    }
  });

  showToast(`Switched to ${view} view`, "info");
}

// Load more books
function loadMoreBooks(category) {
  const loadingSpinner = document.getElementById("loadingSpinner");
  loadingSpinner.classList.add("active");

  // Simulate API call
  setTimeout(() => {
    // In a real app, you would fetch more books from your API
    const additionalBooks = generateMoreBooks(category, 4);
    const container = document.querySelector(
      `#${category}-book .products-grid`
    );

    additionalBooks.forEach((book, index) => {
      const cardHTML = createBookCard(book);
      const cardElement = document.createElement("div");
      cardElement.innerHTML = cardHTML;
      const card = cardElement.firstElementChild;

      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add("fade-in-up");
      container.appendChild(card);
    });

    loadingSpinner.classList.remove("active");
    showToast(`Loaded ${additionalBooks.length} more books!`, "success");
  }, 1500);
}

// Generate more books (demo function)
function generateMoreBooks(category, count) {
  const sampleTitles = {
    english: [
      "The Great Adventure",
      "Modern Science",
      "Art of Living",
      "Future Vision",
    ],
    chinese: ["现代文学", "古典诗词", "哲学思考", "历史回顾"],
    fiction: ["Mystery Night", "Space Odyssey", "Love Story", "Epic Fantasy"],
    business: [
      "Leadership 101",
      "Marketing Mastery",
      "Finance Guide",
      "Startup Success",
    ],
  };

  const books = [];
  const titles = sampleTitles[category] || sampleTitles.english;

  for (let i = 0; i < count; i++) {
    const basePrice = 15 + Math.random() * 30;
    const discount = 0.1 + Math.random() * 0.4;

    books.push({
      id: Date.now() + i,
      title: titles[i % titles.length] + ` ${Math.floor(Math.random() * 100)}`,
      author: "New Author",
      price: basePrice * (1 - discount),
      originalPrice: basePrice,
      category: category,
      image: `https://images.unsplash.com/photo-${
        1500000000000 + Math.floor(Math.random() * 100000000)
      }?w=300&h=400&fit=crop`,
      rating: 3.5 + Math.random() * 1.5,
      description: "An amazing book that will captivate your imagination.",
    });
  }

  return books;
}

// Scroll to section
function scrollToSection(sectionId) {
  const section = document.querySelector(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Initialize scroll spy
function initializeScrollSpy() {
  const sections = document.querySelectorAll(".products-section");
  const categoryLinks = document.querySelectorAll(".category-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const category = sectionId.replace("-book", "").replace("-", "");

          categoryLinks.forEach((link) => {
            link.classList.remove("active");
          });

          const activeLink = document.querySelector(
            `[data-category="${category}"]`
          );
          if (activeLink) {
            activeLink.classList.add("active");
            activeCategory = category;
          }
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "-80px 0px -50% 0px",
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

// Initialize animation observer
function initializeAnimationObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Observe elements that should animate on scroll
  document.querySelectorAll(".product-card, .section-title").forEach((el) => {
    observer.observe(el);
  });
}

// Create scroll to top button
function createScrollToTopButton() {
  const button = document.createElement("button");
  button.className = "scroll-to-top";
  button.innerHTML = '<i class="fas fa-chevron-up"></i>';
  button.onclick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  document.body.appendChild(button);

  // Show/hide on scroll
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      button.classList.add("visible");
    } else {
      button.classList.remove("visible");
    }
  });
}

// Close modals on outside click
document.addEventListener("click", function (e) {
  // Close search overlay
  if (e.target.classList.contains("search-overlay")) {
    toggleSearch();
  }

  // Close quick view modal
  if (e.target.classList.contains("modal-overlay")) {
    closeQuickView();
  }
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Escape key - close overlays
  if (e.key === "Escape") {
    const searchOverlay = document.getElementById("searchOverlay");
    const quickViewModal = document.getElementById("quickViewModal");

    if (searchOverlay.classList.contains("active")) {
      toggleSearch();
    } else if (quickViewModal.classList.contains("active")) {
      closeQuickView();
    }
  }

  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    toggleSearch();
  }

  // Number keys for category switching
  if (e.key >= "1" && e.key <= "4") {
    const categories = ["english", "chinese", "fiction", "business"];
    const categoryIndex = parseInt(e.key) - 1;
    if (categories[categoryIndex]) {
      switchCategory(categories[categoryIndex]);
      scrollToSection(`#${categories[categoryIndex]}-book`);
    }
  }
});

// Performance optimization - Debounce search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to search
const debouncedSearch = debounce(performSearch, 300);

// Update search input listener to use debounced version
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", function (e) {
      searchQuery = e.target.value.toLowerCase();
      debouncedSearch();
    });
  }
});

// Toast notification function (if not already defined in main script)
if (typeof showToast === "undefined") {
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
}

// Analytics tracking (optional)
function trackEvent(eventName, category, data = {}) {
  // Example: Google Analytics, Adobe Analytics, etc.
  console.log(`Event: ${eventName}, Category: ${category}`, data);

  // If you have analytics setup:
  // gtag('event', eventName, {
  //     event_category: category,
  //     ...data
  // });
}

// Track user interactions
document.addEventListener("click", function (e) {
  if (e.target.closest(".action-btn.cart")) {
    trackEvent("add_to_cart", "ecommerce");
  } else if (e.target.closest(".action-btn.heart")) {
    trackEvent("add_to_wishlist", "engagement");
  } else if (e.target.closest(".quick-view")) {
    trackEvent("quick_view", "engagement");
  }
});

// Export functions for global access
window.ourBooksApp = {
  toggleSearch,
  toggleSidebar,
  switchCategory,
  toggleWishlist,
  shareProduct,
  quickView,
  closeQuickView,
  loadMoreBooks,
  toggleView,
  trackEvent,
};

// Generate star rating HTML
function generateStarRating(rating) {
  let stars = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }

  return stars;
}

// Toggle wishlist
function toggleWishlist(button) {
  const productCard = button.closest(".product-card");
  const productData = JSON.parse(productCard.dataset.product);

  button.classList.toggle("active");

  if (button.classList.contains("active")) {
    wishlist.push(productData.id);
    showToast(`${productData.title} added to wishlist! ❤️`, "success");
  } else {
    wishlist = wishlist.filter((id) => id !== productData.id);
    showToast(`${productData.title} removed from wishlist`, "info");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  updateWishlistDisplay();
}

// Update wishlist display
function updateWishlistDisplay() {
  document.querySelectorAll(".product-card").forEach((card) => {
    const productData = JSON.parse(card.dataset.product);
    const heartBtn = card.querySelector(".action-btn.heart");

    if (wishlist.includes(productData.id)) {
      heartBtn.classList.add("active");
    } else {
      heartBtn.classList.remove("active");
    }
  });
}

// Share product
function shareProduct(button) {
  const productCard = button.closest(".product-card");
  const productData = JSON.parse(productCard.dataset.product);

  if (navigator.share) {
    navigator.share({
      title: productData.title,
      text: `Check out "${productData.title}" by ${productData.author} for $${productData.price}`,
      url: window.location.href + `#product-${productData.id}`,
    });
  } else {
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
}

// Quick view functionality
function quickView(element) {
  const productCard = element.closest(".product-card");
  const productData = JSON.parse(productCard.dataset.product);

  const modal = document.getElementById("quickViewModal");
  const content = modal.querySelector(".quick-view-content");

  content.innerHTML = `
        <div style="display: flex; gap: 2rem; padding: 2rem;">
            <div style="flex: 1;">
                <img src="${productData.image}" alt="${productData.title}" 
                     style="width: 100%; border-radius: 12px;">
            </div>
            <div style="flex: 1;">
                <h2 style="font-size: 1.8rem; margin-bottom: 0.5rem; color: var(--dark-color);">
                    ${productData.title}
                </h2>
                <p style="color: #6b7280; margin-bottom: 1rem; font-style: italic;">
                    by ${productData.author}
                </p>
                <div style="margin-bottom: 1rem;">
                    ${generateStarRating(productData.rating)}
                    <span style="margin-left: 10px; color: #6b7280;">(${
                      productData.rating
                    })</span>
                </div>
                <p style="margin-bottom: 1.5rem; line-height: 1.6;">
                    ${productData.description}
                </p>
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 2rem;">
                    <span style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">
                        $${productData.price.toFixed(2)}
                    </span>
                    <span style="text-decoration: line-through; color: #9ca3af;">
                        $${productData.originalPrice.toFixed(2)}
                    </span>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button onclick="addToCartFromModal(${productData.id})" 
                            style="flex: 1; padding: 12px; background: var(--primary-color); 
                                   color: white; border: none; border-radius: 8px; 
                                   font-weight: 500; cursor: pointer;">
                        Add to Cart
                    </button>
                    <button onclick="toggleWishlistFromModal(${
                      productData.id
                    })" 
                            style="padding: 12px; background: rgba(220, 38, 38, 0.1); 
                                   color: var(--secondary-color); border: none; 
                                   border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}
