let iconCart = document.querySelector(".cartb");
let cart = document.querySelector(".cart");
let container = document.querySelector(".container");
let close = document.querySelector(".close");

iconCart.addEventListener("click", function () {
  if (cart.style.right == "-100%") {
    cart.style.right = "0";
    container.style.transform = "translateX(-400px)";
  } else {
    cart.style.right = "-100%";
    container.style.transform = "translateX(0)";
  }
});
close.addEventListener("click", function () {
  cart.style.right = "-100%";
  container.style.transform = "translateX(0)";
});

const product = [
  {
    id: 0,
    Image: "image/book1.png",
    title: "Z Flip Foldable Mobile",
    price: 120,
  },
  {
    id: 1,
    Image: "image/book2.png",
    title: "Z Flip Foldable Mobile",
    price: 120,
  },
  {
    id: 2,
    Image: "image/book3.png",
    title: "Z Flip Foldable Mobile",
    price: 120,
  },
  {
    id: 3,
    Image: "image/book4.png",
    title: "Z Flip Foldable Mobile",
    price: 120,
  },
];

function addToCart(button) {
  // Find the parent box element
  const box = button.closest(".box");

  // Extract product information from data attributes
  const productId = box.getAttribute("data-product-id");
  const productTitle = box.getAttribute("data-product-title");
  const productPrice = parseFloat(box.getAttribute("data-product-price"));

  // Add the product to the cart
  addProductToCart(productId, productTitle, productPrice);

  // Update the cart display
  updateCartDisplay();
}

const car = [];

function addProductToCart(id, title, price) {
  const productInCart = car.find((product) => product.id === id);

  if (!productInCart) {
    // If the product is not in the cart, add it
    car.push({
      id: id,
      title: title,
      price: price,
      quantity: 1,
    });
  } else {
    // If the product is already in the cart, increase the quantity
    productInCart.quantity++;
  }
}

function updateCartDisplay() {
  // Update the HTML cart display with the current cart contents
  const cartList = document.querySelector(".listCart");
  cartList.innerHTML = "";

  cart.forEach((product) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("item");
    cartItem.innerHTML = `
      <div class="name">${product.title}</div>
      <div class="price">$${product.price} / ${product.quantity} product</div>
      <button onclick="changeQuantity(${product.id}, '-')">-</button>
      <span class="value">${product.quantity}</span>
      <button onclick="changeQuantity(${product.id}, '+')">+</button>
    `;
    cartList.appendChild(cartItem);
  });

  // Calculate and display the total quantity and total price
  const totalQuantity = car.reduce(
    (total, product) => total + product.quantity,
    0
  );
  const totalPrice = car.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
  const totalQuantityElement = document.querySelector(".totalQuantity");
  const totalPriceElement = document.querySelector(".totalPrice");
  totalQuantityElement.innerText = totalQuantity;
  totalPriceElement.innerText = `$${totalPrice.toFixed(2)}`;
}
