// ===== Checkout Multi-Step Form =====

let currentStep = 1;
const totalSteps = 4;
let orderData = {
  cart: [],
  shipping: {},
  payment: {},
  promo: null
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initializeCheckout();
  loadCartData();
  setupEventListeners();
  updateOrderSummary();
});

// Initialize checkout
function initializeCheckout() {
  showStep(1);
  updateProgressBar();
}

// Load cart data from cookie or localStorage
function loadCartData() {
  try {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('listCart='));
    
    if (cookieValue) {
      orderData.cart = JSON.parse(cookieValue.split('=')[1]);
    } else {
      // Sample cart data for demo
      orderData.cart = [
        {
          id: 1,
          name: 'The Psychology of Money',
          author: 'Morgan Housel',
          category: 'Business & Finance',
          price: 29.99,
          originalPrice: 39.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&h=200&fit=crop'
        },
        {
          id: 2,
          name: 'Atomic Habits',
          author: 'James Clear',
          category: 'Self-Help',
          price: 24.99,
          originalPrice: 29.99,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=150&h=200&fit=crop'
        }
      ];
    }
  } catch (error) {
    console.error('Error loading cart data:', error);
    orderData.cart = [];
  }
}

// Setup event listeners
function setupEventListeners() {
  // Form validation
  const forms = document.querySelectorAll('.checkout-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  });

  // Card number formatting
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', formatCardNumber);
  }

  // Expiry date formatting
  const expiryInput = document.getElementById('expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', formatExpiry);
  }

  // CVV formatting
  const cvvInput = document.getElementById('cvv');
  if (cvvInput) {
    cvvInput.addEventListener('input', formatCVV);
  }

  // Shipping method change
  const shippingInputs = document.querySelectorAll('input[name="shipping"]');
  shippingInputs.forEach(input => {
    input.addEventListener('change', updateShippingCost);
  });
}

// Navigation functions
function nextStep() {
  if (validateCurrentStep()) {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
      updateProgressBar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
    updateProgressBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function showStep(step) {
  // Hide all steps
  document.querySelectorAll('.checkout-step').forEach(stepEl => {
    stepEl.classList.remove('active');
  });

  // Show current step
  const currentStepEl = document.getElementById(`step${step}`);
  if (currentStepEl) {
    currentStepEl.classList.add('active');
  }
}

function updateProgressBar() {
  // Update step indicators
  document.querySelectorAll('.step').forEach((step, index) => {
    const stepNumber = index + 1;
    if (stepNumber < currentStep) {
      step.classList.add('completed');
      step.classList.remove('active');
    } else if (stepNumber === currentStep) {
      step.classList.add('active');
      step.classList.remove('completed');
    } else {
      step.classList.remove('active', 'completed');
    }
  });

  // Update step lines
  document.querySelectorAll('.step-line').forEach((line, index) => {
    if (index < currentStep - 1) {
      line.classList.add('active');
    } else {
      line.classList.remove('active');
    }
  });
}

function validateCurrentStep() {
  switch(currentStep) {
    case 1:
      return validateCart();
    case 2:
      return validateShipping();
    case 3:
      return validatePayment();
    default:
      return true;
  }
}

function validateCart() {
  if (orderData.cart.length === 0) {
    showNotification('Your cart is empty!', 'error');
    return false;
  }
  return true;
}

function validateShipping() {
  const form = document.getElementById('shippingForm');
  if (!form) return true;

  const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip'];
  
  for (let field of requiredFields) {
    const input = document.getElementById(field);
    if (!input || !input.value.trim()) {
      showNotification(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
      input?.focus();
      return false;
    }
  }

  // Email validation
  const email = document.getElementById('email').value;
  if (!isValidEmail(email)) {
    showNotification('Please enter a valid email address', 'error');
    return false;
  }

  // Save shipping data
  orderData.shipping = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    zip: document.getElementById('zip').value,
    method: document.querySelector('input[name="shipping"]:checked')?.value || 'standard'
  };

  return true;
}

function validatePayment() {
  const form = document.getElementById('paymentForm');
  if (!form) return true;

  const cardName = document.getElementById('cardName')?.value;
  const cardNumber = document.getElementById('cardNumber')?.value;
  const expiry = document.getElementById('expiry')?.value;
  const cvv = document.getElementById('cvv')?.value;

  if (!cardName || !cardNumber || !expiry || !cvv) {
    showNotification('Please fill in all payment details', 'error');
    return false;
  }

  // Basic card number validation (should be 16 digits)
  const cleanCardNumber = cardNumber.replace(/\s/g, '');
  if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
    showNotification('Please enter a valid card number', 'error');
    return false;
  }

  // Save payment data (in production, never store actual payment details)
  orderData.payment = {
    cardName: cardName,
    cardLast4: cleanCardNumber.slice(-4),
    method: document.querySelector('input[name="payment"]:checked')?.value || 'card'
  };

  return true;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Cart manipulation functions
function updateQuantity(button, change) {
  const cartItem = button.closest('.cart-item');
  const qtyInput = cartItem.querySelector('.qty-input');
  let currentQty = parseInt(qtyInput.value);
  let newQty = currentQty + change;

  if (newQty >= 1) {
    qtyInput.value = newQty;
    
    // Update cart data
    const itemIndex = Array.from(cartItem.parentElement.children).indexOf(cartItem);
    if (orderData.cart[itemIndex]) {
      orderData.cart[itemIndex].quantity = newQty;
    }

    updateOrderSummary();
  }
}

function removeItem(button) {
  const cartItem = button.closest('.cart-item');
  const itemIndex = Array.from(cartItem.parentElement.children).indexOf(cartItem);
  
  // Remove from cart data
  orderData.cart.splice(itemIndex, 1);
  
  // Remove from DOM with animation
  cartItem.style.opacity = '0';
  cartItem.style.transform = 'translateX(-20px)';
  
  setTimeout(() => {
    cartItem.remove();
    updateOrderSummary();
    
    if (orderData.cart.length === 0) {
      showNotification('Your cart is empty', 'info');
    }
  }, 300);
}

// Order summary functions
function updateOrderSummary() {
  let subtotal = 0;
  
  orderData.cart.forEach(item => {
    subtotal += item.price * item.quantity;
  });

  const shippingCost = getShippingCost();
  const discount = orderData.promo ? calculateDiscount(subtotal) : 0;
  const taxRate = 0.06; // 6% tax
  const tax = (subtotal + shippingCost - discount) * taxRate;
  const total = subtotal + shippingCost - discount + tax;

  // Update summary display
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('shipping').textContent = shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`;
  document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;

  if (discount > 0) {
    document.getElementById('discountRow').style.display = 'flex';
    document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
  } else {
    document.getElementById('discountRow').style.display = 'none';
  }
}

function getShippingCost() {
  const selectedShipping = document.querySelector('input[name="shipping"]:checked');
  if (!selectedShipping) return 0;

  switch(selectedShipping.value) {
    case 'express': return 9.99;
    case 'overnight': return 19.99;
    default: return 0;
  }
}

function updateShippingCost() {
  updateOrderSummary();
}

function applyPromo() {
  const promoInput = document.getElementById('promoInput');
  const promoCode = promoInput.value.trim().toUpperCase();

  // Sample promo codes
  const validPromos = {
    'SAVE10': { type: 'percentage', value: 10 },
    'SAVE20': { type: 'percentage', value: 20 },
    'FIRST15': { type: 'percentage', value: 15 }
  };

  if (validPromos[promoCode]) {
    orderData.promo = validPromos[promoCode];
    showNotification(`Promo code applied! You saved ${validPromos[promoCode].value}%`, 'success');
    updateOrderSummary();
    promoInput.disabled = true;
  } else {
    showNotification('Invalid promo code', 'error');
  }
}

function calculateDiscount(subtotal) {
  if (!orderData.promo) return 0;
  
  if (orderData.promo.type === 'percentage') {
    return subtotal * (orderData.promo.value / 100);
  }
  return orderData.promo.value;
}

// Payment input formatting
function formatCardNumber(e) {
  let value = e.target.value.replace(/\s/g, '');
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
  e.target.value = formattedValue;
}

function formatExpiry(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4);
  }
  e.target.value = value;
}

function formatCVV(e) {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
}

// Complete order
function completeOrder() {
  if (!validatePayment()) return;

  // Show loading overlay
  const loadingOverlay = document.getElementById('loadingOverlay');
  loadingOverlay.classList.add('active');

  // Simulate order processing
  setTimeout(() => {
    loadingOverlay.classList.remove('active');
    
    // Generate order number
    const orderNumber = `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;
    document.getElementById('orderNumber').textContent = orderNumber;

    // Set order date
    const orderDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    document.getElementById('orderDate').textContent = orderDate;

    // Set delivery date (5-7 days from now)
    const deliveryStart = new Date();
    deliveryStart.setDate(deliveryStart.getDate() + 5);
    const deliveryEnd = new Date();
    deliveryEnd.setDate(deliveryEnd.getDate() + 7);
    const deliveryDateText = `${deliveryStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}-${deliveryEnd.toLocaleDateString('en-US', { day: 'numeric' })}, ${deliveryEnd.getFullYear()}`;
    document.getElementById('deliveryDate').textContent = deliveryDateText;

    // Move to confirmation step
    currentStep = 4;
    showStep(4);
    updateProgressBar();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Clear cart
    document.cookie = 'listCart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideInRight 0.3s ease;
    max-width: 400px;
  `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
