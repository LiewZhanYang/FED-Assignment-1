// Global variables
let currentStep = 1;
let formData = {};

// DOM elements
const form = document.getElementById("signupForm");
const progressIndicator = document.querySelector(".progress-indicator");
const successModal = document.getElementById("successModal");
const loadingOverlay = document.getElementById("loadingOverlay");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  initializeFormValidation();
  initializeAnimations();
  updateProgress();
});

// Initialize event listeners
function initializeEventListeners() {
  // Form submission
  form.addEventListener("submit", handleFormSubmission);

  // Password strength checking
  document
    .getElementById("password")
    .addEventListener("input", checkPasswordStrength);

  // Real-time validation
  const inputs = form.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => clearFieldError(input));
  });

  // Floating labels
  inputs.forEach((input) => {
    input.addEventListener("focus", handleInputFocus);
    input.addEventListener("blur", handleInputBlur);

    // Check initial state
    if (input.value) {
      input.parentNode.classList.add("has-value");
    }
  });

  // Password confirmation matching
  document
    .getElementById("confirmPassword")
    .addEventListener("input", validatePasswordMatch);

  // Email availability checking (simulated)
  document
    .getElementById("email")
    .addEventListener("blur", checkEmailAvailability);

  // Keyboard navigation
  document.addEventListener("keydown", handleKeyboardNavigation);
}

// Initialize form validation
function initializeFormValidation() {
  // Email validation pattern
  const emailInput = document.getElementById("email");
  emailInput.pattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";

  // Password requirements
  const passwordInput = document.getElementById("password");
  passwordInput.pattern =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
  passwordInput.title =
    "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character";
}

// Initialize animations
function initializeAnimations() {
  // Stagger animation for form elements
  const formElements = document.querySelectorAll(
    ".form-group, .radio-group, .checkbox-grid"
  );
  formElements.forEach((element, index) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = `opacity 0.5s ease ${
      index * 0.1
    }s, transform 0.5s ease ${index * 0.1}s`;

    setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, 100);
  });
}

// Handle form submission
function handleFormSubmission(e) {
  e.preventDefault();

  if (currentStep < 3) {
    nextStep();
    return;
  }

  // Final validation
  if (!validateStep(3)) {
    return;
  }

  // Show loading
  showLoading();

  // Collect all form data
  collectFormData();

  // Simulate account creation
  setTimeout(() => {
    hideLoading();
    showSuccessModal();

    // Track registration completion
    trackEvent("account_registration_complete", {
      step: "completion",
      preferences: formData.genres || [],
      notifications: {
        email: formData.emailNotifications || false,
        sms: formData.smsNotifications || false,
        newsletter: formData.newsletter || false,
      },
    });
  }, 3000);
}

// Navigate to next step
function nextStep() {
  if (!validateStep(currentStep)) {
    return;
  }

  if (currentStep < 3) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove("active");

    // Show next step
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add("active");

    // Update progress
    updateProgress();

    // Update review if on step 3
    if (currentStep === 3) {
      updateReviewSection();
    }

    // Track step progression
    trackEvent("registration_step_complete", { step: currentStep - 1 });
  }
}

// Navigate to previous step
function prevStep() {
  if (currentStep > 1) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove("active");

    // Show previous step
    currentStep--;
    document.getElementById(`step${currentStep}`).classList.add("active");

    // Update progress
    updateProgress();
  }
}

// Go to specific step
function goToStep(step) {
  if (step >= 1 && step <= 3) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove("active");

    // Show target step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add("active");

    // Update progress
    updateProgress();
  }
}

// Update progress indicator
function updateProgress() {
  // Update progress bar
  progressIndicator.className = `progress-indicator step-${currentStep}`;

  // Update step states
  const steps = document.querySelectorAll(".progress-step");
  steps.forEach((step, index) => {
    const stepNumber = index + 1;
    step.classList.remove("active", "completed");

    if (stepNumber === currentStep) {
      step.classList.add("active");
    } else if (stepNumber < currentStep) {
      step.classList.add("completed");
    }
  });
}

// Validate current step
function validateStep(step) {
  const stepElement = document.getElementById(`step${step}`);
  const requiredFields = stepElement.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  // Additional step-specific validation
  if (step === 1) {
    // Password confirmation
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      showFieldError(
        document.getElementById("confirmPassword"),
        "Passwords do not match"
      );
      isValid = false;
    }

    // Age validation (must be 13+)
    const birthDate = new Date(document.getElementById("birthDate").value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 13) {
      showFieldError(
        document.getElementById("birthDate"),
        "You must be at least 13 years old to create an account"
      );
      isValid = false;
    }
  }

  if (step === 3) {
    // Terms acceptance
    const termsCheckbox = document.querySelector('input[name="terms"]');
    if (!termsCheckbox.checked) {
      showFieldError(termsCheckbox, "You must accept the terms and conditions");
      isValid = false;
    }
  }

  return isValid;
}

// Validate individual field
function validateField(field) {
  const value = field.value.trim();
  const fieldType = field.type || field.tagName.toLowerCase();

  // Clear previous errors
  clearFieldError(field);

  // Required field validation
  if (field.hasAttribute("required") && !value) {
    showFieldError(field, "This field is required");
    return false;
  }

  // Skip further validation if field is empty and not required
  if (!value && !field.hasAttribute("required")) {
    return true;
  }

  // Email validation
  if (fieldType === "email") {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      showFieldError(field, "Please enter a valid email address");
      return false;
    }
  }

  // Password validation
  if (field.id === "password") {
    if (value.length < 8) {
      showFieldError(field, "Password must be at least 8 characters long");
      return false;
    }

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[@$!%*?&]/.test(value);

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      showFieldError(
        field,
        "Password must contain uppercase, lowercase, number, and special character"
      );
      return false;
    }
  }

  // Date validation
  if (fieldType === "date") {
    const selectedDate = new Date(value);
    const today = new Date();

    if (selectedDate > today) {
      showFieldError(field, "Date cannot be in the future");
      return false;
    }
  }

  // Select validation
  if (fieldType === "select" && field.hasAttribute("required") && !value) {
    showFieldError(field, "Please select an option");
    return false;
  }

  return true;
}

// Show field error
function showFieldError(field, message) {
  clearFieldError(field);

  const errorElement = document.createElement("div");
  errorElement.className = "field-error";
  errorElement.textContent = message;
  errorElement.style.color = "var(--accent-color)";
  errorElement.style.fontSize = "0.8rem";
  errorElement.style.marginTop = "0.25rem";
  errorElement.style.animation = "fadeIn 0.3s ease-out";

  const formGroup =
    field.closest(".form-group") ||
    field.closest(".checkbox-option") ||
    field.closest(".terms-section");
  if (formGroup) {
    formGroup.appendChild(errorElement);
  }

  // Add error styling
  field.style.borderBottomColor = "var(--accent-color)";

  // Shake animation
  field.style.animation = "shake 0.5s ease-in-out";
  setTimeout(() => {
    field.style.animation = "";
  }, 500);
}

// Clear field error
function clearFieldError(field) {
  const formGroup =
    field.closest(".form-group") ||
    field.closest(".checkbox-option") ||
    field.closest(".terms-section");
  if (formGroup) {
    const existingError = formGroup.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }
  }

  field.style.borderBottomColor = "";
}

// Handle input focus
function handleInputFocus(e) {
  const formGroup = e.target.closest(".form-group");
  if (formGroup) {
    formGroup.classList.add("focused");
  }
}

// Handle input blur
function handleInputBlur(e) {
  const formGroup = e.target.closest(".form-group");
  if (formGroup) {
    formGroup.classList.remove("focused");

    if (e.target.value) {
      formGroup.classList.add("has-value");
    } else {
      formGroup.classList.remove("has-value");
    }
  }
}

// Toggle password visibility
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  const toggle = field.parentNode.querySelector(".password-toggle i");

  if (field.type === "password") {
    field.type = "text";
    toggle.className = "fas fa-eye-slash";
  } else {
    field.type = "password";
    toggle.className = "fas fa-eye";
  }
}

// Check password strength
function checkPasswordStrength() {
  const password = document.getElementById("password").value;
  const strengthFill = document.querySelector(".strength-fill");
  const strengthText = document.querySelector(".strength-text");

  let strength = 0;
  let strengthLabel = "";

  // Length check
  if (password.length >= 8) strength++;

  // Character type checks
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;

  // Determine strength level
  if (strength <= 2) {
    strengthLabel = "Weak";
    strengthFill.className = "strength-fill weak";
  } else if (strength === 3) {
    strengthLabel = "Fair";
    strengthFill.className = "strength-fill fair";
  } else if (strength === 4) {
    strengthLabel = "Good";
    strengthFill.className = "strength-fill good";
  } else if (strength === 5) {
    strengthLabel = "Strong";
    strengthFill.className = "strength-fill strong";
  }

  strengthText.textContent = password
    ? `Password strength: ${strengthLabel}`
    : "Password strength";
}

// Validate password match
function validatePasswordMatch() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (confirmPassword && password !== confirmPassword) {
    showFieldError(
      document.getElementById("confirmPassword"),
      "Passwords do not match"
    );
  } else {
    clearFieldError(document.getElementById("confirmPassword"));
  }
}

// Check email availability (simulated)
function checkEmailAvailability() {
  const emailField = document.getElementById("email");
  const email = emailField.value;

  if (!email || !validateField(emailField)) return;

  // Simulate checking email availability
  const unavailableEmails = ["test@example.com", "admin@popularonline.com"];

  if (unavailableEmails.includes(email.toLowerCase())) {
    showFieldError(emailField, "This email address is already registered");
  } else {
    // Show success indicator
    const successIcon = document.createElement("span");
    successIcon.innerHTML =
      '<i class="fas fa-check" style="color: var(--success-color); margin-left: 0.5rem;"></i>';
    successIcon.className = "email-available";

    // Remove existing indicator
    const existing = emailField.parentNode.querySelector(".email-available");
    if (existing) existing.remove();

    emailField.parentNode.appendChild(successIcon);

    setTimeout(() => {
      if (successIcon.parentNode) {
        successIcon.remove();
      }
    }, 3000);
  }
}

// Update review section
function updateReviewSection() {
  collectFormData();

  // Personal information review
  const personalReview = document.getElementById("reviewPersonal");
  personalReview.innerHTML = `
        <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Date of Birth:</strong> ${formatDate(formData.birthDate)}</p>
        <p><strong>Gender:</strong> ${formatGender(formData.gender)}</p>
    `;

  // Preferences review
  const preferencesReview = document.getElementById("reviewPreferences");
  const genres = formData.genres || [];
  const notifications = [];

  if (formData.emailNotifications) notifications.push("Email notifications");
  if (formData.smsNotifications) notifications.push("SMS notifications");
  if (formData.newsletter) notifications.push("Newsletter");

  preferencesReview.innerHTML = `
        <p><strong>Favorite Genres:</strong> ${
          genres.length ? genres.join(", ") : "None selected"
        }</p>
        <p><strong>Reading Frequency:</strong> ${formatReadingFrequency(
          formData.readingFrequency
        )}</p>
        <p><strong>Notifications:</strong> ${
          notifications.length ? notifications.join(", ") : "None selected"
        }</p>
        ${
          formData.comments
            ? `<p><strong>Comments:</strong> ${formData.comments}</p>`
            : ""
        }
    `;
}

// Collect form data
function collectFormData() {
  const formDataObj = new FormData(form);
  formData = {};

  // Basic form fields
  for (let [key, value] of formDataObj.entries()) {
    if (formData[key]) {
      // Handle multiple values (like checkboxes)
      if (Array.isArray(formData[key])) {
        formData[key].push(value);
      } else {
        formData[key] = [formData[key], value];
      }
    } else {
      formData[key] = value;
    }
  }

  // Handle checkboxes that weren't checked
  const checkboxes = form.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (!checkbox.checked && !formData[checkbox.name]) {
      formData[checkbox.name] = false;
    }
  });

  // Convert boolean strings to actual booleans
  [
    "emailNotifications",
    "smsNotifications",
    "newsletter",
    "terms",
    "marketing",
  ].forEach((key) => {
    if (formData[key] === "on") formData[key] = true;
    if (formData[key] === undefined) formData[key] = false;
  });
}

// Format helper functions
function formatDate(dateString) {
  if (!dateString) return "Not provided";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatGender(gender) {
  const genderMap = {
    male: "Male",
    female: "Female",
    other: "Other",
    "prefer-not-to-say": "Prefer not to say",
  };
  return genderMap[gender] || "Not specified";
}

function formatReadingFrequency(frequency) {
  const frequencyMap = {
    daily: "Daily reader",
    weekly: "Several times a week",
    monthly: "Once a month",
    occasionally: "Occasionally",
  };
  return frequencyMap[frequency] || "Not specified";
}

// Show loading overlay
function showLoading() {
  loadingOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Hide loading overlay
function hideLoading() {
  loadingOverlay.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Show success modal
function showSuccessModal() {
  successModal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Trigger success animation
  const successIcon = document.querySelector(".success-icon");
  successIcon.style.animation = "successPulse 1s ease-out";
}

// Close success modal
function closeModal() {
  successModal.classList.remove("active");
  document.body.style.overflow = "auto";

  // Redirect to dashboard or login
  window.location.href = "dashboard.html";
}

// Go to login page
function goToLogin() {
  window.location.href = "login.html";
}

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
  // Close modals with Escape
  if (e.key === "Escape") {
    if (successModal.classList.contains("active")) {
      closeModal();
    }
  }

  // Next step with Enter (if not in textarea)
  if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
    if (currentStep < 3) {
      e.preventDefault();
      nextStep();
    }
  }

  // Previous step with Shift+Tab on first input
  if (e.key === "Tab" && e.shiftKey) {
    const firstInput = document.querySelector(
      `#step${currentStep} input, #step${currentStep} select, #step${currentStep} textarea`
    );
    if (e.target === firstInput && currentStep > 1) {
      e.preventDefault();
      prevStep();
    }
  }
}

// Add floating label styles dynamically
const floatingLabelStyle = document.createElement("style");
floatingLabelStyle.textContent = `
    .form-group.focused label,
    .form-group.has-value label {
        transform: translateY(-1.5rem) scale(0.8);
        color: var(--accent-color);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-5px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(floatingLabelStyle);

// Track events for analytics
function trackEvent(eventName, eventData = {}) {
  console.log("Tracking event:", eventName, eventData);

  // Example: Google Analytics 4
  // gtag('event', eventName, eventData);

  // Example: Custom analytics
  // analytics.track(eventName, eventData);
}

// Initialize tooltips for help text
function initializeTooltips() {
  const helpIcons = document.querySelectorAll(".help-icon");
  helpIcons.forEach((icon) => {
    icon.addEventListener("mouseenter", showTooltip);
    icon.addEventListener("mouseleave", hideTooltip);
  });
}

// Show tooltip
function showTooltip(e) {
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.textContent = e.target.dataset.tooltip;
  tooltip.style.cssText = `
        position: absolute;
        background: var(--text-dark);
        color: white;
        padding: 0.5rem;
        border-radius: 5px;
        font-size: 0.8rem;
        z-index: 1000;
        white-space: nowrap;
        transform: translateX(-50%);
        margin-top: 0.5rem;
    `;

  e.target.appendChild(tooltip);
}

// Hide tooltip
function hideTooltip(e) {
  const tooltip = e.target.querySelector(".tooltip");
  if (tooltip) {
    tooltip.remove();
  }
}

// Save form progress to localStorage
function saveProgress() {
  collectFormData();
  localStorage.setItem(
    "signupProgress",
    JSON.stringify({
      step: currentStep,
      data: formData,
      timestamp: Date.now(),
    })
  );
}

// Load form progress from localStorage
function loadProgress() {
  const saved = localStorage.getItem("signupProgress");
  if (saved) {
    try {
      const progress = JSON.parse(saved);

      // Check if progress is recent (within 24 hours)
      const dayInMs = 24 * 60 * 60 * 1000;
      if (Date.now() - progress.timestamp < dayInMs) {
        // Show option to restore progress
        if (
          confirm(
            "We found a saved registration in progress. Would you like to continue where you left off?"
          )
        ) {
          formData = progress.data;
          restoreFormData();
          goToStep(progress.step);
        }
      } else {
        // Clear old progress
        localStorage.removeItem("signupProgress");
      }
    } catch (error) {
      console.error("Error loading saved progress:", error);
      localStorage.removeItem("signupProgress");
    }
  }
}

// Restore form data
function restoreFormData() {
  Object.keys(formData).forEach((key) => {
    const field = form.querySelector(`[name="${key}"]`);
    if (field) {
      if (field.type === "checkbox" || field.type === "radio") {
        field.checked = field.value === formData[key] || formData[key] === true;
      } else {
        field.value = formData[key];
      }

      // Trigger focus/blur to update labels
      if (field.value) {
        const formGroup = field.closest(".form-group");
        if (formGroup) {
          formGroup.classList.add("has-value");
        }
      }
    }
  });
}

// Initialize progress saving
document.addEventListener("DOMContentLoaded", function () {
  loadProgress();

  // Save progress on input changes
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("change", saveProgress);
  });

  // Save progress on step changes
  window.addEventListener("beforeunload", saveProgress);
});

// Clear saved progress on successful submission
function clearProgress() {
  localStorage.removeItem("signupProgress");
}

// Export functions for global access
window.nextStep = nextStep;
window.prevStep = prevStep;
window.goToStep = goToStep;
window.togglePassword = togglePassword;
window.closeModal = closeModal;
window.goToLogin = goToLogin;
