// ---------- WISHLIST MODAL ----------
// Wishlist data management
let wishlistItems = [];

// Load wishlist from localStorage
function loadWishlist() {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
        try {
            wishlistItems = JSON.parse(savedWishlist);
        } catch (e) {
            console.error('Error parsing wishlist data:', e);
            wishlistItems = [];
        }
    }
    return wishlistItems;
}

// Save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
}

// Add item to wishlist
function addToWishlist(item) {
    // Check if item already exists in wishlist
    if (!wishlistItems.some(wishlistItem => wishlistItem.id === item.id)) {
        wishlistItems.push(item);
        saveWishlist();
        showNotification('Added to Wishlist', `${item.name} has been added to your wishlist.`, 'success');
        updateWishlistUI();
        return true;
    } else {
        showNotification('Already in Wishlist', `${item.name} is already in your wishlist.`, 'info');
        return false;
    }
}

// Remove item from wishlist
function removeFromWishlist(itemId) {
    const index = wishlistItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
        const removedItem = wishlistItems[index];
        wishlistItems.splice(index, 1);
        saveWishlist();
        showNotification('Removed from Wishlist', `${removedItem.name} has been removed from your wishlist.`, 'success');
        updateWishlistUI();
        return true;
    }
    return false;
}

// Clear all items from wishlist
function clearWishlist() {
    if (wishlistItems.length === 0) return;
    
    wishlistItems = [];
    saveWishlist();
    showNotification('Wishlist Cleared', 'All items have been removed from your wishlist.', 'success');
    updateWishlistUI();
}

// Update wishlist UI elements
function updateWishlistUI() {
    // Update wishlist count badge if it exists
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlistItems.length;
        wishlistCount.style.display = wishlistItems.length > 0 ? 'flex' : 'none';
    }
    
    // Update wishlist modal content
    updateWishlistModal();
}

// Show notification
function showNotification(title, message, type = 'success') {
    // Check if notification container exists, create if not
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set notification content
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            </div>
            <div class="notification-message">
                <div class="notification-title">${title}</div>
                <div>${message}</div>
            </div>
            <button class="notification-close">&times;</button>
        </div>
        <div class="notification-progress">
            <div class="notification-progress-bar"></div>
        </div>
    `;
    
    // Add to container
    container.appendChild(notification);
    
    // Set up close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'fade-out 0.3s forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fade-out 0.3s forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Modal functions
function showWishlistModal() {
    loadWishlist(); // Ensure we have the latest data
    updateWishlistModal(); // Update the modal content
    
    const modal = document.getElementById('wishlist-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        
        // Add animation class
        setTimeout(() => {
            modal.classList.add('visible');
        }, 10);
    } else {
        console.error('Wishlist modal element not found');
    }
}

function hideWishlistModal() {
    const modal = document.getElementById('wishlist-modal');
    if (modal) {
        modal.classList.remove('visible');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }, 300);
    }
}

// Update wishlist modal content
function updateWishlistModal() {
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    const emptyWishlistMessage = document.getElementById('modal-empty-wishlist');
    
    if (!wishlistItemsContainer || !emptyWishlistMessage) return;
    
    // Clear current items
    wishlistItemsContainer.innerHTML = '';
    
    // Show empty message or items
    if (wishlistItems.length === 0) {
        wishlistItemsContainer.style.display = 'none';
        emptyWishlistMessage.style.display = 'block';
    } else {
        wishlistItemsContainer.style.display = 'grid';
        emptyWishlistMessage.style.display = 'none';
        
        // Add each item to the grid
        wishlistItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'wishlist-item';
            itemElement.innerHTML = `
                <div class="wishlist-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="wishlist-item-details">
                    <div class="wishlist-item-title">${item.name}</div>
                    <div class="wishlist-item-price">R${item.price.toLocaleString()}</div>
                    <div class="wishlist-item-actions">
                        <a href="${item.url}" class="wishlist-view-btn">View Product</a>
                        <button class="wishlist-remove-btn" data-id="${item.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
            wishlistItemsContainer.appendChild(itemElement);
            
            // Add event listener to remove button
            const removeBtn = itemElement.querySelector('.wishlist-remove-btn');
            if (removeBtn) {
                removeBtn.addEventListener('click', function() {
                    const itemId = this.getAttribute('data-id');
                    removeFromWishlist(itemId);
                });
            }
        });
    }
}

// Set up wishlist modal event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Load wishlist data
    loadWishlist();
    
    // Update UI with current wishlist data
    updateWishlistUI();
    
    // Wishlist link in header
    const wishlistLink = document.getElementById('wishlist-link');
    if (wishlistLink) {
        wishlistLink.addEventListener('click', function(e) {
            e.preventDefault();
            showWishlistModal();
        });
    }

    // Close modal button
    const closeModalBtn = document.getElementById('close-wishlist-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideWishlistModal);
    }

    // Close modal when clicking outside of it (on the overlay)
    const wishlistModal = document.getElementById('wishlist-modal');
    if (wishlistModal) {
        wishlistModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideWishlistModal();
            }
        });
    }

    // "View All" button in modal
    const viewAllBtn = document.querySelector('.view-all-btn');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function(e) {
            hideWishlistModal();
        });
    }
    
    // "Remove All" button in modal
    const clearWishlistBtn = document.getElementById('clear-wishlist-btn');
    if (clearWishlistBtn) {
        clearWishlistBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to remove all items from your wishlist?')) {
                clearWishlist();
            }
        });
    }
    
    // Add wishlist functionality to product cards if they exist
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            const productId = productCard.getAttribute('data-product-id');
            const productName = productCard.querySelector('.product-title')?.textContent || 'Product';
            const productPrice = productCard.querySelector('.product-price')?.getAttribute('data-price') || '0';
            const productImage = productCard.querySelector('.product-image img')?.src || '';
            const productUrl = productCard.querySelector('.product-title a')?.href || '#';
            
            const product = {
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                url: productUrl
            };
            
            if (this.classList.contains('in-wishlist')) {
                removeFromWishlist(productId);
                this.classList.remove('in-wishlist');
            } else {
                if (addToWishlist(product)) {
                    this.classList.add('in-wishlist');
                }
            }
        });
    });
});