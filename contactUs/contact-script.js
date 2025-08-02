// DOM Elements
const contactForm = document.getElementById("contactForm");
const successModal = document.getElementById("successModal");
const submitBtn = contactForm.querySelector(".submit-btn");

// Form validation patterns
const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[0-9\s\-\(\)]{10,}$/,
};

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  initializeAnimations();
  initializeFormInteractions();
  initializeFormValidation();
});

// Initialize scroll animations
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
      }
    });
  }, observerOptions);

  // Observe animated elements
  const animatedElements = document.querySelectorAll(
    ".hero-section, .contact-section, .map-section"
  );
  animatedElements.forEach((el) => observer.observe(el));

  // Add parallax effect to particles
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const particles = document.querySelectorAll(".particle");

    particles.forEach((particle, index) => {
      const speed = 0.5 + index * 0.1;
      particle.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

// Initialize form interactions
function initializeFormInteractions() {
  const formGroups = document.querySelectorAll(".form-group");

  formGroups.forEach((group) => {
    const input = group.querySelector("input, select, textarea");
    const label = group.querySelector("label");

    if (input && label) {
      // Handle input focus and blur
      input.addEventListener("focus", () => {
        group.classList.add("focused");
        addInputAnimation(input);
      });

      input.addEventListener("blur", () => {
        group.classList.remove("focused");
        if (input.value === "") {
          group.classList.remove("filled");
        } else {
          group.classList.add("filled");
        }
      });

      // Handle input changes
      input.addEventListener("input", () => {
        if (input.value !== "") {
          group.classList.add("filled");
        } else {
          group.classList.remove("filled");
        }

        // Real-time validation
        validateField(input);
      });

      // Handle select changes
      if (input.tagName === "SELECT") {
        input.addEventListener("change", () => {
          if (input.value !== "") {
            group.classList.add("filled");
          } else {
            group.classList.remove("filled");
          }
        });
      }
    }
  });
}

// Add input animation effect
function addInputAnimation(input) {
  input.style.transform = "scale(1.02)";
  setTimeout(() => {
    input.style.transform = "scale(1)";
  }, 200);
}

// Initialize form validation
function initializeFormValidation() {
  contactForm.addEventListener("submit", handleFormSubmit);
}

// Handle form submission
async function handleFormSubmit(e) {
  e.preventDefault();

  // Validate all fields
  const isValid = validateForm();

  if (!isValid) {
    shakeForm();
    return;
  }

  // Show loading state
  showLoadingState();

  try {
    // Simulate form submission (replace with actual API call)
    await simulateFormSubmission();

    // Show success
    showSuccessModal();
    resetForm();
  } catch (error) {
    showErrorMessage("Failed to send message. Please try again.");
  } finally {
    hideLoadingState();
  }
}

// Validate entire form
function validateForm() {
  const requiredFields = contactForm.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

// Validate individual field
function validateField(field) {
  const value = field.value.trim();
  const fieldType = field.type || field.tagName.toLowerCase();
  const formGroup = field.closest(".form-group");

  // Remove existing error states
  formGroup.classList.remove("error");
  removeErrorMessage(formGroup);

  // Check if required field is empty
  if (field.hasAttribute("required") && !value) {
    showFieldError(formGroup, "This field is required");
    return false;
  }

  // Skip validation if field is empty and not required
  if (!value && !field.hasAttribute("required")) {
    return true;
  }

  // Validate email
  if (fieldType === "email" && !validationPatterns.email.test(value)) {
    showFieldError(formGroup, "Please enter a valid email address");
    return false;
  }

  // Validate phone
  if (fieldType === "tel" && value && !validationPatterns.phone.test(value)) {
    showFieldError(formGroup, "Please enter a valid phone number");
    return false;
  }

  // Validate select
  if (fieldType === "select" && field.hasAttribute("required") && !value) {
    showFieldError(formGroup, "Please select an option");
    return false;
  }

  // Validate textarea minimum length
  if (fieldType === "textarea" && value.length < 10) {
    showFieldError(formGroup, "Message must be at least 10 characters long");
    return false;
  }

  return true;
}

// Show field error
function showFieldError(formGroup, message) {
  formGroup.classList.add("error");

  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;
  formGroup.appendChild(errorElement);

  // Add error animation
  errorElement.style.animation = "shake 0.5s ease-in-out";
}

// Remove error message
function removeErrorMessage(formGroup) {
  const errorMessage = formGroup.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

// Shake form on validation error
function shakeForm() {
  contactForm.style.animation = "shake 0.5s ease-in-out";
  setTimeout(() => {
    contactForm.style.animation = "";
  }, 500);
}

// Show loading state
function showLoadingState() {
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;
  submitBtn.style.opacity = "0.7";

  // Store original text for later restoration
  submitBtn.dataset.originalText = originalText;
}

// Hide loading state
function hideLoadingState() {
  submitBtn.innerHTML = submitBtn.dataset.originalText;
  submitBtn.disabled = false;
  submitBtn.style.opacity = "1";
}

// Simulate form submission (replace with actual API call)
function simulateFormSubmission() {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000); // Simulate 2 second delay
  });
}

// Show success modal
function showSuccessModal() {
  successModal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Add success animation to modal content
  const modalContent = successModal.querySelector(".modal-content");
  modalContent.style.animation = "bounceIn 0.5s ease-out";
}

// Close modal
function closeModal() {
  successModal.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Reset form
function resetForm() {
  contactForm.reset();

  // Remove all filled classes
  const formGroups = document.querySelectorAll(".form-group");
  formGroups.forEach((group) => {
    group.classList.remove("filled", "error");
    removeErrorMessage(group);
  });
}

// Show error message
function showErrorMessage(message) {
  // Create error notification
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-notification";
  errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;

  document.body.appendChild(errorDiv);

  // Animate in
  setTimeout(() => {
    errorDiv.classList.add("show");
  }, 100);

  // Remove after 5 seconds
  setTimeout(() => {
    errorDiv.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(errorDiv);
    }, 300);
  }, 5000);
}

// Handle modal overlay clicks
successModal.addEventListener("click", (e) => {
  if (e.target === successModal) {
    closeModal();
  }
});

// Handle escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && successModal.classList.contains("active")) {
    closeModal();
  }
});

// Smooth scrolling for anchor links
function smoothScroll(target) {
  const element = document.querySelector(target);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Add custom animations for social links
document.querySelectorAll(".social-link").forEach((link) => {
  link.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-5px) scale(1.1)";
  });

  link.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Add hover effects to info items
document.querySelectorAll(".info-item").forEach((item) => {
  item.addEventListener("mouseenter", function () {
    const icon = this.querySelector(".info-icon");
    icon.style.transform = "scale(1.1) rotate(10deg)";
  });

  item.addEventListener("mouseleave", function () {
    const icon = this.querySelector(".info-icon");
    icon.style.transform = "scale(1) rotate(0deg)";
  });
});

// Add typing effect for hero title (optional enhancement)
function typeWriterEffect() {
  const heroTitle = document.querySelector(".hero-title");
  const text = heroTitle.textContent;
  heroTitle.textContent = "";

  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      heroTitle.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, 100);
}

// Initialize on load
window.addEventListener("load", () => {
  // Add entrance animations
  const elements = document.querySelectorAll(".glass-card");
  elements.forEach((el, index) => {
    el.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
  });
});

// Export functions for global access
window.closeModal = closeModal;
window.smoothScroll = smoothScroll;
