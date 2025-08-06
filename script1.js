
// Enhanced Bundle Builder with Advanced Features
// Enhanced Bundle Builder with Advanced Features
class MarmetoesBundleBuilder {
constructor() {
this.currencySymbol = "$";
this.maxBundleSize = 3;
this.discountRate = 0.3;
this.selectedItems = [];

this.products = [
{ id: 1, name: "White pant", price: 1200, img: "assets/product-1.jpg" },
{ id: 2, name: "Tie-Dye Lounge Set", price: 1000, img: "assets/product-2.jpg" },
{ id: 3, name: "sun burst track suit", price: 1500, img: "assets/product-3.jpg" },
{ id: 4, name: "urban sportwear combo", price: 1300, img: "assets/product-4.jpg" },
{ id: 5, name: "over sized knit & coat", price: 1100, img: "assets/product-5.jpg" },
{ id: 6, name: "chic monchrome blazer", price: 1050, img: "assets/product-6.jpg" }
];

this.init();
}

init() {
this.renderProducts();
this.updateSidebar();
this.setupEventListeners();
this.startAnimations();
}

formatCurrency(amount) {
return `${this.currencySymbol}${amount.toLocaleString()}`;
}

renderProducts() {
const grid = document.getElementById('productGrid');
grid.innerHTML = '';

this.products.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <img src="${product.img}" alt="${product.name}" class="product-image" loading="lazy">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">${this.formatCurrency(product.price)}</div>
            <button class="add-btn" data-product-id="${product.id}">
                <i class="fas fa-plus"></i> Add to Bundle
            </button>
        </div>
    `;

    grid.appendChild(card);
});
}

setupEventListeners() {
// Product add buttons
document.addEventListener('click', (e) => {
    if (e.target.matches('.add-btn') || e.target.closest('.add-btn')) {
        const btn = e.target.closest('.add-btn') || e.target;
        const productId = parseInt(btn.dataset.productId);
        this.addToBundle(productId);
    }
});

// Checkout button
document.getElementById('checkoutBtn').addEventListener('click', () => {
    this.showCheckoutModal();
});

// Quantity and remove buttons (delegated)
document.addEventListener('click', (e) => {
    if (e.target.matches('.qty-btn[data-action="increase"]')) {
        const productId = parseInt(e.target.dataset.productId);
        this.updateQuantity(productId, 1);
    } else if (e.target.matches('.qty-btn[data-action="decrease"]')) {
        const productId = parseInt(e.target.dataset.productId);
        this.updateQuantity(productId, -1);
    } else if (e.target.matches('.remove-btn')) {
        const productId = parseInt(e.target.dataset.productId);
        this.removeFromBundle(productId);
    }
});

// Modal close functionality
document.addEventListener('click', (e) => {
    if (e.target.matches('.modal-close') || e.target.matches('.modal-overlay')) {
        this.closeModal();
    }
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        this.closeModal();
    }
});
}

addToBundle(productId) {
const product = this.products.find(p => p.id === productId);
const existingItem = this.selectedItems.find(item => item.id === productId);

if (existingItem) {
    existingItem.quantity++;
    this.showNotification(`Updated ${product.name} quantity`, 'success');
} else if (this.selectedItems.length < this.maxBundleSize) {
    this.selectedItems.push({ ...product, quantity: 1 });
    this.showNotification(`${product.name} added to bundle!`, 'success');
} else {
    this.showNotification('Bundle is full! Remove an item to add new ones.', 'warning');
    return;
}

this.updateSidebar();
this.updateProductButtons();
}

removeFromBundle(productId) {
const index = this.selectedItems.findIndex(item => item.id === productId);
if (index > -1) {
    const removedItem = this.selectedItems[index];
    this.selectedItems.splice(index, 1);
    this.showNotification(`${removedItem.name} removed from bundle`, 'info');
    this.updateSidebar();
    this.updateProductButtons();
}
}

updateQuantity(productId, change) {
const item = this.selectedItems.find(item => item.id === productId);
if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
        this.removeFromBundle(productId);
    } else {
        this.updateSidebar();
    }
}
}

updateSidebar() {
this.renderBundleList();
this.updateProgress();
this.updateSummary();
this.updateCheckoutButton();
}

renderBundleList() {
const bundleList = document.getElementById('bundleList');

if (this.selectedItems.length === 0) {
    bundleList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-shopping-basket"></i>
            <h3>Start Building Your Bundle</h3>
            <p>Add ${this.maxBundleSize} items to unlock ${Math.round(this.discountRate * 100)}% discount</p>
        </div>
    `;
    return;
}

bundleList.innerHTML = this.selectedItems.map(item => `
    <div class="bundle-item">
        <img src="${item.img}" alt="${item.name}" class="bundle-item-image">
        <div class="bundle-item-details">
            <div class="bundle-item-name">${item.name}</div>
            <div class="bundle-item-price">${this.formatCurrency(item.price)} each</div>
            <div class="bundle-item-controls">
                <div class="quantity-controls">
                    <button class="qty-btn" data-action="decrease" data-product-id="${item.id}">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="qty-btn" data-action="increase" data-product-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-product-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    </div>
`).join('');
}

updateProgress() {
const totalItems = this.selectedItems.reduce((sum, item) => sum + item.quantity, 0);
const progress = Math.min((totalItems / this.maxBundleSize) * 100, 100);

document.getElementById('progressBar').style.width = `${progress}%`;
document.getElementById('progressText').textContent = `${totalItems}/${this.maxBundleSize} items`;
}

updateSummary() {
const originalPrice = this.selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const hasDiscount = this.selectedItems.length >= this.maxBundleSize;
const discountAmount = hasDiscount ? originalPrice * this.discountRate : 0;
const finalTotal = originalPrice - discountAmount;

document.getElementById('originalPrice').textContent = this.formatCurrency(originalPrice);
document.getElementById('discountAmount').textContent = `-${this.formatCurrency(discountAmount)}`;
document.getElementById('finalTotal').textContent = this.formatCurrency(finalTotal);
}

updateCheckoutButton() {
const checkoutBtn = document.getElementById('checkoutBtn');
const hasItems = this.selectedItems.length > 0;

checkoutBtn.disabled = !hasItems;
checkoutBtn.innerHTML = hasItems 
    ? `<i class="fas fa-shopping-cart"></i> Add Bundle to Cart (${this.selectedItems.length} items)`
    : `<i class="fas fa-shopping-cart"></i> Add Bundle to Cart`;
}

updateProductButtons() {
this.products.forEach(product => {
    const btn = document.querySelector(`[data-product-id="${product.id}"]`);
    const inBundle = this.selectedItems.find(item => item.id === product.id);
    
    if (btn) {
        if (inBundle) {
            btn.className = 'add-btn added';
            btn.innerHTML = '<i class="fas fa-check"></i> In Bundle';
        } else if (this.selectedItems.length >= this.maxBundleSize) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-lock"></i> Bundle Full';
        } else {
            btn.className = 'add-btn';
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-plus"></i> Add to Bundle';
        }
    }
});
}

showCheckoutModal() {
if (this.selectedItems.length === 0) return;

const originalPrice = this.selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
const hasDiscount = this.selectedItems.length >= this.maxBundleSize;
const discountAmount = hasDiscount ? originalPrice * this.discountRate : 0;
const finalTotal = originalPrice - discountAmount;

const modal = document.createElement('div');
modal.className = 'modal-overlay';
modal.innerHTML = `
    <div class="modal">
        <div class="modal-header">
            <h2 class="modal-title">
                <i class="fas fa-shopping-cart"></i> Bundle Summary
            </h2>
            <button class="modal-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div style="margin-bottom: 20px;">
                ${this.selectedItems.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 8px;">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>${this.formatCurrency(item.price * item.quantity)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="bundle-summary">
                <div class="summary-line">
                    <span>Subtotal:</span>
                    <span>${this.formatCurrency(originalPrice)}</span>
                </div>
                ${hasDiscount ? `
                    <div class="summary-line">
                        <span class="discount-text">Bundle Discount (${Math.round(this.discountRate * 100)}%):</span>
                        <span class="discount-text">-${this.formatCurrency(discountAmount)}</span>
                    </div>
                ` : ''}
                <div class="summary-line">
                    <span>Total:</span>
                    <span>${this.formatCurrency(finalTotal)}</span>
                </div>
            </div>
            
            <button class="checkout-btn" style="margin-top: 20px;" onclick="alert('Redirecting to checkout...'); bundleBuilder.closeModal();">
                <i class="fas fa-credit-card"></i> Proceed to Checkout
            </button>
        </div>
    </div>
`;

document.body.appendChild(modal);

// Prevent body scroll when modal is open
document.body.style.overflow = 'hidden';

// Focus management
setTimeout(() => {
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn?.focus();
}, 100);
}

closeModal() {
const modal = document.querySelector('.modal-overlay');
if (modal) {
    modal.remove();
    document.body.style.overflow = '';
}
}

showNotification(message, type = 'info') {
// Remove existing notifications
const existingNotification = document.querySelector('.notification');
if (existingNotification) {
    existingNotification.remove();
}

const notification = document.createElement('div');
notification.className = `notification notification-${type}`;
notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    font-weight: 600;
    max-width: 300px;
    animation: slideInRight 0.3s ease;
`;

notification.textContent = message;
document.body.appendChild(notification);

// Add CSS animation if not already present
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => notification.remove(), 300);
}, 3000);
}

startAnimations() {
// Animate progress bar on load
setTimeout(() => {
    this.updateProgress();
}, 500);

// Add stagger animation to product cards
const cards = document.querySelectorAll('.product-card');
cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, index * 100);
});
}
}

// Initialize the bundle builder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
window.bundleBuilder = new MarmetoesBundleBuilder();
});

// Additional utility functions
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

// Handle window resize for responsive behavior
window.addEventListener('resize', debounce(() => {
// Refresh layout if needed
if (window.bundleBuilder) {
window.bundleBuilder.updateSidebar();
}
}, 250));
