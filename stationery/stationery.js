// Enhanced Stationery Page JavaScript

// Global Variables
let currentView = 'grid';
let activeCategory = 'writing';
let searchQuery = '';
let priceRange = 100;
let sortBy = 'default';
let wishlist = JSON.parse(localStorage.getItem('stationery-wishlist') || '[]');
let cart = JSON.parse(localStorage.getItem('stationery-cart') || '[]');
let cartCount = cart.reduce((total, item) => total + item.quantity, 0);

// Enhanced Stationery Database
const stationeryDatabase = {
    writing: [
        {
            id: 101,
            title: "Premium Fountain Pen",
            brand: "Pilot",
            price: 45.99,
            originalPrice: 59.99,
            category: "writing",
            rating: 4.8,
            reviews: 156,
            image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=300&h=300&fit=crop",
            description: "Professional fountain pen with smooth ink flow and elegant design.",
            features: ["Smooth ink flow", "Ergonomic grip", "Refillable cartridge"],
            inStock: true
        },
        {
            id: 102,
            title: "Mechanical Pencil Set",
            brand: "Faber-Castell",
            price: 24.99,
            originalPrice: 29.99,
            category: "writing",
            rating: 4.6,
            reviews: 89,
            image: "https://images.unsplash.com/photo-1606559013429-3dbcb1c0e5b4?w=300&h=300&fit=crop",
            description: "Professional mechanical pencils for precise drawing and writing.",
            features: ["0.5mm lead", "Comfortable grip", "Lead indicator"],
            inStock: true
        },
        {
            id: 103,
            title: "Premium Marker Set",
            brand: "Stabilo",
            price: 32.99,
            originalPrice: 39.99,
            category: "writing",
            rating: 4.7,
            reviews: 203,
            image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop",
            description: "High-quality markers with vibrant colors for professional use.",
            features: ["48 colors", "Dual tips", "Non-toxic ink"],
            inStock: true
        },
        {
            id: 104,
            title: "Gel Pen Collection",
            brand: "Pilot",
            price: 18.99,
            originalPrice: 22.99,
            category: "writing",
            rating: 4.5,
            reviews: 127,
            image: "https://images.unsplash.com/photo-1565884131-4b3e9e4cb3b5?w=300&h=300&fit=crop",
            description: "Smooth gel pens in assorted colors for everyday writing.",
            features: ["12 colors", "Smooth gel ink", "Comfortable grip"],
            inStock: true
        }
    ],
    paper: [
        {
            id: 201,
            title: "Premium Leather Notebook",
            brand: "Moleskine",
            price: 35.99,
            originalPrice: 45.99,
            category: "paper",
            rating: 4.9,
            reviews: 342,
            image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=300&h=300&fit=crop",
            description: "Elegant leather-bound notebook with premium paper quality.",
            features: ["240 pages", "Dotted pages", "Elastic closure"],
            inStock: true
        },
        {
            id: 202,
            title: "Colorful Sticky Notes",
            brand: "Post-it",
            price: 12.99,
            originalPrice: 15.99,
            category: "paper",
            rating: 4.4,
            reviews: 98,
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=300&fit=crop",
            description: "Bright colored sticky notes for organization and reminders.",
            features: ["8 colors", "Super sticky", "Recyclable"],
            inStock: true
        }
    ],
    artcraft: [
        {
            id: 301,
            title: "Professional Watercolor Set",
            brand: "Winsor & Newton",
            price: 89.99,
            originalPrice: 119.99,
            category: "artcraft",
            rating: 4.8,
            reviews: 267,
            image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300&h=300&fit=crop",
            description: "Professional-grade watercolor paints for artists.",
            features: ["24 colors", "Artist quality", "Mixing palette included"],
            inStock: true
        }
    ],
    office: [
        {
            id: 401,
            title: "Bamboo Desk Organizer",
            brand: "Bamboo Co.",
            price: 42.99,
            originalPrice: 52.99,
            category: "office",
            rating: 4.6,
            reviews: 134,
            image: "https://images.unsplash.com/photo-1586953270161-e6c4e4d4c5d8?w=300&h=300&fit=crop",
            description: "Eco-friendly bamboo desk organizer for office supplies.",
            features: ["Sustainable bamboo", "Multiple compartments", "Natural finish"],
            inStock: true
        }
    ]
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeStationeryPage();
    updateCartCount();
    updateWishlistDisplay();
    showWelcomeOffer();
    initializeScrollEffects();
});

// Initialize stationery page features
function initializeStationeryPage() {
    // Initialize price slider
    const priceSlider = document.getElementById('priceRange');
    if (priceSlider) {
        priceSlider.addEventListener('input', handlePriceFilter);
        updatePriceDisplay(priceSlider.value);
    }
    
    // Initialize sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }
    
    // Initialize category links
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            switchCategory(category);
            scrollToSection(`#${category}`);
        });
    });
    
    // Initialize search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Initialize brand filters
    document.querySelectorAll('.filter-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Initialize scroll spy
    initializeScrollSpy();
    
    // Initialize intersection observer for animations
    initializeAnimationObserver();
    
    // Show newsletter popup after delay
    setTimeout(showNewsletterPopup, 10000);
}

// Hero button scroll to products
function scrollToProducts() {
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Toggle search overlay
function toggleSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    
    if (searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput.focus(), 300);
    }
}

// Toggle sidebar (mobile)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
    
    // Add backdrop for mobile
    if (sidebar.classList.contains('active')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height:
    }
    }
    
            