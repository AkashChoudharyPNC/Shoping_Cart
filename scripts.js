// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fetch products from a JSON API
async function loadProducts() {
    const response = await fetch('products.json'); // Local JSON file
    const products = await response.json();
    displayProducts(products);
}

// Display products dynamically
function displayProducts(products) {
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
        `;
        productContainer.appendChild(productElement);
    });
}

// Add item to the cart
function addToCart(id, name, price) {
    let item = cart.find(product => product.id === id);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCart();
}

// Update cart UI and save to localStorage
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));

    document.getElementById('cart-items').innerHTML = cart.map(item => `
        <li>
            ${item.name} - $${item.price * item.quantity}
            <div class="quantity-controls">
                ${item.quantity}
                <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
            </div>
        </li>
    `).join('');

    document.getElementById('cart-total').innerText = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    document.getElementById('cart-count').innerText = cart.reduce((count, item) => count + item.quantity, 0);
}

// Increase item quantity
function increaseQuantity(id) {
    let item = cart.find(product => product.id === id);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

// Decrease item quantity
function decreaseQuantity(id) {
    let item = cart.find(product => product.id === id);
    if (item) {
        item.quantity--;
        if (item.quantity === 0) {
            cart = cart.filter(product => product.id !== id);
        }
        updateCart();
    }
}

// Clear cart
function clearCart() {
    cart = [];
    updateCart();
}

// Toggle cart visibility
function toggleCart() {
    document.getElementById('cart').classList.toggle('show');
}

// Load products on page load
loadProducts();
updateCart();
