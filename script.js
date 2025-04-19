// DOM Elements
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const totalPriceElement = document.querySelector('.total-price');
const checkoutBtn = document.querySelector('.checkout-btn');

// Cart Data (Load from localStorage)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize Cart
updateCart();

// Open/Close Cart
cartIcon.addEventListener('click', () => cartSidebar.classList.add('active'));
closeCart.addEventListener('click', () => cartSidebar.classList.remove('active'));

// Add to Cart
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const id = button.getAttribute('data-id');
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));
        const img = button.getAttribute('data-img');

        // Check if item already in cart
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id,
                name,
                price,
                img,
                quantity: 1
            });
        }

        updateCart();
        animateAddToCart(button);
    });
});

// Update Cart UI
function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="decrease-quantity" data-index="${index}">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase-quantity" data-index="${index}">+</button>
                    </div>
                </div>
                <span class="remove-item" data-index="${index}">&times;</span>
            </div>
        `;
    });

    // Update total and count
    totalPriceElement.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Add event listeners to new buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            cart.splice(index, 1);
            updateCart();
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCart();
        });
    });

    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            cart[index].quantity++;
            updateCart();
        });
    });
}

// Animate Add to Cart button
function animateAddToCart(button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.backgroundColor = '';
    }, 1000);
}

// Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
    } else {
        alert(`Order placed! Total: $${totalPriceElement.textContent}`);
        cart = [];
        updateCart();
        cartSidebar.classList.remove('active');
    }
});