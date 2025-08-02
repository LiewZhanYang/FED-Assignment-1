// Job positions data
const jobPositions = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "technology",
    location: "johor-bahru",
    type: "full-time",
    salary: "RM 8,000 - RM 12,000",
    description:
      "Join our frontend team to build beautiful, responsive user interfaces using React, TypeScript, and modern CSS frameworks.",
    requirements: [
      "5+ years of frontend development experience",
      "Expert knowledge in React, TypeScript, and CSS",
      "Experience with modern build tools and workflows",
      "Strong understanding of web performance optimization",
    ],
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "UX/UI Designer",
    department: "design",
    location: "singapore",
    type: "full-time",
    salary: "SGD 5,500 - SGD 8,000",
    description:
      "Create intuitive and engaging user experiences for our digital platforms, working closely with product and engineering teams.",
    requirements: [
      "3+ years of UX/UI design experience",
      "Proficiency in Figma, Sketch, and Adobe Creative Suite",
      "Strong portfolio demonstrating user-centered design",
      "Experience with design systems and prototyping",
    ],
    posted: "1 week ago",
  },
  {
    id: 3,
    title: "Digital Marketing Specialist",
    department: "marketing",
    location: "kuala-lumpur",
    type: "full-time",
    salary: "RM 4,500 - RM 7,000",
    description:
      "Drive our digital marketing efforts across multiple channels including social media, email marketing, and content creation.",
    requirements: [
      "2+ years of digital marketing experience",
      "Experience with Google Analytics, Facebook Ads, and SEO",
      "Strong content creation and copywriting skills",
      "Knowledge of marketing automation tools",
    ],
    posted: "3 days ago",
  },
  {
    id: 4,
    title: "Backend Developer",
    department: "technology",
    location: "remote",
    type: "full-time",
    salary: "RM 7,000 - RM 11,000",
    description:
      "Build scalable backend systems and APIs using Node.js, Python, and cloud technologies to support our growing platform.",
    requirements: [
      "4+ years of backend development experience",
      "Proficiency in Node.js, Python, or similar languages",
      "Experience with databases and cloud platforms",
      "Understanding of microservices architecture",
    ],
    posted: "5 days ago",
  },
  {
    id: 5,
    title: "Operations Manager",
    department: "operations",
    location: "johor-bahru",
    type: "full-time",
    salary: "RM 6,000 - RM 9,000",
    description:
      "Oversee daily operations, manage logistics, and ensure smooth functioning of our retail and online operations.",
    requirements: [
      "5+ years of operations management experience",
      "Strong leadership and team management skills",
      "Experience with supply chain and logistics",
      "Excellent problem-solving abilities",
    ],
    posted: "1 day ago",
  },
  {
    id: 6,
    title: "Content Writer",
    department: "marketing",
    location: "hybrid",
    type: "part-time",
    salary: "RM 2,500 - RM 4,000",
    description:
      "Create engaging content for our blog, social media, and marketing campaigns focusing on books, education, and literacy.",
    requirements: [
      "2+ years of content writing experience",
      "Excellent English writing and communication skills",
      "Knowledge of SEO and content marketing",
      "Passion for books and education",
    ],
    posted: "1 week ago",
  },
  {
    id: 7,
    title: "Financial Analyst",
    department: "finance",
    location: "kuala-lumpur",
    type: "full-time",
    salary: "RM 5,000 - RM 7,500",
    description:
      "Analyze financial data, prepare reports, and support strategic decision-making processes across the organization.",
    requirements: [
      "3+ years of financial analysis experience",
      "Proficiency in Excel, SQL, and financial modeling",
      "CPA or relevant financial certification preferred",
      "Strong analytical and presentation skills",
    ],
    posted: "4 days ago",
  },
  {
    id: 8,
    title: "Mobile App Developer",
    department: "technology",
    location: "singapore",
    type: "contract",
    salary: "SGD 6,000 - SGD 9,000",
    description:
      "Develop and maintain our mobile applications for iOS and Android platforms using React Native or native technologies.",
    requirements: [
      "3+ years of mobile app development experience",
      "Experience with React Native, iOS, or Android development",
      "Knowledge of mobile app design patterns",
      "Experience with app store deployment",
    ],
    posted: "6 days ago",
  },
  {
    id: 9,
    title: "HR Coordinator",
    department: "hr",
    location: "johor-bahru",
    type: "full-time",
    salary: "RM 3,500 - RM 5,500",
    description:
      "Support HR operations including recruitment, onboarding, employee relations, and administrative tasks.",
    requirements: [
      "2+ years of HR experience",
      "Knowledge of employment law and HR best practices",
      "Strong interpersonal and communication skills",
      "Experience with HRIS systems",
    ],
    posted: "2 days ago",
  },
  {
    id: 10,
    title: "Data Scientist Intern",
    department: "technology",
    location: "remote",
    type: "internship",
    salary: "RM 1,500 - RM 2,500",
    description:
      "Work with our data team to analyze customer behavior, build predictive models, and generate insights for business decisions.",
    requirements: [
      "Currently pursuing degree in Data Science, Statistics, or related field",
      "Knowledge of Python, R, and SQL",
      "Understanding of machine learning concepts",
      "Strong analytical and problem-solving skills",
    ],
    posted: "3 days ago",
  },
];

// Global variables
let filteredJobs = [...jobPositions];
let currentlyDisplayed = 6;
let selectedJob = null;

// DOM elements
const jobsGrid = document.getElementById("jobsGrid");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const filterBtn = document.getElementById("filterBtn");
const filterSection = document.getElementById("filterSection");
const departmentFilter = document.getElementById("departmentFilter");
const locationFilter = document.getElementById("locationFilter");
const typeFilter = document.getElementById("typeFilter");
const searchInput = document.getElementById("searchInput");
const applicationModal = document.getElementById("applicationModal");
const successModal = document.getElementById("successModal");
const applicationForm = document.getElementById("applicationForm");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  displayJobs();
  initializeAnimations();
});

// Initialize event listeners
function initializeEventListeners() {
  // Filter functionality
  filterBtn.addEventListener("click", toggleFilterSection);
  departmentFilter.addEventListener("change", applyFilters);
  locationFilter.addEventListener("change", applyFilters);
  typeFilter.addEventListener("change", applyFilters);
  searchInput.addEventListener("input", debounce(applyFilters, 300));

  // Load more functionality
  loadMoreBtn.addEventListener("click", loadMoreJobs);

  // Form submission
  applicationForm.addEventListener("submit", handleFormSubmission);

  // File upload handling
  const fileInput = document.getElementById("resume");
  fileInput.addEventListener("change", handleFileUpload);

  // Modal close events
  document.addEventListener("keydown", handleKeyboardEvents);

  // Close modal when clicking outside
  applicationModal.addEventListener("click", (e) => {
    if (e.target === applicationModal) {
      closeModal();
    }
  });

  successModal.addEventListener("click", (e) => {
    if (e.target === successModal) {
      closeSuccessModal();
    }
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
        entry.target.style.animation = "fadeInUp 0.6s ease-out forwards";
      }
    });
  }, observerOptions);

  // Observe sections
  const sections = document.querySelectorAll(
    ".values-section, .jobs-section, .benefits-section"
  );
  sections.forEach((section) => observer.observe(section));
}

// Display jobs in the grid
function displayJobs() {
  const jobsToShow = filteredJobs.slice(0, currentlyDisplayed);

  jobsGrid.innerHTML = "";

  jobsToShow.forEach((job, index) => {
    const jobCard = createJobCard(job);
    jobCard.style.animationDelay = `${index * 0.1}s`;
    jobsGrid.appendChild(jobCard);
  });

  // Update load more button visibility
  if (currentlyDisplayed >= filteredJobs.length) {
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-flex";
    updateLoadMoreText();
  }
}

// Create job card element
function createJobCard(job) {
  const card = document.createElement("div");
  card.className = "job-card";
  card.style.animation = "fadeInUp 0.6s ease-out forwards";

  card.innerHTML = `
        <div class="job-header">
            <div>
                <h3 class="job-title">${job.title}</h3>
                <div class="job-meta">
                    <span><i class="fas fa-building"></i> ${formatDepartment(
                      job.department
                    )}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${formatLocation(
                      job.location
                    )}</span>
                    <span><i class="fas fa-clock"></i> ${formatType(
                      job.type
                    )}</span>
                    <span><i class="fas fa-calendar"></i> ${job.posted}</span>
                </div>
            </div>
            <span class="job-department ${job.department}">${formatDepartment(
    job.department
  )}</span>
        </div>
        <p class="job-description">${job.description}</p>
        <div class="job-requirements">
            <h4>Key Requirements:</h4>
            <ul>
                ${job.requirements
                  .slice(0, 3)
                  .map((req) => `<li>${req}</li>`)
                  .join("")}
                ${
                  job.requirements.length > 3
                    ? "<li>+ more requirements</li>"
                    : ""
                }
            </ul>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div class="job-salary">
                <strong>${job.salary}</strong>
            </div>
        </div>
        <div class="job-actions">
            <button class="job-btn primary" onclick="openApplicationModal(${
              job.id
            })">
                <span>Apply Now</span>
                <i class="fas fa-paper-plane"></i>
            </button>
            <button class="job-btn secondary" onclick="viewJobDetails(${
              job.id
            })">
                <span>View Details</span>
                <i class="fas fa-eye"></i>
            </button>
        </div>
    `;

  return card;
}

// Format helper functions
function formatDepartment(dept) {
  const departments = {
    technology: "Technology",
    design: "Design & UX",
    marketing: "Marketing",
    operations: "Operations",
    finance: "Finance",
    hr: "Human Resources",
  };
  return departments[dept] || dept;
}

function formatLocation(loc) {
  const locations = {
    "johor-bahru": "Johor Bahru",
    "kuala-lumpur": "Kuala Lumpur",
    singapore: "Singapore",
    remote: "Remote",
    hybrid: "Hybrid",
  };
  return locations[loc] || loc;
}

function formatType(type) {
  const types = {
    "full-time": "Full Time",
    "part-time": "Part Time",
    contract: "Contract",
    internship: "Internship",
  };
  return types[type] || type;
}

// Toggle filter section
function toggleFilterSection() {
  filterSection.style.display =
    filterSection.style.display === "none" ? "block" : "none";

  if (filterSection.style.display === "block") {
    filterSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// Apply filters
function applyFilters() {
  const departmentValue = departmentFilter.value;
  const locationValue = locationFilter.value;
  const typeValue = typeFilter.value;
  const searchValue = searchInput.value.toLowerCase();

  filteredJobs = jobPositions.filter((job) => {
    const matchesDepartment =
      !departmentValue || job.department === departmentValue;
    const matchesLocation = !locationValue || job.location === locationValue;
    const matchesType = !typeValue || job.type === typeValue;
    const matchesSearch =
      !searchValue ||
      job.title.toLowerCase().includes(searchValue) ||
      job.description.toLowerCase().includes(searchValue) ||
      job.requirements.some((req) => req.toLowerCase().includes(searchValue));

    return matchesDepartment && matchesLocation && matchesType && matchesSearch;
  });

  currentlyDisplayed = 6;
  displayJobs();

  // Show notification with results count
  showNotification(
    `Found ${filteredJobs.length} matching position${
      filteredJobs.length !== 1 ? "s" : ""
    }`,
    "info"
  );
}

// Load more jobs
function loadMoreJobs() {
  currentlyDisplayed += 6;
  displayJobs();

  // Smooth scroll to new jobs
  setTimeout(() => {
    const lastVisibleJob = jobsGrid.children[currentlyDisplayed - 6];
    if (lastVisibleJob) {
      lastVisibleJob.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
}

// Update load more button text
function updateLoadMoreText() {
  const remaining = filteredJobs.length - currentlyDisplayed;
  const loadMoreText = loadMoreBtn.querySelector("span");
  loadMoreText.textContent = `Load ${Math.min(remaining, 6)} More Position${
    Math.min(remaining, 6) !== 1 ? "s" : ""
  } (${remaining} remaining)`;
}

// Open application modal
function openApplicationModal(jobId) {
  selectedJob = jobPositions.find((job) => job.id === jobId);
  if (!selectedJob) return;

  document.getElementById(
    "modalJobTitle"
  ).textContent = `Apply for ${selectedJob.title}`;
  applicationModal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Focus on first input
  setTimeout(() => {
    document.getElementById("firstName").focus();
  }, 300);
}

// View job details
function viewJobDetails(jobId) {
  const job = jobPositions.find((j) => j.id === jobId);
  if (!job) return;

  // Create detailed view
  const detailModal = document.createElement("div");
  detailModal.className = "modal-overlay active";
  detailModal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${job.title}</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove(); document.body.style.overflow = 'auto';">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content">
                <div class="job-detail-info">
                    <div class="detail-meta">
                        <span><i class="fas fa-building"></i> ${formatDepartment(
                          job.department
                        )}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${formatLocation(
                          job.location
                        )}</span>
                        <span><i class="fas fa-clock"></i> ${formatType(
                          job.type
                        )}</span>
                        <span><i class="fas fa-money-bill-wave"></i> ${
                          job.salary
                        }</span>
                        <span><i class="fas fa-calendar"></i> Posted ${
                          job.posted
                        }</span>
                    </div>
                    <h4>Job Description</h4>
                    <p>${job.description}</p>
                    <h4>Requirements</h4>
                    <ul>
                        ${job.requirements
                          .map((req) => `<li>${req}</li>`)
                          .join("")}
                    </ul>
                    <div style="margin-top: 2rem;">
                        <button class="btn-primary" onclick="this.closest('.modal-overlay').remove(); openApplicationModal(${
                          job.id
                        });">
                            <span>Apply for this Position</span>
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(detailModal);
  document.body.style.overflow = "hidden";
}

// Close application modal
function closeModal() {
  applicationModal.classList.remove("active");
  document.body.style.overflow = "auto";
  applicationForm.reset();
  clearFileInfo();
}

// Close success modal
function closeSuccessModal() {
  successModal.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Handle file upload
function handleFileUpload(e) {
  const file = e.target.files[0];
  const fileInfo = document.getElementById("fileInfo");

  if (file) {
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    fileInfo.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-file-alt"></i>
                <span>${file.name} (${fileSize}MB)</span>
                <button type="button" onclick="clearFileUpload()" style="background: none; border: none; color: var(--accent-color); cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    // Validate file type and size
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      showNotification("Please upload a PDF, DOC, or DOCX file", "error");
      clearFileUpload();
      return;
    }

    if (file.size > maxSize) {
      showNotification("File size must be less than 5MB", "error");
      clearFileUpload();
      return;
    }
  }
}

// Clear file upload
function clearFileUpload() {
  document.getElementById("resume").value = "";
  clearFileInfo();
}

function clearFileInfo() {
  document.getElementById("fileInfo").innerHTML = "";
}

// Handle form submission
function handleFormSubmission(e) {
  e.preventDefault();

  // Validate form
  if (!validateForm()) {
    return;
  }

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalContent = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  submitBtn.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    closeModal();
    showSuccessModal();

    // Reset form and button
    applicationForm.reset();
    clearFileInfo();
    submitBtn.innerHTML = originalContent;
    submitBtn.disabled = false;

    // Send analytics event (in real app)
    trackApplicationSubmission(selectedJob);
  }, 2000);
}

// Validate form
function validateForm() {
  const requiredFields = applicationForm.querySelectorAll("[required]");
  let isValid = true;

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      showFieldError(field, "This field is required");
      isValid = false;
    } else {
      clearFieldError(field);
    }
  });

  // Validate email
  const email = document.getElementById("email");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value && !emailPattern.test(email.value)) {
    showFieldError(email, "Please enter a valid email address");
    isValid = false;
  }

  // Validate phone
  const phone = document.getElementById("phone");
  const phonePattern = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  if (phone.value && !phonePattern.test(phone.value)) {
    showFieldError(phone, "Please enter a valid phone number");
    isValid = false;
  }

  // Validate URL if provided
  const portfolio = document.getElementById("portfolio");
  if (portfolio.value) {
    try {
      new URL(portfolio.value);
      clearFieldError(portfolio);
    } catch {
      showFieldError(portfolio, "Please enter a valid URL");
      isValid = false;
    }
  }

  return isValid;
}

// Show field error
function showFieldError(field, message) {
  clearFieldError(field);

  const errorDiv = document.createElement("div");
  errorDiv.className = "field-error";
  errorDiv.textContent = message;
  errorDiv.style.color = "var(--accent-color)";
  errorDiv.style.fontSize = "0.8rem";
  errorDiv.style.marginTop = "0.25rem";

  field.parentNode.appendChild(errorDiv);
  field.style.borderBottomColor = "var(--accent-color)";
}

// Clear field error
function clearFieldError(field) {
  const existingError = field.parentNode.querySelector(".field-error");
  if (existingError) {
    existingError.remove();
  }
  field.style.borderBottomColor = "";
}

// Show success modal
function showSuccessModal() {
  successModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Handle keyboard events
function handleKeyboardEvents(e) {
  if (e.key === "Escape") {
    if (applicationModal.classList.contains("active")) {
      closeModal();
    }
    if (successModal.classList.contains("active")) {
      closeSuccessModal();
    }

    // Close any detail modals
    const detailModals = document.querySelectorAll(
      ".modal-overlay:not(#applicationModal):not(#successModal)"
    );
    detailModals.forEach((modal) => {
      modal.remove();
      document.body.style.overflow = "auto";
    });
  }
}

// Scroll to sections
function scrollToJobs() {
  document.getElementById("jobs").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function scrollToValues() {
  document.getElementById("values").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
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
            border-left: 4px solid #2196f3;
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
            color: #2196f3;
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

// Track application submission (for analytics)
function trackApplicationSubmission(job) {
  // In a real application, you would send this to your analytics service
  console.log("Application submitted for:", job.title);

  // Example: Google Analytics event
  // gtag('event', 'application_submit', {
  //     job_title: job.title,
  //     job_department: job.department,
  //     job_location: job.location
  // });
}

// Debounce function for search
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

// Add floating labels effect
document.addEventListener("DOMContentLoaded", function () {
  const formInputs = document.querySelectorAll(
    ".form-group input, .form-group textarea"
  );

  formInputs.forEach((input) => {
    // Check if input has value on page load
    if (input.value) {
      input.parentNode.classList.add("has-value");
    }

    input.addEventListener("focus", () => {
      input.parentNode.classList.add("focused");
    });

    input.addEventListener("blur", () => {
      input.parentNode.classList.remove("focused");
      if (input.value) {
        input.parentNode.classList.add("has-value");
      } else {
        input.parentNode.classList.remove("has-value");
      }
    });

    input.addEventListener("input", () => {
      if (input.value) {
        input.parentNode.classList.add("has-value");
      } else {
        input.parentNode.classList.remove("has-value");
      }
    });
  });
});

// Add CSS for floating labels effect
const floatingLabelStyle = document.createElement("style");
floatingLabelStyle.textContent = `
    .form-group.focused label,
    .form-group.has-value label {
        transform: translateY(-1.5rem) scale(0.8);
        color: var(--accent-color);
    }
    
    .job-detail-info .detail-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding: 1rem;
        background: var(--glass-bg);
        border-radius: 10px;
        border: 1px solid var(--glass-border);
    }
    
    .job-detail-info .detail-meta span {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .job-detail-info h4 {
        margin: 1.5rem 0 0.5rem 0;
        color: var(--text-primary);
        font-size: 1.2rem;
    }
    
    .job-detail-info p {
        color: var(--text-secondary);
        line-height: 1.6;
        margin-bottom: 1rem;
    }
    
    .job-detail-info ul {
        list-style: none;
        padding: 0;
    }
    
    .job-detail-info li {
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
        position: relative;
        padding-left: 1.5rem;
    }
    
    .job-detail-info li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--success-color);
        font-weight: bold;
    }
`;
document.head.appendChild(floatingLabelStyle);

// Export functions for global access
window.openApplicationModal = openApplicationModal;
window.viewJobDetails = viewJobDetails;
window.closeModal = closeModal;
window.closeSuccessModal = closeSuccessModal;
window.scrollToJobs = scrollToJobs;
window.scrollToValues = scrollToValues;
window.clearFileUpload = clearFileUpload;
