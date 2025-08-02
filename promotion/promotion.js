// Enhanced Promotion Page JavaScript

// Global Variables
let currentView = "grid";
let activeFilters = {
  category: "",
  discount: "",
  priceRange: 200,
  promoType: "",
};
let cart = JSON.parse(localStorage.getItem("promotion-cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("promotion-wishlist") || "[]");
let cartCount = cart.reduce((total, item) => total + item.quantity, 0);

// Flash Sale Timer
let flashSaleEndTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now

// Sample Promotion Database
const promotionDatabase = [
  {
    id: 101,
    title: "Elon Musk Biography",
    category: "books",
    originalPrice: 56.99,
    salePrice: 12.99,
    discount: 77,
    savings: 44.0,
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
    stock: 3,
    sold: 85,
    promoType: "flash",
    endTime: new Date().getTime() + 2 * 60 * 60 * 1000, // 2 hours
    description: "Bestselling biography of the tech visionary",
  },
  {
    id: 102,
    title: "Not Here To Stay",
    category: "books",
    originalPrice: 150.0,
    salePrice: 40.5,
    discount: 73,
    savings: 109.5,
    image:
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
    stock: 8,
    sold: 60,
    promoType: "clearance",
    description: "Limited edition literary collection",
  },
  {
    id: 103,
    title: "BlackPink K-Pop Bundle",
    category: "books",
    originalPrice: 270.0,
    salePrice: 67.5,
    discount: 75,
    savings: 202.5,
    image:
      "https://images.unsplash.com/photo-1481304494613-c2a3b0e2b4b2?w=300&h=400&fit=crop",
    stock: 25,
    sold: 40,
    promoType: "bundle",
    bundleOffer: "Buy 2 Get 1 FREE",
    description: "Complete K-Pop fan collection",
  },
  {
    id: 104,
    title: "Fall Of The School",
    category: "books",
    originalPrice: 50.0,
    salePrice: 31.2,
    discount: 38,
    savings: 18.8,
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop",
    stock: 50,
    sold: 25,
    promoType: "seasonal",
    description: "Award-winning contemporary fiction",
  },
  {
    id: 105,
    title: "Premium Pen Set",
    category: "stationery",
    originalPrice: 71.4,
    salePrice: 24.99,
    discount: 65,
    savings: 46.41,
    image:
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&h=400&fit=crop",
    stock: 5,
    sold: 90,
    promoType: "flash",
    endTime: new Date().getTime() + 1.75 * 60 * 60 * 1000, // 1h 45m
    description: "Professional writing instruments",
  },
  {
    id: 106,
    title: "Wireless Headphones",
    category: "electronics",
    originalPrice: 199.99,
    salePrice: 89.99,
    discount: 55,
    savings: 110.0,
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=400&fit=crop",
    stock: 12,
    sold: 70,
    promoType: "clearance",
    description: "High-quality wireless audio experience",
  },
];

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  initializePromotionPage();
  updateCartCount();
  updateWishlistDisplay();
  startFlashSaleTimer();
  initializeAnimations();
});

// Initialize promotion page features
function initializePromotionPage() {
  // Initialize filters
  const categoryFilter = document.getElementById("categoryFilter");
  const discountFilter = document.getElementById("discountFilter");
  const priceRange = document.getElementById("priceRange");

  if (categoryFilter)
    categoryFilter.addEventListener("change", handleCategoryFilter);
  if (discountFilter)
    discountFilter.addEventListener("change", handleDiscountFilter);
  if (priceRange) {
    priceRange.addEventListener("input", handlePriceFilter);
    updatePriceDisplay(priceRange.value);
  }

  // Initialize search
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", debounce(handleSearch, 300));
  }

  // Update deals count
  updateDealsCount();

  // Initialize intersection observer
  initializeScrollAnimations();
}

// Scroll to deals section
function scrollToDeals() {
  const dealsSection = document.getElementById("deals");
  if (dealsSection) {
    dealsSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Flash Sale Countdown Timer
function startFlashSaleTimer() {
  function updateTimer() {
    const now = new Date().getTime();
    const distance = flashSaleEndTime - now;

    if (distance > 0) {
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      updateTimerDisplay("hours", hours);
      updateTimerDisplay("minutes", minutes);
      updateTimerDisplay("seconds", seconds);

      // Update individual deal timers
      updateDealTimers();
    } else {
      // Flash sale ended
      document
        .querySelectorAll(".timer-number")
        .forEach((el) => (el.textContent = "00"));
      showToast("Flash sale has ended! 🕒", "info");
    }
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

function updateTimerDisplay(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value.toString().padStart(2, "0");
  }
}

function updateDealTimers() {
  document.querySelectorAll(".deal-timer").forEach((timer) => {
    const endTime = parseInt(timer.dataset.end || 0);
    if (endTime) {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance > 0) {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        const timeLeft = timer.querySelector(".time-left");
        if (timeLeft) {
          timeLeft.textContent = `${hours}h ${minutes}m left`;
        }
      } else {
        const timeLeft = timer.querySelector(".time-left");
        if (timeLeft) {
          timeLeft.textContent = "Deal expired";
          timer.style.background = "rgba(220, 38, 38, 0.8)";
        }
      }
    }
  });
}

// Filter by promotion category
function filterByCategory(promoType) {
  activeFilters.promoType = promoType;
  applyAllFilters();

  // Update active category visual
  document.querySelectorAll(".promo-category").forEach((cat) => {
    cat.classList.remove("active");
  });
  event.target.closest(".promo-category").classList.add("active");

  showToast(`Showing ${promoType} deals`, "info");
}

// Handle category filter
function handleCategoryFilter(e) {
  activeFilters.category = e.target.value;
  applyAllFilters();
  updateActiveFilters();
}

// Handle discount filter
function handleDiscountFilter(e) {
  activeFilters.discount = e.target.value;
  applyAllFilters();
  updateActiveFilters();
}

// Handle price filter
function handlePriceFilter(e) {
  activeFilters.priceRange = parseFloat(e.target.value);
  updatePriceDisplay(e.target.value);
  applyAllFilters();
  updateActiveFilters();
}

// Update price display
function updatePriceDisplay(value) {
  const maxPriceElement = document.getElementById("maxPrice");
  if (maxPriceElement) {
    maxPriceElement.textContent = `$${value}`;
  }
}

// Handle search
function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  applySearchFilter(query);
}

// Apply search filter
function applySearchFilter(query) {
  const dealCards = document.querySelectorAll(".deal-card");
  let visibleCount = 0;

  dealCards.forEach((card) => {
    const title = card
      .querySelector(".product-title")
      .textContent.toLowerCase();
    const description = card.dataset.description || "";

    if (
      !query ||
      title.includes(query) ||
      description.toLowerCase().includes(query)
    ) {
      card.style.display = "";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  updateDealsCount(visibleCount);
}

// Apply all filters
function applyAllFilters() {
  const dealCards = document.querySelectorAll(".deal-card");
  let visibleCount = 0;

  dealCards.forEach((card) => {
    const category = card.dataset.category;
    const discount = parseInt(card.dataset.discount);
    const price = parseFloat(card.dataset.price);
    const promoType = getPromoTypeFromCard(card);

    const matchesCategory =
      !activeFilters.category || category === activeFilters.category;
    const matchesDiscount =
      !activeFilters.discount || discount >= parseInt(activeFilters.discount);
    const matchesPrice = price <= activeFilters.priceRange;
    const matchesPromoType =
      !activeFilters.promoType || promoType === activeFilters.promoType;

    if (
      matchesCategory &&
      matchesDiscount &&
      matchesPrice &&
      matchesPromoType
    ) {
      card.style.display = "";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  updateDealsCount(visibleCount);
}

function getPromoTypeFromCard(card) {
  if (card.classList.contains("flash-deal")) return "flash";
  if (card.classList.contains("clearance-deal")) return "clearance";
  if (card.classList.contains("bundle-deal")) return "bundle";
  if (card.classList.contains("seasonal-deal")) return "seasonal";
  return "";
}

// Update active filters display
function updateActiveFilters() {
  const activeFiltersContainer = document.getElementById("activeFilters");
  if (!activeFiltersContainer) return;

  const filters = [];

  if (activeFilters.category) {
    filters.push({
      type: "category",
      value: activeFilters.category,
      label: `Category: ${activeFilters.category}`,
    });
  }

  if (activeFilters.discount) {
    filters.push({
      type: "discount",
      value: activeFilters.discount,
      label: `${activeFilters.discount}%+ discount`,
    });
  }

  if (activeFilters.priceRange < 200) {
    filters.push({
      type: "price",
      value: activeFilters.priceRange,
      label: `Under $${activeFilters.priceRange}`,
    });
  }

  if (activeFilters.promoType) {
    filters.push({
      type: "promoType",
      value: activeFilters.promoType,
      label: `${activeFilters.promoType} deals`,
    });
  }

  activeFiltersContainer.innerHTML = filters
    .map(
      (filter) => `
        <div class="filter-tag">
            ${filter.label}
            <span class="remove" onclick="removeFilter('${filter.type}')">×</span>
        </div>
    `
    )
    .join("");
}

// Remove specific filter
function removeFilter(filterType) {
  switch (filterType) {
    case "category":
      activeFilters.category = "";
      document.getElementById("categoryFilter").value = "";
      break;
    case "discount":
      activeFilters.discount = "";
      document.getElementById("discountFilter").value = "";
      break;
    case "price":
      activeFilters.priceRange = 200;
      document.getElementById("priceRange").value = 200;
      updatePriceDisplay(200);
      break;
    case "promoType":
      activeFilters.promoType = "";
      document.querySelectorAll(".promo-category").forEach((cat) => {
        cat.classList.remove("active");
      });
      break;
  }

  applyAllFilters();
  updateActiveFilters();
}

// Clear all filters
function clearAllFilters() {
  activeFilters = {
    category: "",
    discount: "",
    priceRange: 200,
    promoType: "",
  };

  // Reset form elements
  const categoryFilter = document.getElementById("categoryFilter");
  const discountFilter = document.getElementById("discountFilter");
  const priceRange = document.getElementById("priceRange");

  if (categoryFilter) categoryFilter.value = "";
  if (discountFilter) discountFilter.value = "";
  if (priceRange) {
    priceRange.value = 200;
    updatePriceDisplay(200);
  }

  // Reset promo categories
  document.querySelectorAll(".promo-category").forEach((cat) => {
    cat.classList.remove("active");
  });

  // Show all deals
  document.querySelectorAll(".deal-card").forEach((card) => {
    card.style.display = "";
  });

  updateActiveFilters();
  updateDealsCount();
  showToast("All filters cleared", "info");
}

// Toggle view (grid/list)
function toggleView(view) {
  currentView = view;

  // Update active button
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  document.querySelector(`[data-view="${view}"]`).classList.add("active");

  // Update grid class
  const dealsGrid = document.getElementById("dealsGrid");
  if (dealsGrid) {
    if (view === "list") {
      dealsGrid.classList.add("list-view");
    } else {
      dealsGrid.classList.remove("list-view");
    }
  }

  showToast(`Switched to ${view} view`, "info");
}

// Update deals count
function updateDealsCount(count) {
  const dealsCountElement = document.getElementById("dealsCount");
  if (dealsCountElement) {
    const displayCount =
      count !== undefined
        ? count
        : document.querySelectorAll('.deal-card:not([style*="display: none"])')
            .length;
    dealsCountElement.textContent = `${displayCount} deals available`;
  }
}

// Add to cart functionality
function addToCart(button) {
  const dealCard = button.closest(".deal-card");
  const productData = extractProductData(dealCard);

  // Add loading state
  const originalText = button.innerHTML;
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
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
    localStorage.setItem("promotion-cart", JSON.stringify(cart));

    // Show success feedback
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.background = "var(--success-color)";

    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = "var(--primary-color)";
      button.disabled = false;
    }, 1500);

    showToast(`${productData.title} added to cart!`, "success");

    // Update stock display
    updateStockDisplay(dealCard, productData);
  }, 800);
}

// Extract product data from deal card
function extractProductData(dealCard) {
  const title = dealCard.querySelector(".product-title").textContent;
  const salePrice = parseFloat(
    dealCard.querySelector(".sale-price").textContent.replace("$", "")
  );
  const originalPrice = parseFloat(
    dealCard.querySelector(".original-price").textContent.replace("$", "")
  );
  const image = dealCard.querySelector(".product-image img").src;
  const category = dealCard.dataset.category;
  const discount = parseInt(dealCard.dataset.discount);

  return {
    id: Date.now() + Math.random(), // Generate unique ID
    title,
    salePrice,
    originalPrice,
    image,
    category,
    discount,
    savings: originalPrice - salePrice,
  };
}

// Update stock display
function updateStockDisplay(dealCard, productData) {
  const stockIndicator = dealCard.querySelector(".stock-indicator");
  const progressFill = dealCard.querySelector(".progress-fill");
  const soldCount = dealCard.querySelector(".sold-count");

  // Simulate stock decrease
  const currentStock = parseInt(
    stockIndicator.textContent.match(/\d+/)?.[0] || 0
  );
  const newStock = Math.max(0, currentStock - 1);

  if (newStock <= 3) {
    stockIndicator.className = "stock-indicator low";
    stockIndicator.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Only ${newStock} left!`;
  } else if (newStock <= 10) {
    stockIndicator.className = "stock-indicator medium";
    stockIndicator.innerHTML = `<i class="fas fa-info-circle"></i> ${newStock} left`;
  }

  // Update progress bar
  const currentProgress = parseFloat(progressFill.style.width.replace("%", ""));
  const newProgress = Math.min(100, currentProgress + 2);
  progressFill.style.width = `${newProgress}%`;
  if (soldCount) {
    soldCount.textContent = `${Math.round(newProgress)}% claimed`;
  }
}

// Toggle wishlist
function toggleWishlist(button) {
  const dealCard = button.closest(".deal-card");
  const productData = extractProductData(dealCard);

  button.classList.toggle("active");

  if (button.classList.contains("active")) {
    wishlist.push(productData.id);
    showToast(`${productData.title} added to wishlist! ❤️`, "success");
  } else {
    wishlist = wishlist.filter((id) => id !== productData.id);
    showToast(`${productData.title} removed from wishlist`, "info");
  }

  localStorage.setItem("promotion-wishlist", JSON.stringify(wishlist));
  updateWishlistDisplay();
}

// Update wishlist display
function updateWishlistDisplay() {
  document.querySelectorAll(".deal-card").forEach((card) => {
    const productData = extractProductData(card);
    const wishlistBtn = card.querySelector(".wishlist-btn");

    if (wishlist.includes(productData.id)) {
      wishlistBtn.classList.add("active");
    } else {
      wishlistBtn.classList.remove("active");
    }
  });
}

// Cart functionality
function updateCartCount() {
  const cartCountElements = document.querySelectorAll(".cart-count");
  cartCountElements.forEach((element) => {
    element.textContent = cartCount;
  });
}

function updateCartDisplay() {
  const cartItems = document.getElementById("cartItems");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartSavings = document.getElementById("cartSavings");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <p class="cart-suggestion">Add some amazing deals!</p>
            </div>
        `;
    if (cartSubtotal) cartSubtotal.textContent = "$0.00";
    if (cartSavings) cartSavings.textContent = "$0.00";
    if (cartTotal) cartTotal.textContent = "$0.00";
    return;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  );
  const totalSavings = cart.reduce(
    (sum, item) => sum + item.savings * item.quantity,
    0
  );

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.title}</div>
                <div class="cart-item-price">$${item.salePrice.toFixed(2)}</div>
                <div class="cart-item-savings">Save: $${item.savings.toFixed(
                  2
                )}</div>
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
    .join("");

  if (cartSubtotal) cartSubtotal.textContent = `${subtotal.toFixed(2)}`;
  if (cartSavings) cartSavings.textContent = `${totalSavings.toFixed(2)}`;
  if (cartTotal) cartTotal.textContent = `${subtotal.toFixed(2)}`;
}

function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar");
  if (!cartSidebar) return;

  cartSidebar.classList.toggle("open");

  if (cartSidebar.classList.contains("open")) {
    updateCartDisplay();
    addCartBackdrop();
  } else {
    removeCartBackdrop();
  }
}

function addCartBackdrop() {
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
  backdrop.onclick = () => toggleCart();
}

function removeCartBackdrop() {
  const backdrop = document.querySelector(".cart-backdrop");
  if (backdrop) {
    backdrop.style.opacity = "0";
    setTimeout(() => backdrop.remove(), 300);
  }
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += change;

    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    cartCount += change;
    updateCartCount();
    updateCartDisplay();
    localStorage.setItem("promotion-cart", JSON.stringify(cart));
  }
}

function removeFromCart(productId) {
  const itemIndex = cart.findIndex((item) => item.id === productId);
  if (itemIndex > -1) {
    cartCount -= cart[itemIndex].quantity;
    cart.splice(itemIndex, 1);
    updateCartCount();
    updateCartDisplay();
    localStorage.setItem("promotion-cart", JSON.stringify(cart));
    showToast("Item removed from cart", "info");
  }
}

function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!", "warning");
    return;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  );
  const totalSavings = cart.reduce(
    (sum, item) => sum + item.savings * item.quantity,
    0
  );

  showLoadingSpinner();

  // Simulate checkout process
  setTimeout(() => {
    hideLoadingSpinner();
    cart = [];
    cartCount = 0;
    updateCartCount();
    updateCartDisplay();
    localStorage.setItem("promotion-cart", JSON.stringify(cart));
    toggleCart();
    showToast(
      `Order placed! You saved ${totalSavings.toFixed(2)}! 🎉`,
      "success"
    );
  }, 3000);
}

// Load more deals
function loadMoreDeals() {
  showLoadingSpinner();

  // Simulate loading more deals
  setTimeout(() => {
    hideLoadingSpinner();

    // Generate additional deals (mock data)
    const additionalDeals = generateMoreDeals();
    const dealsGrid = document.getElementById("dealsGrid");

    additionalDeals.forEach((deal) => {
      const dealElement = createDealCard(deal);
      dealsGrid.appendChild(dealElement);
    });

    updateDealsCount();
    showToast("More deals loaded!", "success");

    // Animate new cards
    setTimeout(() => {
      const newCards = dealsGrid.querySelectorAll(".deal-card:last-child");
      newCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add("fade-in-up");
      });
    }, 100);
  }, 2000);
}

// Generate more deals (mock function)
function generateMoreDeals() {
  const moreDeals = [
    {
      title: "Art Supplies Bundle",
      category: "stationery",
      originalPrice: 89.99,
      salePrice: 35.99,
      discount: 60,
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=400&fit=crop",
      stock: 15,
      promoType: "clearance",
    },
    {
      title: "Wireless Mouse",
      category: "electronics",
      originalPrice: 59.99,
      salePrice: 19.99,
      discount: 67,
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=400&fit=crop",
      stock: 8,
      promoType: "flash",
    },
  ];

  return moreDeals;
}

// Create deal card element
function createDealCard(deal) {
  const card = document.createElement("div");
  card.className = `deal-card ${deal.promoType}-deal`;
  card.dataset.category = deal.category;
  card.dataset.discount = deal.discount;
  card.dataset.price = deal.salePrice;

  const stockClass =
    deal.stock <= 5 ? "low" : deal.stock <= 15 ? "medium" : "high";
  const stockIcon =
    deal.stock <= 5
      ? "exclamation-triangle"
      : deal.stock <= 15
      ? "info-circle"
      : "check-circle";
  const stockText =
    deal.stock <= 5
      ? `Only ${deal.stock} left!`
      : deal.stock <= 15
      ? `${deal.stock} left`
      : "In Stock";

  card.innerHTML = `
        <div class="deal-badge ${deal.promoType}">
            <i class="fas fa-${
              deal.promoType === "flash"
                ? "bolt"
                : deal.promoType === "clearance"
                ? "percentage"
                : deal.promoType === "bundle"
                ? "layer-group"
                : "snowflake"
            }"></i>
            ${deal.promoType.toUpperCase()}
        </div>
        <div class="product-image">
            <img src="${deal.image}" alt="${deal.title}">
            <div class="discount-badge">-${deal.discount}%</div>
            <div class="stock-indicator ${stockClass}">
                <i class="fas fa-${stockIcon}"></i>
                ${stockText}
            </div>
        </div>
        <div class="deal-info">
            <h3 class="product-title">${deal.title}</h3>
            <div class="price-comparison">
                <span class="sale-price">${deal.salePrice.toFixed(2)}</span>
                <span class="original-price">${deal.originalPrice.toFixed(
                  2
                )}</span>
                <span class="savings">Save ${(
                  deal.originalPrice - deal.salePrice
                ).toFixed(2)}</span>
            </div>
            <div class="deal-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${
                      Math.random() * 60 + 20
                    }%"></div>
                </div>
                <span class="sold-count">${Math.floor(
                  Math.random() * 60 + 20
                )}% claimed</span>
            </div>
            <div class="deal-actions">
                <button class="add-to-cart-btn" onclick="addToCart(this)">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
                <button class="wishlist-btn" onclick="toggleWishlist(this)">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;

  return card;
}

// Modal functions
function showNewsletterModal() {
  const modal = document.getElementById("newsletterModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function showReferralModal() {
  showToast("Referral program coming soon!", "info");
}

function showLoyaltyModal() {
  showToast("Loyalty program coming soon!", "info");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function handleNewsletterSignup(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;

  showLoadingSpinner();

  setTimeout(() => {
    hideLoadingSpinner();
    closeModal("newsletterModal");
    showToast("Welcome! Check your email for 15% discount code! 📧", "success");

    // Store newsletter signup
    localStorage.setItem("newsletter-subscribed", "true");
  }, 2000);
}

// Search functionality
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

// Loading spinner
function showLoadingSpinner() {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) {
    spinner.classList.add("active");
  }
}

function hideLoadingSpinner() {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) {
    spinner.classList.remove("active");
  }
}

// Initialize animations
function initializeAnimations() {
  // Animate promotion categories on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${
            Array.from(entry.target.parentNode.children).indexOf(entry.target) *
            0.1
          }s`;
          entry.target.classList.add("fade-in-up");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Observe elements for animation
  document
    .querySelectorAll(".promo-category, .deal-card, .offer-card")
    .forEach((el) => {
      observer.observe(el);
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
  const animateElements = document.querySelectorAll(
    ".promo-category, .deal-card, .offer-card"
  );

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

  animateElements.forEach((el) => observer.observe(el));
}

// Toast notification function
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = "toast";

  const colors = {
    success: "#059669",
    warning: "#f59e0b",
    error: "#dc2626",
    info: "#2563eb",
  };

  const icons = {
    success: "check-circle",
    warning: "exclamation-triangle",
    error: "times-circle",
    info: "info-circle",
  };

  toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 1002;
        transform: translateX(400px);
        transition: all 0.3s ease;
        font-weight: 500;
        max-width: 300px;
    `;

  toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${icons[type]}"></i>
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

// Debounce function
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

// Keyboard shortcuts and event listeners
document.addEventListener("keydown", function (e) {
  // Escape key - close modals/overlays
  if (e.key === "Escape") {
    const searchOverlay = document.getElementById("searchOverlay");
    const newsletterModal = document.getElementById("newsletterModal");
    const cartSidebar = document.getElementById("cartSidebar");

    if (searchOverlay.classList.contains("active")) {
      toggleSearch();
    } else if (newsletterModal.classList.contains("active")) {
      closeModal("newsletterModal");
    } else if (cartSidebar.classList.contains("open")) {
      toggleCart();
    }
  }

  // Ctrl/Cmd + K for search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    toggleSearch();
  }

  // Number keys for quick category selection
  if (e.key >= "1" && e.key <= "4") {
    const categories = ["flash", "clearance", "bundle", "seasonal"];
    const categoryIndex = parseInt(e.key) - 1;
    if (categories[categoryIndex]) {
      filterByCategory(categories[categoryIndex]);
    }
  }
});

// Close modals on outside click
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("search-overlay")) {
    toggleSearch();
  }

  if (e.target.classList.contains("modal-overlay")) {
    const modalId = e.target.id;
    closeModal(modalId);
  }
});

// Newsletter form submission
document.addEventListener("submit", function (e) {
  if (e.target.classList.contains("newsletter-form")) {
    e.preventDefault();
    handleNewsletterSignup(e);
  }
});

// Auto-show newsletter popup for new visitors
setTimeout(() => {
  if (
    !localStorage.getItem("newsletter-subscribed") &&
    !localStorage.getItem("newsletter-shown")
  ) {
    showNewsletterModal();
    localStorage.setItem("newsletter-shown", "true");
  }
}, 5000);

// Performance monitoring
function trackPerformance() {
  if ("performance" in window) {
    window.addEventListener("load", () => {
      const loadTime =
        performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Page loaded in ${loadTime}ms`);
    });
  }
}

trackPerformance();

// Export functions for global access
window.promotionApp = {
  scrollToDeals,
  filterByCategory,
  toggleView,
  clearAllFilters,
  addToCart,
  toggleWishlist,
  toggleCart,
  loadMoreDeals,
  showNewsletterModal,
  showReferralModal,
  showLoyaltyModal,
  closeModal,
  toggleSearch,
  checkout,
};
