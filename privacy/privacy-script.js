// Global variables
let cookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
};

// DOM elements
const cookieBanner = document.getElementById("cookieBanner");
const cookieModal = document.getElementById("cookieModal");
const sidebar = document.querySelector(".sidebar");
const navLinks = document.querySelectorAll(".nav-link");
const accordionItems = document.querySelectorAll(".accordion-item");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  initializeScrollSpy();
  initializeAccordion();
  checkCookieConsent();
  initializeAnimations();
});

// Initialize event listeners
function initializeEventListeners() {
  // Header actions
  document.getElementById("printBtn").addEventListener("click", handlePrint);
  document.getElementById("shareBtn").addEventListener("click", handleShare);

  // Cookie banner
  document
    .getElementById("acceptCookies")
    .addEventListener("click", acceptAllCookies);
  document
    .getElementById("cookieSettings")
    .addEventListener("click", openCookieModal);
  document
    .getElementById("manageCookies")
    .addEventListener("click", openCookieModal);

  // Privacy updates subscription
  document
    .getElementById("privacyUpdatesForm")
    .addEventListener("submit", handleSubscription);

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", handleSmoothScroll);
  });

  // Keyboard navigation
  document.addEventListener("keydown", handleKeyboardNavigation);
}

// Initialize scroll spy for sidebar navigation
function initializeScrollSpy() {
  const sections = document.querySelectorAll("[id]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const navLink = document.querySelector(
          `.nav-link[href="#${entry.target.id}"]`
        );
        if (navLink) {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => link.classList.remove("active"));
            navLink.classList.add("active");
          }
        }
      });
    },
    {
      rootMargin: "-20% 0px -80% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// Initialize accordion functionality
function initializeAccordion() {
  accordionItems.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all accordion items
      accordionItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
      });

      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

// Initialize scroll animations
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe content cards for animation
  const contentCards = document.querySelectorAll(".content-card");
  contentCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease-out ${
      index * 0.1
    }s, transform 0.6s ease-out ${index * 0.1}s`;
    observer.observe(card);
  });
}

// Handle print functionality
function handlePrint() {
  // Add print-specific classes
  document.body.classList.add("printing");

  // Print the page
  window.print();

  // Remove print classes after printing
  setTimeout(() => {
    document.body.classList.remove("printing");
  }, 1000);

  // Track print action
  trackEvent("privacy_policy_print");
}

// Handle share functionality
function handleShare() {
  if (navigator.share) {
    navigator
      .share({
        title: "Popular Online Privacy Policy",
        text: "Read our comprehensive privacy policy to understand how we protect your data.",
        url: window.location.href,
      })
      .then(() => {
        showNotification("Privacy policy shared successfully!", "success");
        trackEvent("privacy_policy_share", { method: "native" });
      })
      .catch(() => {
        fallbackShare();
      });
  } else {
    fallbackShare();
  }
}

// Fallback share functionality
function fallbackShare() {
  const url = window.location.href;

  // Create share modal
  const shareModal = document.createElement("div");
  shareModal.className = "modal-overlay active";
  shareModal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Share Privacy Policy</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content">
                <p>Share this privacy policy:</p>
                <div class="share-options">
                    <button class="share-btn" onclick="shareVia('email')">
                        <i class="fas fa-envelope"></i>
                        Email
                    </button>
                    <button class="share-btn" onclick="shareVia('copy')">
                        <i class="fas fa-copy"></i>
                        Copy Link
                    </button>
                    <button class="share-btn" onclick="shareVia('facebook')">
                        <i class="fab fa-facebook"></i>
                        Facebook
                    </button>
                    <button class="share-btn" onclick="shareVia('twitter')">
                        <i class="fab fa-twitter"></i>
                        Twitter
                    </button>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(shareModal);

  // Add share button styles
  addShareButtonStyles();
}

// Add share button styles
function addShareButtonStyles() {
  if (document.getElementById("share-styles")) return;

  const style = document.createElement("style");
  style.id = "share-styles";
  style.textContent = `
        .share-options {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .share-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            padding: 1rem;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 10px;
            color: var(--text-dark);
            cursor: pointer;
            transition: var(--transition);
            text-decoration: none;
        }
        
        .share-btn:hover {
            background: rgba(0, 0, 0, 0.05);
            transform: translateY(-2px);
        }
        
        .share-btn i {
            font-size: 1.2rem;
        }
    `;
  document.head.appendChild(style);
}

// Handle share via different methods
function shareVia(method) {
  const url = window.location.href;
  const title = "Popular Online Privacy Policy";
  const text =
    "Read our comprehensive privacy policy to understand how we protect your data.";

  switch (method) {
    case "email":
      window.location.href = `mailto:?subject=${encodeURIComponent(
        title
      )}&body=${encodeURIComponent(text + "\n\n" + url)}`;
      break;
    case "copy":
      navigator.clipboard
        .writeText(url)
        .then(() => {
          showNotification("Link copied to clipboard!", "success");
        })
        .catch(() => {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = url;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          showNotification("Link copied to clipboard!", "success");
        });
      break;
    case "facebook":
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
        "_blank"
      );
      break;
    case "twitter":
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(text)}`,
        "_blank"
      );
      break;
  }

  // Close modal
  document.querySelector(".modal-overlay").remove();

  // Track share action
  trackEvent("privacy_policy_share", { method: method });
}

// Handle smooth scrolling
function handleSmoothScroll(e) {
  e.preventDefault();
  const targetId = e.target.getAttribute("href");
  const targetElement = document.querySelector(targetId);

  if (targetElement) {
    const headerHeight = 100; // Account for sticky header
    const targetPosition = targetElement.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    // Update URL without triggering scroll
    history.pushState(null, null, targetId);
  }
}

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
  // Close modals with Escape key
  if (e.key === "Escape") {
    closeCookieModal();

    // Close any other modals
    const modals = document.querySelectorAll(".modal-overlay");
    modals.forEach((modal) => modal.remove());
  }

  // Print with Ctrl+P
  if ((e.ctrlKey || e.metaKey) && e.key === "p") {
    e.preventDefault();
    handlePrint();
  }
}

// Check cookie consent
function checkCookieConsent() {
  const consent = localStorage.getItem("cookieConsent");
  if (!consent) {
    setTimeout(() => {
      cookieBanner.classList.add("show");
    }, 2000);
  } else {
    cookiePreferences = JSON.parse(consent);
    applyCookieSettings();
  }
}

// Accept all cookies
function acceptAllCookies() {
  cookiePreferences = {
    essential: true,
    analytics: true,
    marketing: true,
  };

  saveCookiePreferences();
  cookieBanner.classList.remove("show");
  showNotification("Cookie preferences saved!", "success");
}

// Open cookie modal
function openCookieModal() {
  // Update toggle states
  document.getElementById("analyticsToggle").checked =
    cookiePreferences.analytics;
  document.getElementById("marketingToggle").checked =
    cookiePreferences.marketing;

  cookieModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Close cookie modal
function closeCookieModal() {
  cookieModal.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Save cookie settings
function saveCookieSettings() {
  cookiePreferences.analytics =
    document.getElementById("analyticsToggle").checked;
  cookiePreferences.marketing =
    document.getElementById("marketingToggle").checked;

  saveCookiePreferences();
  closeCookieModal();
  cookieBanner.classList.remove("show");
  showNotification("Cookie preferences updated!", "success");
}

// Save cookie preferences to localStorage
function saveCookiePreferences() {
  localStorage.setItem("cookieConsent", JSON.stringify(cookiePreferences));
  applyCookieSettings();
  trackEvent("cookie_preferences_saved", cookiePreferences);
}

// Apply cookie settings
function applyCookieSettings() {
  // Enable/disable analytics
  if (cookiePreferences.analytics) {
    // Enable Google Analytics or other analytics tools
    console.log("Analytics enabled");
    // gtag('config', 'GA_MEASUREMENT_ID');
  } else {
    // Disable analytics
    console.log("Analytics disabled");
  }

  // Enable/disable marketing cookies
  if (cookiePreferences.marketing) {
    // Enable marketing tools
    console.log("Marketing cookies enabled");
  } else {
    // Disable marketing tools
    console.log("Marketing cookies disabled");
  }
}

// Handle subscription form
function handleSubscription(e) {
  e.preventDefault();

  const email = e.target.querySelector('input[type="email"]').value;
  const submitBtn = e.target.querySelector('button[type="submit"]');

  // Show loading state
  const originalContent = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
  submitBtn.disabled = true;

  // Simulate subscription (replace with actual API call)
  setTimeout(() => {
    showNotification(
      "Successfully subscribed to privacy policy updates!",
      "success"
    );
    e.target.reset();

    // Reset button
    submitBtn.innerHTML = originalContent;
    submitBtn.disabled = false;

    // Track subscription
    trackEvent("privacy_updates_subscription", { email: email });
  }, 1500);
}

// Show notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; margin-left: auto; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;

  // Add notification styles if not exist
  addNotificationStyles();

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => notification.classList.add("show"), 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Get notification icon
function getNotificationIcon(type) {
  const icons = {
    success: "check-circle",
    error: "exclamation-triangle",
    warning: "exclamation-circle",
    info: "info-circle",
  };
  return icons[type] || "info-circle";
}

// Add notification styles
function addNotificationStyles() {
  if (document.getElementById("notification-styles")) return;

  const style = document.createElement("style");
  style.id = "notification-styles";
  style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 2rem;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 10px;
            padding: 1rem 1.5rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            min-width: 300px;
            max-width: 400px;
            box-shadow: var(--shadow);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            border-left: 4px solid var(--success-color);
        }
        
        .notification.error {
            border-left: 4px solid var(--accent-color);
        }
        
        .notification.warning {
            border-left: 4px solid var(--warning-color);
        }
        
        .notification.info {
            border-left: 4px solid var(--info-color);
        }
        
        .notification i:first-child {
            font-size: 1.2rem;
            flex-shrink: 0;
        }
        
        .notification.success i:first-child {
            color: var(--success-color);
        }
        
        .notification.error i:first-child {
            color: var(--accent-color);
        }
        
        .notification.warning i:first-child {
            color: var(--warning-color);
        }
        
        .notification.info i:first-child {
            color: var(--info-color);
        }
        
        @media (max-width: 768px) {
            .notification {
                right: 1rem;
                left: 1rem;
                min-width: auto;
                max-width: none;
            }
        }
    `;
  document.head.appendChild(style);
}

// Track events (for analytics)
function trackEvent(eventName, eventData = {}) {
  // Only track if analytics cookies are enabled
  if (!cookiePreferences.analytics) return;

  console.log("Tracking event:", eventName, eventData);

  // Example: Google Analytics 4
  // gtag('event', eventName, eventData);

  // Example: Custom analytics
  // analytics.track(eventName, eventData);
}

// Initialize table of contents highlighting
function initializeTOCHighlighting() {
  const tocLinks = document.querySelectorAll(".toc-item");
  const sections = document.querySelectorAll("[id]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const tocLink = document.querySelector(
          `.toc-item[href="#${entry.target.id}"]`
        );
        if (tocLink) {
          if (entry.isIntersecting) {
            tocLinks.forEach((link) => link.classList.remove("active"));
            tocLink.classList.add("active");
          }
        }
      });
    },
    {
      rootMargin: "-20% 0px -80% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// Add reading progress indicator
function addReadingProgress() {
  const progressBar = document.createElement("div");
  progressBar.className = "reading-progress";
  progressBar.innerHTML = '<div class="progress-fill"></div>';

  // Add progress bar styles
  const style = document.createElement("style");
  style.textContent = `
        .reading-progress {
            position: fixed;
            top: var(--header-height);
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(255, 255, 255, 0.1);
            z-index: 99;
        }
        
        .progress-fill {
            height: 100%;
            background: var(--accent-color);
            width: 0%;
            transition: width 0.1s ease-out;
        }
    `;
  document.head.appendChild(style);
  document.body.appendChild(progressBar);

  // Update progress on scroll
  window.addEventListener("scroll", () => {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    progressBar.querySelector(".progress-fill").style.width = scrolled + "%";
  });
}

// Initialize additional features
document.addEventListener("DOMContentLoaded", function () {
  initializeTOCHighlighting();
  addReadingProgress();

  // Add focus management for modals
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        trapFocus(e, modal);
      }
    });
  });
});

// Trap focus within modal
function trapFocus(e, modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      lastElement.focus();
      e.preventDefault();
    }
  } else {
    if (document.activeElement === lastElement) {
      firstElement.focus();
      e.preventDefault();
    }
  }
}

// Export functions for global access
window.closeCookieModal = closeCookieModal;
window.saveCookieSettings = saveCookieSettings;
window.shareVia = shareVia;
