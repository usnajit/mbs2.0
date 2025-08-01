
// In products.html, add this to a button click handler:
async function checkInteractions() {
    const selectedMeds = ["Vonocab", "Emijoy"]; // Get from user input
    const response = await fetch('http://localhost:5000/check-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications: selectedMeds })
    });
    const data = await response.json();
    alert(`Warnings: ${data.interactions.join(', ')}`);
}
// Add to script.js 
function searchProducts() {
  const searchTerm = document.querySelector('.search-bar input').value.toLowerCase();
  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(card => {
    const productName = card.querySelector('.product-name').textContent.toLowerCase();
    const genericName = card.querySelector('.product-generic').textContent.toLowerCase();
    
    if (productName.includes(searchTerm) || genericName.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Add this to your existing script
document.querySelector('.search-bar button').addEventListener('click', searchProducts);
document.querySelector('.search-bar input').addEventListener('keyup', function(e) {
  if (e.key === 'Enter') searchProducts();
});
function login() {
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const countryCode = document.getElementById('country-code').value;

    // Simple validation
    if(phone.length !== 10) {
        alert("Please enter 10-digit phone number");
        return;
    }
    
    if(password.length !== 5) {
        alert("PIN must be 5 digits");
        return;
    }

    // Save login status (in real app, verify with server)
    localStorage.setItem('isLoggedIn', 'true');
    
    alert(`Logged in as ${countryCode}${phone}`);
    window.location.href = "index.html"; // Redirect to homepage
}
// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeSwitch');
const body = document.body;

// Check for saved preference
if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

// Toggle Dark Mode
darkModeToggle.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
});
// Sample product data
const products = [
    {
        id: 1,
        name: "Vonocab Tablet",
        strength: "Vonoopatano 11 mg",
        description: "For hypertension management",
        price: 120,
        category: "Cardiac"
    },
    {
        id: 2,
        name: "Emijoy DS Tablet",
        strength: "Chlorobasepoxide 10 mg + Antirefructose Hydrochloride 25 mg",
        description: "For anxiety disorders",
        price: 85,
        category: "Neuro"
    },
    {
        id: 3,
        name:"napa",
        strength:"paracetamol 500"
    },
    // Add more products as needed
];

// Google Sign-In
function handleCredentialResponse(response) {
    const userProfile = document.getElementById('user-profile');
    const googleButton = document.getElementById('google-login');
    
    // Decode JWT token to get user info
    const userData = JSON.parse(atob(response.credential.split('.')[1]));
    
    userProfile.innerHTML = `<i class="fas fa-user-circle"></i> ${userData.given_name}`;
    googleButton.classList.add('hidden');
    userProfile.classList.remove('hidden');
    
    // Save user to localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
}

// Load featured products
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <i class="fas fa-pills"></i>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-strength">${product.strength}</p>
                <p>${product.description}</p>
                <p class="product-price">৳${product.price}</p>
                <div class="product-actions">
                    <button class="btn-add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(productCard);
    });
}

// Initialize Google Sign-In
function initGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: "325358401473-0aqdasknj55pinpqc31u2bl6prrpau8n.apps.googleusercontent.com",
        callback: handleCredentialResponse
    });
    
    google.accounts.id.renderButton(
        document.getElementById("google-login"),
        { theme: "outline", size: "large" }
    );
}

// Check if user is already logged in
function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        document.getElementById('user-profile').innerHTML = `<i class="fas fa-user-circle"></i> ${user.given_name}`;
        document.getElementById('google-login').classList.add('hidden');
        document.getElementById('user-profile').classList.remove('hidden');
    }
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
    checkAuthState();
    
    // Initialize Google Sign-In if not already loaded
    if (typeof google !== 'undefined') {
        initGoogleSignIn();
    } else {
        window.onGoogleLoad = initGoogleSignIn;
    }
});