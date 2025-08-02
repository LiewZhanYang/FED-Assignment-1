// MapTiler configuration
maptilersdk.config.apiKey = "9tLUj0ZuQYqxTLAWYXWv";

// Location data
const locations = [
  {
    id: "midvalley",
    name: "Mid Valley Branch",
    address: "Mid Valley Megamall, Kuala Lumpur",
    coordinates: [103.7755928, 1.5017336],
    phone: "+60 3-2938 3800",
    hours: "Mon-Sun: 10:00 AM - 10:00 PM",
    type: "main",
    description:
      "Our flagship store with the largest selection of books and services.",
  },
  {
    id: "woodlands",
    name: "WoodLands Square Branch",
    address: "531 Upper Cross Street, Singapore",
    coordinates: [103.7845637, 1.4373375],
    phone: "+65 6467 3333",
    hours: "Mon-Sun: 10:00 AM - 9:30 PM",
    type: "branch",
    description: "Modern bookstore with café and study areas.",
  },
  {
    id: "paradigm",
    name: "Paradigm Mall Branch",
    address: "Paradigm Mall, Johor Bahru",
    coordinates: [103.6854102, 1.5146608],
    phone: "+60 7-3613 3888",
    hours: "Mon-Sun: 10:00 AM - 10:00 PM",
    type: "branch",
    description:
      "Family-friendly store with children's section and events space.",
  },
  {
    id: "sutera",
    name: "Sutera Mall Branch",
    address: "Sutera Mall, Skudai, Johor",
    coordinates: [103.6714557, 1.5171402],
    phone: "+60 7-5621 3888",
    hours: "Mon-Sun: 10:00 AM - 10:00 PM",
    type: "branch",
    description: "Cozy branch with focus on academic and professional books.",
  },
  {
    id: "aeon",
    name: "AEON Bukit Indah Branch",
    address: "AEON Bukit Indah Shopping Centre, Johor",
    coordinates: [103.6556599, 1.4804522],
    phone: "+60 7-2345 6789",
    hours: "Mon-Sun: 10:00 AM - 10:00 PM",
    type: "branch",
    description: "Convenient location with extended digital media section.",
  },
];

// Global variables
let map;
let markers = [];
let userLocationMarker = null;
let currentMapStyle = "streets";
let selectedLocation = null;

// DOM elements
const sidebar = document.getElementById("sidebar");
const locationsList = document.getElementById("locationsList");
const searchInput = document.getElementById("searchInput");
const locationInfo = document.getElementById("locationInfo");
const loadingScreen = document.getElementById("loadingScreen");
const legend = document.getElementById("legend");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeMap();
  initializeEventListeners();
  populateLocationsList();

  // Hide loading screen after map loads
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
  }, 2000);
});

// Initialize map
function initializeMap() {
  map = new maptilersdk.Map({
    container: "map",
    style: maptilersdk.MapStyle.STREETS,
    center: [103.7578, 1.5476], // Center of Johor Bahru area
    zoom: 10,
    pitch: 0,
    bearing: 0,
  });

  // Add geocoding control
  const gc = new maptilersdkMaptilerGeocoder.GeocodingControl({
    apiKey: maptilersdk.config.apiKey,
    placeholder: "Search for places...",
    proximity: [103.7578, 1.5476],
  });

  map.addControl(gc, "top-left");

  // Add navigation control
  map.addControl(new maptilersdk.NavigationControl(), "top-left");

  // Add scale control
  map.addControl(new maptilersdk.ScaleControl(), "bottom-left");

  // Map events
  map.on("load", () => {
    addLocationMarkers();
    addMapClickHandler();
  });

  map.on("style.load", () => {
    addLocationMarkers();
  });
}

// Add location markers to map
function addLocationMarkers() {
  // Clear existing markers
  markers.forEach((marker) => marker.remove());
  markers = [];

  locations.forEach((location) => {
    // Create custom marker element
    const markerEl = document.createElement("div");
    markerEl.className = `custom-marker ${location.type}`;
    markerEl.innerHTML = `
            <div class="marker-icon">
                <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="marker-pulse"></div>
        `;

    // Create popup content
    const popupContent = createPopupContent(location);

    // Create marker
    const marker = new maptilersdk.Marker({ element: markerEl })
      .setLngLat(location.coordinates)
      .setPopup(
        new maptilersdk.Popup({
          offset: 25,
          className: "custom-popup",
        }).setHTML(popupContent)
      )
      .addTo(map);

    // Add click event to marker
    markerEl.addEventListener("click", () => {
      selectLocation(location);
      highlightLocationInSidebar(location.id);
    });

    markers.push(marker);
  });

  // Add custom CSS for markers
  addMarkerStyles();
}

// Create popup content HTML
function createPopupContent(location) {
  return `
        <div class="popup-content">
            <h3>${location.name}</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${location.address}</p>
            <p><i class="fas fa-clock"></i> ${location.hours}</p>
            <p><i class="fas fa-info-circle"></i> ${location.description}</p>
            <div class="popup-actions">
                <button class="popup-btn primary" onclick="getDirections('${location.id}')">
                    <i class="fas fa-directions"></i> Directions
                </button>
                <button class="popup-btn secondary" onclick="callBranch('${location.phone}')">
                    <i class="fas fa-phone"></i> Call
                </button>
            </div>
        </div>
    `;
}

// Add marker styles dynamically
function addMarkerStyles() {
  if (document.getElementById("marker-styles")) return;

  const style = document.createElement("style");
  style.id = "marker-styles";
  style.textContent = `
        .custom-marker {
            position: relative;
            cursor: pointer;
            transform: translate(-50%, -100%);
        }
        
        .marker-icon {
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
            transition: all 0.3s ease;
        }
        
        .marker-icon i {
            transform: rotate(45deg);
            color: white;
            font-size: 16px;
        }
        
        .custom-marker.main .marker-icon {
            background: #ff6b6b;
            box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        }
        
        .custom-marker.branch .marker-icon {
            background: #4ecdc4;
            box-shadow: 0 4px 15px rgba(78, 205, 196, 0.4);
        }
        
        .marker-pulse {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: pulse-marker 2s infinite;
        }
        
        .custom-marker.main .marker-pulse {
            background: rgba(255, 107, 107, 0.3);
        }
        
        .custom-marker.branch .marker-pulse {
            background: rgba(78, 205, 196, 0.3);
        }
        
        .custom-marker:hover .marker-icon {
            transform: rotate(-45deg) scale(1.2);
        }
        
        @keyframes pulse-marker {
            0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
}

// Initialize event listeners
function initializeEventListeners() {
  // Toggle sidebar
  document
    .getElementById("toggleSidebar")
    .addEventListener("click", toggleSidebar);
  document
    .getElementById("closeSidebar")
    .addEventListener("click", closeSidebar);

  // Find user location
  document.getElementById("findMe").addEventListener("click", findUserLocation);

  // Map controls
  document
    .getElementById("zoomIn")
    .addEventListener("click", () => map.zoomIn());
  document
    .getElementById("zoomOut")
    .addEventListener("click", () => map.zoomOut());
  document.getElementById("resetView").addEventListener("click", resetMapView);
  document
    .getElementById("toggleStyle")
    .addEventListener("click", toggleMapStyle);

  // Search functionality
  searchInput.addEventListener("input", handleSearch);

  // Legend toggle
  document
    .getElementById("toggleLegend")
    .addEventListener("click", toggleLegend);

  // Location info actions
  document.getElementById("getDirections").addEventListener("click", () => {
    if (selectedLocation) getDirections(selectedLocation.id);
  });

  document.getElementById("callBranch").addEventListener("click", () => {
    if (selectedLocation) callBranch(selectedLocation.phone);
  });

  // Close sidebar when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !sidebar.contains(e.target) &&
      !document.getElementById("toggleSidebar").contains(e.target)
    ) {
      closeSidebar();
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);
}

// Populate locations list in sidebar
function populateLocationsList() {
  locationsList.innerHTML = "";

  locations.forEach((location) => {
    const locationItem = document.createElement("div");
    locationItem.className = "location-item";
    locationItem.dataset.locationId = location.id;

    locationItem.innerHTML = `
            <h4>
                <i class="fas fa-${
                  location.type === "main" ? "star" : "store"
                }"></i>
                ${location.name}
            </h4>
            <p><i class="fas fa-map-marker-alt"></i> ${location.address}</p>
            <div class="location-meta">
                <span><i class="fas fa-clock"></i> ${location.hours}</span>
            </div>
        `;

    locationItem.addEventListener("click", () => {
      selectLocation(location);
      flyToLocation(location);
      highlightLocationInSidebar(location.id);
    });

    locationsList.appendChild(locationItem);
  });
}

// Handle search functionality
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const locationItems = locationsList.querySelectorAll(".location-item");

  locationItems.forEach((item) => {
    const text = item.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      item.style.display = "block";
      item.style.animation = "fadeInUp 0.3s ease-out";
    } else {
      item.style.display = "none";
    }
  });
}

// Toggle sidebar
function toggleSidebar() {
  sidebar.classList.toggle("active");
}

function closeSidebar() {
  sidebar.classList.remove("active");
}

// Find user location
function findUserLocation() {
  if (!navigator.geolocation) {
    showNotification("Geolocation is not supported by this browser", "error");
    return;
  }

  const findBtn = document.getElementById("findMe");
  const originalContent = findBtn.innerHTML;

  findBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i><span>Finding...</span>';
  findBtn.disabled = true;

  navigator.geolocation
    .getCurrentPosition(
      (position) => {
        const userLocation = [
          position.coords.longitude,
          position.coords.latitude,
        ];

        // Remove existing user marker
        if (userLocationMarker) {
          userLocationMarker.remove();
        }

        // Create user location marker
        const userMarkerEl = document.createElement("div");
        userMarkerEl.className = "user-marker";
        userMarkerEl.innerHTML = `
                <div class="user-marker-icon">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-marker-pulse"></div>
            `;

        userLocationMarker = new maptilersdk.Marker({ element: userMarkerEl })
          .setLngLat(userLocation)
          .setPopup(new maptilersdk.Popup().setHTML("<h3>Your Location</h3>"))
          .addTo(map);

        // Fly to user location
        map.flyTo({
          center: userLocation,
          zoom: 14,
          duration: 2000,
        });

        showNotification("Location found!", "success");

        // Add user marker styles
        addUserMarkerStyles();
      },
      (error) => {
        let message = "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable";
            break;
          case error.TIMEOUT:
            message = "Location request timed out";
            break;
        }
        showNotification(message, "error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
    .finally(() => {
      findBtn.innerHTML = originalContent;
      findBtn.disabled = false;
    });
}

// Add user marker styles
function addUserMarkerStyles() {
  if (document.getElementById("user-marker-styles")) return;

  const style = document.createElement("style");
  style.id = "user-marker-styles";
  style.textContent = `
        .user-marker {
            position: relative;
            cursor: pointer;
        }
        
        .user-marker-icon {
            width: 25px;
            height: 25px;
            background: #ffa726;
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 2;
            box-shadow: 0 4px 15px rgba(255, 167, 38, 0.4);
        }
        
        .user-marker-icon i {
            color: white;
            font-size: 12px;
        }
        
        .user-marker-pulse {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 25px;
            height: 25px;
            background: rgba(255, 167, 38, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: pulse-user 2s infinite;
        }
        
        @keyframes pulse-user {
            0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(3);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
}

// Select location and show info
function selectLocation(location) {
  selectedLocation = location;

  document.getElementById("locationName").textContent = location.name;
  document.getElementById("locationAddress").innerHTML = `
        <i class="fas fa-map-marker-alt"></i> ${location.address}<br>
        <i class="fas fa-clock"></i> ${location.hours}<br>
        <i class="fas fa-phone"></i> ${location.phone}
    `;

  document.getElementById("locationActions").style.display = "flex";
  locationInfo.classList.add("active");
}

// Highlight location in sidebar
function highlightLocationInSidebar(locationId) {
  const items = locationsList.querySelectorAll(".location-item");
  items.forEach((item) => {
    item.classList.remove("active");
    if (item.dataset.locationId === locationId) {
      item.classList.add("active");
    }
  });
}

// Fly to location
function flyToLocation(location) {
  map.flyTo({
    center: location.coordinates,
    zoom: 16,
    duration: 2000,
  });
}

// Reset map view
function resetMapView() {
  map.flyTo({
    center: [103.7578, 1.5476],
    zoom: 10,
    pitch: 0,
    bearing: 0,
    duration: 2000,
  });

  locationInfo.classList.remove("active");
  highlightLocationInSidebar(null);
}

// Toggle map style
function toggleMapStyle() {
  const styles = {
    streets: maptilersdk.MapStyle.STREETS,
    satellite: maptilersdk.MapStyle.SATELLITE,
    terrain: maptilersdk.MapStyle.TERRAIN,
  };

  const styleKeys = Object.keys(styles);
  const currentIndex = styleKeys.indexOf(currentMapStyle);
  const nextIndex = (currentIndex + 1) % styleKeys.length;
  currentMapStyle = styleKeys[nextIndex];

  map.setStyle(styles[currentMapStyle]);

  showNotification(`Switched to ${currentMapStyle} view`, "info");
}

// Toggle legend
function toggleLegend() {
  legend.classList.toggle("active");
  const icon = document.querySelector("#toggleLegend i");
  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");
}

// Get directions to location
function getDirections(locationId) {
  const location = locations.find((loc) => loc.id === locationId);
  if (!location) return;

  const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates[1]},${location.coordinates[0]}`;
  window.open(url, "_blank");
}

// Call branch
function callBranch(phone) {
  window.location.href = `tel:${phone}`;
}

// Add map click handler
function addMapClickHandler() {
  map.on("click", (e) => {
    // If click is not on a marker, hide location info
    const features = map.queryRenderedFeatures(e.point);
    if (features.length === 0) {
      locationInfo.classList.remove("active");
      highlightLocationInSidebar(null);
      selectedLocation = null;
    }
  });
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
  if (e.target.tagName === "INPUT") return;

  switch (e.key) {
    case "Escape":
      closeSidebar();
      locationInfo.classList.remove("active");
      break;
    case "s":
    case "S":
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        toggleSidebar();
      }
      break;
    case "f":
    case "F":
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        searchInput.focus();
      }
      break;
    case "r":
    case "R":
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        resetMapView();
      }
      break;
  }
}

// Show notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <i class="fas fa-${
          type === "success"
            ? "check-circle"
            : type === "error"
            ? "exclamation-triangle"
            : "info-circle"
        }"></i>
        <span>${message}</span>
    `;

  document.body.appendChild(notification);

  // Add notification styles if not exists
  addNotificationStyles();

  // Show notification
  setTimeout(() => notification.classList.add("show"), 100);

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => document.body.removeChild(notification), 300);
  }, 3000);
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
            background: var(--dark-glass);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 10px;
            padding: 1rem 1.5rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease-out;
            min-width: 250px;
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
        
        .notification.info {
            border-left: 4px solid var(--warning-color);
        }
        
        .notification i {
            font-size: 1.2rem;
            flex-shrink: 0;
        }
        
        .notification.success i {
            color: var(--success-color);
        }
        
        .notification.error i {
            color: var(--accent-color);
        }
        
        .notification.info i {
            color: var(--warning-color);
        }
    `;
  document.head.appendChild(style);
}

// Export functions for global access
window.getDirections = getDirections;
window.callBranch = callBranch;
