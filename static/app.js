// Default fallback products if API is offline and localStorage is empty
const defaultProducts = [
  {
    "id": 1,
    "title": "كرت شاشة NVIDIA GeForce RTX 4080 Super",
    "category": "جديد",
    "price": 1050,
    "stock": 4,
    "description": "<b>كرت الشاشة الخارق للألعاب والبث المباشر</b><br>ذاكرة 16GB GDDR6X. يدعم تقنية تتبع الأشعة Ray Tracing و DLSS 3.0. تبريد احترافي ثلاثي المراوح للحفاظ على استقرار الأداء تحت الضغط العالي.",
    "image": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop&q=80"
  },
  {
    "id": 2,
    "title": "معالج Intel Core i9-14900K",
    "category": "جديد",
    "price": 530,
    "stock": 6,
    "description": "<b>أقوى معالجات الجيل الرابع عشر من إنتل</b><br>24 نواة و 32 مسار سرعة تصل حتى 6.0 GHz. مثالي للألعاب الثقيلة وصناعة المحتوى ورندرة الفيديو ثلاثي الأبعاد.",
    "image": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80"
  },
  {
    "id": 3,
    "title": "لوحة أم ASUS ROG Strix Z790-E Gaming WiFi",
    "category": "مستعمل",
    "stock": 2,
    "description": "<b>لوحة أم احترافية كسر السرعة - حالة ممتازة شبه جديدة</b><br>دعم ذواكر DDR5 ومنفذ PCIe 5.0. واي فاي 6E مدمج، مع تبريد متكامل للمنافذ والـ M.2. الملحقات كاملة والكرتون الأصلي متوفر.",
    "price": 240,
    "image": "https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop&q=80"
  },
  {
    "id": 4,
    "title": "ذاكرة عشوائية G.Skill Trident Z5 RGB DDR5 32GB",
    "category": "جديد",
    "price": 125,
    "stock": 10,
    "description": "<b>ذواكر DDR5 فائقة السرعة مع إضاءة RGB خلابة</b><br>سعة 32 جيجابايت (قطعتين كل منها 16 جيجابايت) بتردد 6000MHz. تدعم ملف كسر السرعة Intel XMP 3.0 لأداء ألعاب فائق الاستقرار.",
    "image": "https://images.unsplash.com/photo-1562976540-07fdd1094399?w=600&auto=format&fit=crop&q=80"
  },
  {
    "id": 5,
    "title": "مزود طاقة Corsair RM850x 850W Gold",
    "category": "مستعمل",
    "stock": 3,
    "description": "<b>باور سبلاي Corsair RM850x شهادة ذهبية - مستعمل 3 أشهر فقط</b><br>قدرة 850 واط، كابلات قابلة للفصل بالكامل (Full Modular). هادئ تماماً وحالة نظيفة جداً وخالي من أي عيوب تشغيلية.",
    "price": 85,
    "image": "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=600&auto=format&fit=crop&q=80"
  },
  {
    "id": 6,
    "title": "كيبورد ألعاب ميكانيكي وماوس احترافي Razer",
    "category": "مستعمل",
    "stock": 1,
    "description": "<b>باقة Razer للاعبين المحترفين - كيبورد أسود ميكانيكي وماوس DeathAdder</b><br>إضاءة Chroma RGB بالكامل. كلاهما بحالة ممتازة مستعمل لفترة قصيرة جداً ومضمون النظافة والأداء السريع.",
    "price": 110,
    "image": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80"
  }
];

let products = [];
let settings = {
    storeName: "Game Zone Store",
    currency: "USD",
    enableCod: true,
    enableBank: true,
    enableCard: true,
    bankName: "مصرف الراجحي",
    bankHolder: "مؤسسة منطقة الألعاب التجارية",
    bankIban: "SA9380000123456789012345",
    logo: "",
    adminPassword: "admin"
};
let cart = [];
let selectedCategory = "all";
let selectedPaymentMethod = "cod";
let uploadedReceiptBase64 = null;
let activeCurrency = "USD"; // USD or SAR
let discountRate = 0; // percentage
let activePromoCode = "";

// Hybrid API and LocalStorage helper functions
async function apiGet(endpoint, fallbackKey, defaultVal) {
    try {
        const response = await fetch(endpoint);
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem(fallbackKey, JSON.stringify(data));
            return data;
        }
    } catch (e) {
        console.warn(`API GET ${endpoint} failed, falling back to LocalStorage.`);
    }
    const localData = localStorage.getItem(fallbackKey);
    if (localData) {
        try { return JSON.parse(localData); } catch (e) {}
    }
    localStorage.setItem(fallbackKey, JSON.stringify(defaultVal));
    return defaultVal;
}

async function apiPost(endpoint, fallbackKey, data) {
    localStorage.setItem(fallbackKey, JSON.stringify(data));
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            return { success: true };
        }
    } catch (e) {
        console.warn(`API POST ${endpoint} failed, saved to LocalStorage only.`);
    }
    return { success: true, localOnly: true };
}

// Initialize Page
window.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
    fetchSettings().then(() => {
        fetchProducts();
    });
});

// Fetch Store Settings
async function fetchSettings() {
    settings = await apiGet('/api/settings', 'local_settings', settings);
    activeCurrency = settings.currency || "USD";
    applySettingsUI();
}

// Apply settings to UI
function applySettingsUI() {
    // Logo text or image logo if uploaded
    const navLogo = document.getElementById('nav-logo');
    if (navLogo) {
        const storeNameWords = settings.storeName.split(' ');
        const firstWord = storeNameWords[0] || "Game";
        const restWords = storeNameWords.slice(1).join(' ') || "Zone Store";
        
        if (settings.logo) {
            navLogo.innerHTML = `
                <img src="${settings.logo}" alt="${settings.storeName}" style="max-height: 65px; height: 65px; width: auto; object-fit: contain; border-radius: 6px; margin-left: 10px;">
                <span class="logo-text" id="store-title-logo">${firstWord}<span> ${restWords}</span></span>
            `;
        } else {
            navLogo.innerHTML = `
                <i class="fa-solid fa-gamepad logo-icon"></i>
                <span class="logo-text" id="store-title-logo">${firstWord}<span> ${restWords}</span></span>
            `;
        }
    }
    
    // Main Title
    const heroTitle = document.getElementById('hero-store-title');
    if (heroTitle) heroTitle.innerText = settings.storeName;

    // Footer Logo
    const footerLogoName = document.getElementById('footer-store-name');
    if (footerLogoName) {
        const storeNameWords = settings.storeName.split(' ');
        const firstWord = storeNameWords[0] || "Game";
        const restWords = storeNameWords.slice(1).join(' ') || "Zone Store";

        if (settings.logo) {
            footerLogoName.innerHTML = `
                <img src="${settings.logo}" alt="${settings.storeName}" style="max-height: 45px; height: 45px; width: auto; object-fit: contain; vertical-align: middle; margin-left: 10px; border-radius: 4px;">
                <span>${firstWord}<span> ${restWords}</span></span>
            `;
        } else {
            footerLogoName.innerHTML = `${firstWord}<span> ${restWords}</span>`;
        }
    }

    // Update bank details display
    const bName = document.getElementById('bank-name-display');
    const bHolder = document.getElementById('bank-holder-display');
    const bIban = document.getElementById('bank-iban-display');
    if (bName) bName.innerText = settings.bankName;
    if (bHolder) bHolder.innerText = settings.bankHolder;
    if (bIban) bIban.innerText = settings.bankIban;

    // Update payment tabs visibility
    const tabCod = document.getElementById('tab-btn-cod');
    const tabBank = document.getElementById('tab-btn-bank');
    const tabCard = document.getElementById('tab-btn-card');

    if (tabCod) tabCod.style.display = settings.enableCod ? 'flex' : 'none';
    if (tabBank) tabBank.style.display = settings.enableBank ? 'flex' : 'none';
    if (tabCard) tabCard.style.display = settings.enableCard ? 'flex' : 'none';

    // Update currency switcher buttons active class
    const usdBtn = document.getElementById('cur-btn-usd');
    const sarBtn = document.getElementById('cur-btn-sar');
    if (usdBtn && sarBtn) {
        if (activeCurrency === 'USD') {
            usdBtn.classList.add('active');
            sarBtn.classList.remove('active');
        } else {
            sarBtn.classList.add('active');
            usdBtn.classList.remove('active');
        }
    }

    // Auto-select first available payment tab
    let defaultTab = 'cod';
    if (!settings.enableCod) {
        if (settings.enableBank) defaultTab = 'bank';
        else if (settings.enableCard) defaultTab = 'card';
    }
    switchPaymentTab(defaultTab);
    updateCartUI();
}

// Change storefront active currency toggle
function changeStoreCurrency(currency) {
    activeCurrency = currency;
    
    // Manage switcher button states
    const usdBtn = document.getElementById('cur-btn-usd');
    const sarBtn = document.getElementById('cur-btn-sar');
    
    if (usdBtn && sarBtn) {
        if (currency === 'USD') {
            usdBtn.classList.add('active');
            sarBtn.classList.remove('active');
        } else {
            sarBtn.classList.add('active');
            usdBtn.classList.remove('active');
        }
    }

    renderProducts();
    updateCartUI();
}

// Fetch Products from API
async function fetchProducts() {
    products = await apiGet('/api/products', 'local_products', defaultProducts);
    renderProducts();
}

// Render Products Grid
function renderProducts() {
    const gridContainer = document.getElementById('products-grid-container');
    const searchInput = document.getElementById('search-input');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (query) {
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(query) || 
            (p.description && p.description.toLowerCase().includes(query)) ||
            p.category.toLowerCase().includes(query)
        );
    }

    if (filtered.length === 0) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
                <i class="fa-solid fa-gamepad" style="font-size: 3rem; margin-bottom: 1rem; opacity:0.1;"></i>
                <p>لا توجد قطع تطابق بحثك حالياً.</p>
            </div>
        `;
        return;
    }

    gridContainer.innerHTML = filtered.map(product => {
        const displayPrice = activeCurrency === 'SAR' ? Math.round(product.price * 3.75) : product.price;
        const currencySymbol = activeCurrency === 'SAR' ? 'ر.س' : '$';
        const categoryClass = product.category === 'مستعمل' ? 'used-badge' : '';

        // Stock labels and visual status
        let stockHtml = '';
        let addBtnDisabled = '';
        const currentInCart = getProductQuantityInCart(product.id);
        const availableStock = (product.stock ?? 5) - currentInCart;

        if ((product.stock ?? 5) <= 0) {
            stockHtml = `<span style="font-size: 0.75rem; color: #ef4444; font-weight: 700; display: block; margin-top: 4px;"><i class="fa-solid fa-triangle-exclamation"></i> نفذت الكمية</span>`;
            addBtnDisabled = 'disabled style="opacity: 0.5; border-color: #ef4444; color: #ef4444;"';
        } else if (availableStock <= 0) {
            stockHtml = `<span style="font-size: 0.75rem; color: #f59e0b; font-weight: 700; display: block; margin-top: 4px;"><i class="fa-solid fa-cart-shopping"></i> أقصى كمية في السلة</span>`;
            addBtnDisabled = 'disabled style="opacity: 0.5; border-color: #f59e0b; color: #f59e0b;"';
        } else if ((product.stock ?? 5) <= 2) {
            stockHtml = `<span style="font-size: 0.75rem; color: #ef4444; font-weight: 700; display: block; margin-top: 4px;"><i class="fa-solid fa-fire"></i> متبقي قطعتين فقط!</span>`;
        } else {
            stockHtml = `<span style="font-size: 0.75rem; color: #10b981; font-weight: 700; display: block; margin-top: 4px;"><i class="fa-solid fa-circle-check"></i> متوفر: ${product.stock} قطع</span>`;
        }

        return `
            <div class="product-card">
                <span class="product-category ${categoryClass}">${product.category}</span>
                <div class="product-img-container">
                    <img src="${product.image || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=80'}" alt="${product.title}" class="product-img" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-description">${product.description || ''}</div>
                    ${stockHtml}
                    <div class="product-footer">
                        <div class="product-price">
                            ${displayPrice.toLocaleString()} <span>${currencySymbol}</span>
                        </div>
                        <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${addBtnDisabled} title="إضافة للحقيبة">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Get helper for product quantities inside current cart
function getProductQuantityInCart(productId) {
    const item = cart.find(x => x.product.id === productId);
    return item ? item.quantity : 0;
}

// Category selection
function selectCategory(category, btnElement) {
    selectedCategory = category;
    
    // Manage active class
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    renderProducts();
}

// Filter product list on typing
function filterProducts() {
    renderProducts();
}

// Toggle Cart Drawer
function toggleCart(isOpen) {
    const overlay = document.getElementById('cart-drawer-overlay');
    if (isOpen) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    } else {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Local Storage Cart Helpers
function saveCartToLocalStorage() {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const saved = localStorage.getItem('ecommerce_cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
}

// Add Item to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const maxStock = product.stock ?? 5;
    const currentInCart = getProductQuantityInCart(productId);

    if (currentInCart >= maxStock) {
        alert("عذراً، لا يمكن إضافة المزيد. لقد استنفدت الكمية المتوفرة في المخزن لهذا المنتج.");
        return;
    }

    const existingIndex = cart.findIndex(item => item.product.id === productId);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ product, quantity: 1 });
    }

    saveCartToLocalStorage();
    updateCartUI();
    renderProducts(); // Refresh buttons/labels in grid

    // Visual badge bounce
    const badge = document.getElementById('cart-count');
    badge.style.transform = 'scale(1.3)';
    setTimeout(() => {
        badge.style.transform = 'scale(1)';
    }, 200);

    // Auto open cart
    toggleCart(true);
}

// Change Quantity
function changeQuantity(productId, delta) {
    const index = cart.findIndex(item => item.product.id === productId);
    if (index === -1) return;

    const product = products.find(p => p.id === productId);
    const maxStock = product ? (product.stock ?? 5) : 99;

    if (delta > 0 && cart[index].quantity >= maxStock) {
        alert("عذراً، تم الوصول للحد الأقصى للكمية المتوفرة في المخزن.");
        return;
    }

    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCartToLocalStorage();
    updateCartUI();
    renderProducts(); // Refresh labels
}

// Remove item completely
function removeFromCart(productId) {
    cart = cart.filter(item => item.product.id !== productId);
    saveCartToLocalStorage();
    updateCartUI();
    renderProducts();
}

// Get Cart Subtotal in base USD
function getCartTotalUSD() {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
}

// Get final total in USD after coupon discount
function getFinalCartTotalUSD() {
    const subtotal = getCartTotalUSD();
    const discount = Math.round(subtotal * discountRate);
    return Math.max(0, subtotal - discount);
}

// Apply Discount Coupons
function applyPromoCode() {
    const input = document.getElementById('cart-promo-input');
    const code = input.value.trim().toUpperCase();

    if (!code) {
        alert("يرجى إدخال رمز الكوبون أولاً.");
        return;
    }

    if (code === 'GAME20') {
        discountRate = 0.20; // 20% off
        activePromoCode = 'GAME20';
        alert("نجاح! تم تطبيق كوبون الخصم بنجاح (خصم 20%).");
    } else if (code === 'START10') {
        discountRate = 0.10; // 10% off
        activePromoCode = 'START10';
        alert("نجاح! تم تطبيق كوبون الخصم بنجاح (خصم 10%).");
    } else {
        alert("كوبون غير صالح أو منتهي الصلاحية.");
        discountRate = 0;
        activePromoCode = "";
    }

    updateCartUI();
}

// Update Cart Badge and Drawer List HTML
function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = totalCount;

    const itemsContainer = document.getElementById('cart-items-container');
    const totalVal = document.getElementById('cart-total-value');
    const checkoutBtn = document.getElementById('cart-checkout-btn');

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fa-solid fa-gamepad"></i>
                <p>عربتك فارغة من العتاد حالياً</p>
            </div>
        `;
        totalVal.innerText = activeCurrency === 'SAR' ? `0 ر.س` : `0 $`;
        checkoutBtn.disabled = true;
        document.getElementById('cart-discount-row').style.display = 'none';
        return;
    }

    checkoutBtn.disabled = false;
    
    const subtotalUSD = getCartTotalUSD();
    const discountUSD = Math.round(subtotalUSD * discountRate);
    const finalTotalUSD = Math.max(0, subtotalUSD - discountUSD);

    // Apply currency conversions
    const displayTotal = activeCurrency === 'SAR' ? Math.round(finalTotalUSD * 3.75) : finalTotalUSD;
    const displayDiscount = activeCurrency === 'SAR' ? Math.round(discountUSD * 3.75) : discountUSD;
    const currencySymbol = activeCurrency === 'SAR' ? 'ر.س' : '$';
    
    // Manage Coupon Display row
    const discountRow = document.getElementById('cart-discount-row');
    const discountPctLabel = document.getElementById('discount-pct-label');
    const discountValLabel = document.getElementById('cart-discount-value');

    if (discountRate > 0) {
        discountPctLabel.innerText = Math.round(discountRate * 100);
        discountValLabel.innerText = `-${displayDiscount.toLocaleString()} ${currencySymbol}`;
        discountRow.style.display = 'flex';
    } else {
        discountRow.style.display = 'none';
    }

    totalVal.innerText = `${displayTotal.toLocaleString()} ${currencySymbol}`;

    itemsContainer.innerHTML = cart.map(item => {
        const itemPrice = activeCurrency === 'SAR' ? Math.round(item.product.price * 3.75) : item.product.price;
        
        return `
            <div class="cart-item">
                <img src="${item.product.image || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&auto=format&fit=crop&q=80'}" alt="${item.product.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.product.title}</div>
                    <div class="cart-item-price">${itemPrice.toLocaleString()} ${currencySymbol}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="changeQuantity(${item.product.id}, -1)">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.product.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart(${item.product.id})" title="حذف المنتج">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
    }).join('');
}

// Checkout Modal actions
function openCheckoutModal() {
    toggleCart(false);
    const modal = document.getElementById('checkout-modal-overlay');
    
    const finalTotalUSD = getFinalCartTotalUSD();
    const displayTotal = activeCurrency === 'SAR' ? Math.round(finalTotalUSD * 3.75) : finalTotalUSD;
    const currencySymbol = activeCurrency === 'SAR' ? 'ر.س' : '$';
    
    document.getElementById('checkout-total-price').innerText = `${displayTotal.toLocaleString()} ${currencySymbol}`;
    
    // Show form, hide success
    document.getElementById('checkout-form-body').style.display = 'block';
    document.getElementById('checkout-success-body').style.display = 'none';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal-overlay');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Switch payment panel tabs
function switchPaymentTab(method) {
    selectedPaymentMethod = method;

    // Reset tabs active state
    const tabs = document.querySelectorAll('.payment-tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    const activeTab = document.getElementById(`tab-btn-${method}`);
    if (activeTab) activeTab.classList.add('active');

    // Reset panels active state
    const panels = document.querySelectorAll('.payment-panel');
    panels.forEach(panel => panel.classList.remove('active'));

    const activePanel = document.getElementById(`panel-${method}`);
    if (activePanel) activePanel.classList.add('active');
}

// Clipboard IBAN copy helper
function copyIban() {
    const ibanText = settings.bankIban;
    navigator.clipboard.writeText(ibanText).then(() => {
        alert("تم نسخ رقم الآيبان بنجاح!");
    }).catch(err => {
        console.error("Failed to copy IBAN:", err);
    });
}

// Bank Receipt upload simulator
function simulateReceiptUpload() {
    document.getElementById('bank-receipt-file').click();
}

function handleReceiptUploaded(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedReceiptBase64 = e.target.result;
        document.getElementById('receipt-upload-preview').style.display = 'flex';
    };
    reader.readAsDataURL(file);
}

// Remove Receipt file preview
function removeReceipt() {
    document.getElementById('bank-receipt-file').value = '';
    uploadedReceiptBase64 = null;
    document.getElementById('receipt-upload-preview').style.display = 'none';
}

// 3D Credit Card interactive animations & transformations
function flipCreditCard() {
    const card3d = document.getElementById('credit-card-3d');
    if (card3d) card3d.classList.toggle('flipped');
}

// Flip card explicitly
function setCardFlip(shouldFlip) {
    const card3d = document.getElementById('credit-card-3d');
    if (!card3d) return;
    if (shouldFlip) {
        card3d.classList.add('flipped');
    } else {
        card3d.classList.remove('flipped');
    }
}

// Card input format & update display
function updateCardDetails() {
    const inputNumber = document.getElementById('card-number');
    const inputHolder = document.getElementById('card-holder');
    const inputExpiry = document.getElementById('card-expiry');
    const inputCvv = document.getElementById('card-cvv');

    const dispNumber = document.getElementById('v-card-number');
    const dispHolder = document.getElementById('v-card-holder');
    const dispExpiry = document.getElementById('v-card-expiry');
    const dispCvv = document.getElementById('v-card-cvv');

    // 1. Format Card Number
    let cardNum = inputNumber.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedNum = "";
    for (let i = 0; i < cardNum.length; i++) {
        if (i > 0 && i % 4 === 0) formattedNum += " ";
        formattedNum += cardNum[i];
    }
    inputNumber.value = formattedNum;
    dispNumber.innerText = formattedNum || "•••• •••• •••• ••••";

    // 2. Format Card Holder Name (upper-case English)
    let holderName = inputHolder.value.toUpperCase().replace(/[^a-zA-Z\s.-]/g, '');
    inputHolder.value = holderName;
    dispHolder.innerText = holderName || "CARDHOLDER NAME";

    // 3. Format Expiry MM/YY
    let expiry = inputExpiry.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (expiry.length >= 2) {
        inputExpiry.value = expiry.slice(0,2) + '/' + expiry.slice(2,4);
    } else {
        inputExpiry.value = expiry;
    }
    dispExpiry.innerText = inputExpiry.value || "MM/YY";

    // 4. CVV Format
    let cvv = inputCvv.value.replace(/[^0-9]/g, '');
    inputCvv.value = cvv;
    dispCvv.innerText = cvv ? cvv : "•••";
}

// Submit Order API call
async function submitOrder(event) {
    event.preventDefault();

    if (cart.length === 0) return;

    // Additional stock verification right before checkout
    for (let item of cart) {
        const product = products.find(p => p.id === item.product.id);
        const maxStock = product ? (product.stock ?? 5) : 0;
        if (item.quantity > maxStock) {
            alert(`عذراً، الكمية المطلوبة للمنتج (${item.product.title}) تفوق المخزون المتاح حالياً (${maxStock} قطع). يرجى تعديل السلة.`);
            return;
        }
    }

    const name = document.getElementById('checkout-name').value;
    const phone = document.getElementById('checkout-phone').value;
    const city = document.getElementById('checkout-city').value;
    const address = document.getElementById('checkout-address').value;

    let paymentDetails = {};

    if (selectedPaymentMethod === 'bank') {
        paymentDetails = {
            hasReceipt: uploadedReceiptBase64 ? true : false,
            receiptImage: uploadedReceiptBase64
        };
    } else if (selectedPaymentMethod === 'card') {
        const cardNum = document.getElementById('card-number').value.replace(/\s+/g, '');
        if (cardNum.length < 15) {
            alert("يرجى إدخال رقم بطاقة صالح.");
            return;
        }
        const expiry = document.getElementById('card-expiry').value;
        if (expiry.length < 5) {
            alert("يرجى إدخال تاريخ انتهاء صالح.");
            return;
        }
        const cvv = document.getElementById('card-cvv').value;
        if (cvv.length < 3) {
            alert("يرجى إدخال رمز الأمان CVV.");
            return;
        }

        paymentDetails = {
            cardSuffix: cardNum.slice(-4),
            holderName: document.getElementById('card-holder').value
        };
    }

    const finalTotalUSD = getFinalCartTotalUSD();
    const displayTotal = activeCurrency === 'SAR' ? Math.round(finalTotalUSD * 3.75) : finalTotalUSD;

    const orderId = Math.floor(100000 + Math.random() * 900000);
    const orderData = {
        id: orderId,
        customerName: name,
        customerPhone: phone,
        customerCity: city,
        customerAddress: address,
        items: cart.map(item => {
            const itemPrice = activeCurrency === 'SAR' ? Math.round(item.product.price * 3.75) : item.product.price;
            return {
                id: item.product.id,
                title: item.product.title,
                price: itemPrice,
                quantity: item.quantity
            };
        }),
        totalPrice: displayTotal,
        currency: activeCurrency, // Record purchase currency!
        paymentMethod: selectedPaymentMethod,
        paymentDetails: paymentDetails,
        status: "pending",
        date: new Date().toISOString()
    };

    const submitBtn = document.getElementById('submit-order-btn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال الطلب...`;

    try {
        const response = await apiPost('/api/orders', 'local_orders', orderData);

        if (response.success) {
            // Success: decrement stock locally and persist on database
            products.forEach(prod => {
                const cartItem = cart.find(item => item.product.id === prod.id);
                if (cartItem) {
                    prod.stock = Math.max(0, (prod.stock ?? 5) - cartItem.quantity);
                }
            });

            // Post updated products list to save new stock levels
            await apiPost('/api/products', 'local_products', products);

            // Fetch latest local orders array to update localStorage local_orders
            let localOrders = [];
            try {
                localOrders = JSON.parse(localStorage.getItem('local_orders')) || [];
                // If it isn't an array yet (e.g. first order saved as object in response.success fallback)
                if (!Array.isArray(localOrders)) {
                    localOrders = [localOrders];
                }
            } catch (e) {
                localOrders = [];
            }
            
            // Check if orderData is already in localOrders, if not append it
            if (!localOrders.some(o => o.id === orderData.id)) {
                localOrders.push(orderData);
                localStorage.setItem('local_orders', JSON.stringify(localOrders));
            }

            cart = [];
            discountRate = 0;
            activePromoCode = "";
            saveCartToLocalStorage();
            updateCartUI();
            renderProducts(); // Refresh stock displays

            // Clear checkout form
            document.getElementById('checkout-form').reset();
            removeReceipt();
            document.getElementById('v-card-number').innerText = "•••• •••• •••• ••••";
            document.getElementById('v-card-holder').innerText = "CARDHOLDER NAME";
            document.getElementById('v-card-expiry').innerText = "MM/YY";
            document.getElementById('v-card-cvv').innerText = "•••";

            document.getElementById('success-order-id').innerText = `#${orderId}`;
            
            // Switch views
            document.getElementById('checkout-form-body').style.display = 'none';
            document.getElementById('checkout-success-body').style.display = 'block';
        } else {
            alert("عذراً، فشل إرسال الطلب. يرجى المحاولة مجدداً.");
        }
    } catch (e) {
        console.error("Order submit failed:", e);
        alert("حدث خطأ غير متوقع أثناء إرسال الطلب.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> تأكيد الطلب والدفع`;
    }
}
