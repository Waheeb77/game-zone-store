let products = [];
let orders = [];
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
    adminPassword: "admin",
    usdToSarRate: 3.75,
    usdToYerRate: 1600.0,
    enableBcash: true,
    enableQurooshi: true,
    enableKuraimi: true,
    bcashNumber: "770000000",
    qurooshiNumber: "771000000",
    kuraimiNumber: "3000000"
};
let uploadedProductImageBase64 = null;
let currentTab = 'overview';

// Hybrid API and LocalStorage helper functions for static page safety
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

// Admin Authentication functions
function checkAdminAuthentication() {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    const overlay = document.getElementById('admin-login-overlay');
    if (isAuth === 'true') {
        if (overlay) overlay.style.display = 'none';
    } else {
        if (overlay) overlay.style.display = 'flex';
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    const passwordField = document.getElementById('admin-pass-field');
    const errorMsg = document.getElementById('login-error-msg');
    const enteredPassword = passwordField.value;
    const correctPassword = settings.adminPassword || "admin";
    
    if (enteredPassword === correctPassword) {
        sessionStorage.setItem('admin_authenticated', 'true');
        checkAdminAuthentication();
        errorMsg.style.display = 'none';
    } else {
        errorMsg.style.display = 'block';
        passwordField.value = '';
        passwordField.focus();
    }
}

// Page Init
window.addEventListener('DOMContentLoaded', () => {
    // Check auth
    checkAdminAuthentication();
    
    // Hook up login form
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleAdminLogin);
    }

    // Set Current Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.innerText = new Date().toLocaleDateString('ar-SA', options);
    }

    // Initial API Calls
    fetchSettings().then(() => {
        fetchProducts().then(() => {
            fetchOrders();
        });
    });
});

// Update Sidebar Logo display dynamically
function updateSidebarLogo() {
    const brandContainer = document.querySelector('.admin-brand');
    if (brandContainer) {
        if (settings.logo) {
            brandContainer.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; justify-content: flex-start;">
                    <img src="${settings.logo}" alt="${settings.storeName}" style="max-height: 55px; height: 55px; width: auto; object-fit: contain; border-radius: 4px;">
                    <span style="font-family: var(--font-tajawal); font-weight: 800; font-size: 1.25rem; color: #fff;">Game<span style="color:var(--primary-color);">Zone</span></span>
                </div>
            `;
        } else {
            brandContainer.innerHTML = `
                <i class="fa-solid fa-gamepad" style="color: var(--primary-color); margin-left: 8px;"></i>
                <span>Game<span>Zone</span></span>
            `;
        }
    }
}

// Switch Sidebar Tabs
function switchAdminTab(tabName, element) {
    currentTab = tabName;

    // Manage menu active styling
    const links = document.querySelectorAll('.admin-menu-link');
    links.forEach(l => l.classList.remove('active'));
    element.classList.add('active');

    // Manage tab content panels visibility
    const panels = document.querySelectorAll('.admin-tab-content');
    panels.forEach(p => p.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // Update Header Titles
    const title = document.getElementById('admin-current-tab-title');
    const desc = document.getElementById('admin-current-tab-desc');
    
    if (tabName === 'overview') {
        title.innerText = "لوحة التحكم العامة";
        desc.innerText = "متابعة أداء المتجر، المبيعات وإدارة المنتجات والطلبات بشكل كامل.";
        fetchOrders();
    } else if (tabName === 'products') {
        title.innerText = "إدارة المنتجات";
        desc.innerText = "أضف، عدل أو احذف المنتجات المعروضة في المتجر للعملاء.";
        renderProductsTable();
    } else if (tabName === 'orders') {
        title.innerText = "الطلبات المستلمة";
        desc.innerText = "مراجعة وتأكيد طلبات الشراء، وتغيير حالتها أو تتبع بيانات العملاء ودفعاتهم.";
        renderOrdersTable();
    } else if (tabName === 'settings') {
        title.innerText = "إعدادات المتجر";
        desc.innerText = "تعديل هوية المتجر البصرية، الاسم، وتفعيل أو تعطيل خيارات الدفع والبيانات البنكية.";
        populateSettingsForm();
    }
}

// Fetch Settings from API
async function fetchSettings() {
    settings = await apiGet('/api/settings', 'local_settings', settings);
    updateSidebarLogo();
}

// Populate Settings Form
function populateSettingsForm() {
    document.getElementById('settings-store-name').value = settings.storeName || '';
    document.getElementById('settings-currency').value = settings.currency || '';
    document.getElementById('settings-enable-cod').checked = settings.enableCod ?? true;
    document.getElementById('settings-enable-bank').checked = settings.enableBank ?? true;
    document.getElementById('settings-enable-card').checked = settings.enableCard ?? true;
    document.getElementById('settings-bank-name').value = settings.bankName || '';
    document.getElementById('settings-bank-holder').value = settings.bankHolder || '';
    document.getElementById('settings-bank-iban').value = settings.bankIban || '';
    
    // Yemeni payments and rates
    document.getElementById('settings-enable-bcash').checked = settings.enableBcash ?? true;
    document.getElementById('settings-enable-qurooshi').checked = settings.enableQurooshi ?? true;
    document.getElementById('settings-enable-kuraimi').checked = settings.enableKuraimi ?? true;
    document.getElementById('settings-bcash-number').value = settings.bcashNumber || '';
    document.getElementById('settings-qurooshi-number').value = settings.qurooshiNumber || '';
    document.getElementById('settings-kuraimi-number').value = settings.kuraimiNumber || '';
    document.getElementById('settings-sar-rate').value = settings.usdToSarRate || 3.75;
    document.getElementById('settings-yer-rate').value = settings.usdToYerRate || 1600.0;
    document.getElementById('settings-admin-password').value = settings.adminPassword || 'admin';

    // Show/hide bank inputs
    toggleSettingsBankSection(settings.enableBank ?? true);
    toggleSettingsBcashSection(settings.enableBcash ?? true);
    toggleSettingsQurooshiSection(settings.enableQurooshi ?? true);
    toggleSettingsKuraimiSection(settings.enableKuraimi ?? true);

    // Render Logo preview
    const previewBox = document.getElementById('settings-logo-preview-box');
    if (settings.logo) {
        previewBox.innerHTML = `<img src="${settings.logo}" alt="Store Logo" style="width:100%; height:100%; object-fit:contain;">`;
    } else {
        previewBox.innerHTML = `<i class="fa-solid fa-gamepad"></i>`;
    }
}

// Show/Hide Bank Account fields based on toggle
function toggleSettingsBankSection(isChecked) {
    const card = document.getElementById('settings-bank-info-card');
    if (card) {
        if (isChecked) {
            card.style.display = 'block';
            document.getElementById('settings-bank-name').required = true;
            document.getElementById('settings-bank-holder').required = true;
            document.getElementById('settings-bank-iban').required = true;
        } else {
            card.style.display = 'none';
            document.getElementById('settings-bank-name').required = false;
            document.getElementById('settings-bank-holder').required = false;
            document.getElementById('settings-bank-iban').required = false;
        }
    }
}

function toggleSettingsBcashSection(isChecked) {
    const el = document.getElementById('settings-bcash-group');
    if (el) el.style.display = isChecked ? 'block' : 'none';
    const input = document.getElementById('settings-bcash-number');
    if (input) input.required = isChecked;
    updateYemeniDetailsCardVisibility();
}

function toggleSettingsQurooshiSection(isChecked) {
    const el = document.getElementById('settings-qurooshi-group');
    if (el) el.style.display = isChecked ? 'block' : 'none';
    const input = document.getElementById('settings-qurooshi-number');
    if (input) input.required = isChecked;
    updateYemeniDetailsCardVisibility();
}

function toggleSettingsKuraimiSection(isChecked) {
    const el = document.getElementById('settings-kuraimi-group');
    if (el) el.style.display = isChecked ? 'block' : 'none';
    const input = document.getElementById('settings-kuraimi-number');
    if (input) input.required = isChecked;
    updateYemeniDetailsCardVisibility();
}

function updateYemeniDetailsCardVisibility() {
    const card = document.getElementById('settings-yemeni-info-card');
    if (!card) return;
    const bcashChecked = document.getElementById('settings-enable-bcash') ? document.getElementById('settings-enable-bcash').checked : true;
    const qurooshiChecked = document.getElementById('settings-enable-qurooshi') ? document.getElementById('settings-enable-qurooshi').checked : true;
    const kuraimiChecked = document.getElementById('settings-enable-kuraimi') ? document.getElementById('settings-enable-kuraimi').checked : true;
    
    const anyEnabled = (bcashChecked || qurooshiChecked || kuraimiChecked);
    card.style.display = anyEnabled ? 'block' : 'none';
}

// Settings Logo Select Trigger
function triggerSettingsLogoSelect() {
    document.getElementById('settings-logo-input').click();
}

// Settings Logo uploader with canvas compression
function handleSettingsLogoUploaded(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Compress to maximum bounds of 250px for site logo
            const MAX_SIZE = 250;
            if (width > MAX_SIZE || height > MAX_SIZE) {
                if (width > height) {
                    height = Math.round((height * MAX_SIZE) / width);
                    width = MAX_SIZE;
                } else {
                    width = Math.round((width * MAX_SIZE) / height);
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedBase64 = canvas.toDataURL('image/png'); // Export as PNG to preserve transparencies
            settings.logo = compressedBase64;
            
            document.getElementById('settings-logo-preview-box').innerHTML = `<img src="${compressedBase64}" alt="Logo Preview" style="width:100%; height:100%; object-fit:contain;">`;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Save Settings API Call
async function saveStoreSettings(event) {
    event.preventDefault();

    const saveBtn = document.getElementById('save-settings-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...`;

    const updatedSettings = {
        storeName: document.getElementById('settings-store-name').value,
        currency: document.getElementById('settings-currency').value,
        enableCod: document.getElementById('settings-enable-cod').checked,
        enableBank: document.getElementById('settings-enable-bank').checked,
        enableCard: document.getElementById('settings-enable-card').checked,
        bankName: document.getElementById('settings-bank-name').value,
        bankHolder: document.getElementById('settings-bank-holder').value,
        bankIban: document.getElementById('settings-bank-iban').value,
        logo: settings.logo || "",
        adminPassword: document.getElementById('settings-admin-password').value,
        
        usdToSarRate: parseFloat(document.getElementById('settings-sar-rate').value) || 3.75,
        usdToYerRate: parseFloat(document.getElementById('settings-yer-rate').value) || 1600.0,
        enableBcash: document.getElementById('settings-enable-bcash').checked,
        enableQurooshi: document.getElementById('settings-enable-qurooshi').checked,
        enableKuraimi: document.getElementById('settings-enable-kuraimi').checked,
        bcashNumber: document.getElementById('settings-bcash-number').value,
        qurooshiNumber: document.getElementById('settings-qurooshi-number').value,
        kuraimiNumber: document.getElementById('settings-kuraimi-number').value
    };

    try {
        const response = await apiPost('/api/settings', 'local_settings', updatedSettings);

        if (response.success) {
            settings = updatedSettings;
            updateSidebarLogo();
            alert("تم حفظ إعدادات المتجر وشعار الهوية بنجاح!");
        } else {
            alert("عذراً، فشل حفظ الإعدادات.");
        }
    } catch (e) {
        console.error("Save settings error:", e);
        alert("حدث خطأ أثناء حفظ الإعدادات.");
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> حفظ كافة الإعدادات`;
    }
}

// Fetch Products API
async function fetchProducts() {
    products = await apiGet('/api/products', 'local_products', []);
    updateKPIs();
}

// Renders Products management Table
function renderProductsTable() {
    const tableBody = document.getElementById('products-table-body');
    if (products.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">لا توجد منتجات حالياً. أضف منتجاً جديداً للبدء.</td></tr>`;
        return;
    }

    tableBody.innerHTML = products.map(p => {
        const stockLevel = p.stock ?? 5;
        let stockStyle = '';
        if (stockLevel <= 0) stockStyle = 'color: #ef4444; font-weight:700;';
        else if (stockLevel <= 2) stockStyle = 'color: #f59e0b; font-weight:700;';

        return `
            <tr>
                <td>
                    <img src="${p.image || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=100&auto=format&fit=crop&q=80'}" alt="${p.title}" class="table-img">
                </td>
                <td style="font-weight:600;">${p.title}</td>
                <td><span class="badge" style="background:rgba(255,255,255,0.05); color:#fff;">${p.category}</span></td>
                <td style="font-family:var(--font-tajawal);font-weight:700;color:var(--text-gold);">${p.price} $</td>
                <td style="${stockStyle}">${stockLevel} قطع</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-table-action" onclick="openProductModal('edit', ${p.id})" title="تعديل المنتج">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-table-action delete" onclick="deleteProduct(${p.id})" title="حذف المنتج">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Fetch Orders API
async function fetchOrders() {
    orders = await apiGet('/api/orders', 'local_orders', []);
    updateKPIs();
    renderRecentOrders();
    if (currentTab === 'orders') renderOrdersTable();
}

// Render Recent Orders in Dashboard home
function renderRecentOrders() {
    const recentBody = document.getElementById('recent-orders-table-body');
    if (orders.length === 0) {
        recentBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">لا توجد طلبات مسجلة حالياً.</td></tr>`;
        return;
    }

    const recent = [...orders].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    recentBody.innerHTML = recent.map(o => {
        const dateStr = new Date(o.date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const pMethod = getPaymentMethodName(o.paymentMethod);
        const statusBadge = o.status === 'completed' 
            ? `<span class="badge badge-completed">مكتمل</span>` 
            : `<span class="badge badge-pending">قيد الانتظار</span>`;
        let currencySymbol = '$';
        if (o.currency === 'SAR') currencySymbol = 'ر.س';
        else if (o.currency === 'YER') currencySymbol = 'ر.ي';

        return `
            <tr>
                <td style="font-weight:700;font-family:monospace;direction:ltr;text-align:right;">#${o.id}</td>
                <td style="font-weight:600;">${o.customerName}</td>
                <td>${pMethod}</td>
                <td style="font-size:0.8rem;color:var(--text-muted);">${dateStr}</td>
                <td style="font-weight:700;color:var(--text-gold);font-family:var(--font-tajawal);">${o.totalPrice.toLocaleString()} ${currencySymbol}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-table-action" onclick="viewOrderDetails(${o.id})" title="عرض التفاصيل">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Filter and search orders list dynamically
function filterOrdersList() {
    renderOrdersTable();
}

// Render Orders Tab Table
function renderOrdersTable() {
    const tableBody = document.getElementById('orders-table-body');
    if (orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);">لا توجد طلبات مسجلة بعد.</td></tr>`;
        return;
    }

    // Gathers filters input
    const searchQuery = document.getElementById('order-search-input').value.toLowerCase().trim();
    const statusFilter = document.getElementById('order-status-filter').value;

    let filteredOrders = [...orders].sort((a,b) => new Date(b.date) - new Date(a.date));

    // Filter by status
    if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
        filteredOrders = filteredOrders.filter(o => 
            o.customerName.toLowerCase().includes(searchQuery) ||
            o.id.toString().includes(searchQuery) ||
            o.customerPhone.includes(searchQuery)
        );
    }

    if (filteredOrders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);">لا توجد طلبات تطابق معايير البحث.</td></tr>`;
        return;
    }

    tableBody.innerHTML = filteredOrders.map(o => {
        const dateStr = new Date(o.date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        const pMethod = getPaymentMethodName(o.paymentMethod);
        const statusBadge = o.status === 'completed' 
            ? `<span class="badge badge-completed">مكتمل</span>` 
            : `<span class="badge badge-pending">قيد الانتظار</span>`;
        let currencySymbol = '$';
        if (o.currency === 'SAR') currencySymbol = 'ر.س';
        else if (o.currency === 'YER') currencySymbol = 'ر.ي';

        const actionButtons = o.status === 'pending'
            ? `<button class="btn-table-action" style="color:#10b981;border-color:rgba(16,185,129,0.2);" onclick="completeOrder(${o.id})" title="تحديد كمكتمل">
                   <i class="fa-solid fa-check"></i>
               </button>`
            : '';

        return `
            <tr>
                <td style="font-weight:700;font-family:monospace;">#${o.id}</td>
                <td style="font-weight:600;">${o.customerName}</td>
                <td style="direction:ltr;text-align:right;">${o.customerPhone}</td>
                <td>${pMethod}</td>
                <td style="font-size:0.8rem;color:var(--text-muted);">${dateStr}</td>
                <td style="font-weight:700;color:var(--text-gold);font-family:var(--font-tajawal);">${o.totalPrice.toLocaleString()} ${currencySymbol}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-table-action" onclick="viewOrderDetails(${o.id})" title="عرض التفاصيل">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        ${actionButtons}
                        <button class="btn-table-action delete" onclick="deleteOrder(${o.id})" title="حذف الطلب">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Payment method naming helper
function getPaymentMethodName(method) {
    if (method === 'cod') return '<i class="fa-solid fa-hand-holding-dollar" style="margin-left:5px;color:var(--primary-color);"></i>الدفع عند الاستلام';
    if (method === 'bank') return '<i class="fa-solid fa-building-columns" style="margin-left:5px;color:var(--primary-color);"></i>تحويل بنكي';
    if (method === 'card') return '<i class="fa-solid fa-credit-card" style="margin-left:5px;color:var(--primary-color);"></i>بطاقة مدى / ائتمان';
    if (method === 'bcash') return '<i class="fa-solid fa-mobile-screen-button" style="margin-left:5px;color:var(--primary-color);"></i>B-Cash (البسيري)';
    if (method === 'qurooshi') return '<i class="fa-solid fa-wallet" style="margin-left:5px;color:var(--primary-color);"></i>محفظة قروشي (أمجاد)';
    if (method === 'kuraimi') return '<i class="fa-solid fa-building-columns" style="margin-left:5px;color:var(--primary-color);"></i>بنك الكريمي';
    return method;
}

// Update KPI Stats elements
function updateKPIs() {
    const activeProducts = products.length;
    const totalOrders = orders.length;

    const sarRate = settings.usdToSarRate || 3.75;
    const yerRate = settings.usdToYerRate || 1600.0;

    // Convert everything to USD base first, to prevent mixing currencies mathematically
    const totalRevenueUSD = orders.reduce((sum, o) => {
        let amountUSD = o.totalPrice;
        if (o.currency === 'SAR') amountUSD = o.totalPrice / sarRate;
        else if (o.currency === 'YER') amountUSD = o.totalPrice / yerRate;
        return sum + amountUSD;
    }, 0);
    const avgOrderValUSD = totalOrders > 0 ? (totalRevenueUSD / totalOrders) : 0;

    // Format display depending on store settings currency (USD, SAR or YER)
    const baseCurrency = settings.currency || 'USD';
    let displayRevenue = Math.round(totalRevenueUSD);
    let displayAvg = Math.round(avgOrderValUSD);
    let currencySymbol = '$';

    if (baseCurrency === 'SAR') {
        displayRevenue = Math.round(totalRevenueUSD * sarRate);
        displayAvg = Math.round(avgOrderValUSD * sarRate);
        currencySymbol = 'ر.س';
    } else if (baseCurrency === 'YER') {
        displayRevenue = Math.round(totalRevenueUSD * yerRate);
        displayAvg = Math.round(avgOrderValUSD * yerRate);
        currencySymbol = 'ر.ي';
    }

    document.getElementById('kpi-revenue').innerText = `${displayRevenue.toLocaleString()} ${currencySymbol}`;
    document.getElementById('kpi-orders').innerText = totalOrders;
    document.getElementById('kpi-products').innerText = activeProducts;
    document.getElementById('kpi-avg-order').innerText = `${displayAvg.toLocaleString()} ${currencySymbol}`;
}

// --- PRODUCT DIALOG CRUD ACTIONS ---
function openProductModal(mode, productId = null) {
    const modal = document.getElementById('product-modal-overlay');
    const title = document.getElementById('product-modal-title');
    const form = document.getElementById('product-form');

    form.reset();
    uploadedProductImageBase64 = null;
    document.getElementById('prod-img-preview-box').innerHTML = `<i class="fa-solid fa-images"></i>`;

    if (mode === 'add') {
        title.innerText = "إضافة منتج جديد";
        document.getElementById('product-id-field').value = '';
        document.getElementById('product-stock').value = 5; // Default stock
    } else if (mode === 'edit') {
        title.innerText = "تعديل بيانات المنتج";
        const prod = products.find(p => p.id === productId);
        if (!prod) return;

        document.getElementById('product-id-field').value = prod.id;
        document.getElementById('product-title').value = prod.title;
        document.getElementById('product-category').value = prod.category;
        document.getElementById('product-price').value = prod.price;
        document.getElementById('product-stock').value = prod.stock ?? 5;
        document.getElementById('product-desc-editor').value = prod.description || '';

        if (prod.image) {
            uploadedProductImageBase64 = prod.image;
            document.getElementById('prod-img-preview-box').innerHTML = `<img src="${prod.image}" alt="Preview">`;
        }
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal-overlay');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

function triggerProductImageSelect() {
    document.getElementById('product-file-input').click();
}

// Client-side canvas image resizing and compression
function handleProductImageUploaded(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            // Setup canvas
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Maximum bounds (e.g. 800px)
            const MAX_SIZE = 800;
            if (width > MAX_SIZE || height > MAX_SIZE) {
                if (width > height) {
                    height = Math.round((height * MAX_SIZE) / width);
                    width = MAX_SIZE;
                } else {
                    width = Math.round((width * MAX_SIZE) / height);
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Export to highly-compressed JPEG (0.8 quality)
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
            uploadedProductImageBase64 = compressedBase64;
            
            // Draw in preview container
            document.getElementById('prod-img-preview-box').innerHTML = `<img src="${compressedBase64}" alt="Preview">`;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Custom description simple rich-formatting commands
function formatText(action) {
    const textarea = document.getElementById('product-desc-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let replacement = "";

    switch(action) {
        case 'bold':
            replacement = `<b>${selectedText || 'نص عريض'}</b>`;
            break;
        case 'italic':
            replacement = `<i>${selectedText || 'نص مائل'}</i>`;
            break;
        case 'header':
            replacement = `<h3>${selectedText || 'عنوان فرعي'}</h3>`;
            break;
        case 'bullet':
            replacement = `\n<ul>\n  <li>${selectedText || 'عنصر القائمة'}</li>\n  <li>عنصر آخر</li>\n</ul>`;
            break;
        case 'color':
            replacement = `<span style="color:#00f5d4">${selectedText || 'نص متميز باللون الفيروزي'}</span>`;
            break;
        case 'newline':
            replacement = `<br>\n`;
            break;
    }

    textarea.value = text.substring(0, start) + replacement + text.substring(end);
    textarea.focus();
    
    // Reset selection bounds
    textarea.selectionStart = start;
    textarea.selectionEnd = start + replacement.length;
}

// Add / Update Product Submit
async function saveProduct(event) {
    event.preventDefault();

    const idVal = document.getElementById('product-id-field').value;
    const titleVal = document.getElementById('product-title').value;
    const catVal = document.getElementById('product-category').value;
    const priceVal = parseFloat(document.getElementById('product-price').value);
    const stockVal = parseInt(document.getElementById('product-stock').value);
    const descVal = document.getElementById('product-desc-editor').value;

    if (!uploadedProductImageBase64) {
        alert("يرجى اختيار صورة للمنتج أولاً.");
        return;
    }

    const saveBtn = document.getElementById('product-save-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...`;

    let updatedList = [...products];

    if (idVal) {
        // Edit mode
        const index = updatedList.findIndex(p => p.id == idVal);
        if (index > -1) {
            updatedList[index] = {
                id: parseInt(idVal),
                title: titleVal,
                category: catVal,
                price: priceVal,
                stock: stockVal,
                description: descVal,
                image: uploadedProductImageBase64
            };
        }
    } else {
        // Add mode
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        updatedList.push({
            id: newId,
            title: titleVal,
            category: catVal,
            price: priceVal,
            stock: stockVal,
            description: descVal,
            image: uploadedProductImageBase64
        });
    }

    try {
        const response = await apiPost('/api/products', 'local_products', updatedList);

        if (response.success) {
            products = updatedList;
            renderProductsTable();
            updateKPIs();
            closeProductModal();
        } else {
            alert("فشل حفظ المنتج.");
        }
    } catch (e) {
        console.error("Save product error:", e);
        alert("حدث خطأ أثناء الاتصال بالخادم لحفظ المنتج.");
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = `حفظ المنتج`;
    }
}

// Delete Product
async function deleteProduct(productId) {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج نهائياً من المتجر؟")) return;

    const filtered = products.filter(p => p.id !== productId);

    try {
        const response = await apiPost('/api/products', 'local_products', filtered);

        if (response.success) {
            products = filtered;
            renderProductsTable();
            updateKPIs();
        } else {
            alert("فشل حذف المنتج.");
        }
    } catch (e) {
        console.error("Delete product error:", e);
        alert("حدث خطأ أثناء الاتصال بالخادم لحذف المنتج.");
    }
}

// --- ORDER ACTION HANDLERS ---
// Mark order status as completed
async function completeOrder(orderId) {
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return;

    orders[index].status = 'completed';

    try {
        const response = await apiPost('/api/orders', 'local_orders', orders);

        if (response.success) {
            renderOrdersTable();
            renderRecentOrders();
            updateKPIs();
        } else {
            alert("فشل تحديث حالة الطلب.");
        }
    } catch (e) {
        console.error("Update order error:", e);
        alert("حدث خطأ أثناء تحديث حالة الطلب.");
    }
}

// Delete Order from history
async function deleteOrder(orderId) {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب نهائياً من قائمة الطلبات؟")) return;

    const filtered = orders.filter(o => o.id !== orderId);

    try {
        const response = await apiPost('/api/orders', 'local_orders', filtered);

        if (response.success) {
            orders = filtered;
            renderOrdersTable();
            renderRecentOrders();
            updateKPIs();
        } else {
            alert("فشل حذف الطلب.");
        }
    } catch (e) {
        console.error("Delete order error:", e);
        alert("حدث خطأ أثناء حذف الطلب.");
    }
}

// View Order Details Modal
function viewOrderDetails(orderId) {
    const o = orders.find(x => x.id === orderId);
    if (!o) return;

    const modal = document.getElementById('order-details-modal-overlay');
    const body = document.getElementById('order-details-modal-body');

    const dateStr = new Date(o.date).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    const pMethod = getPaymentMethodName(o.paymentMethod);
    const statusText = o.status === 'completed' ? '<span class="badge badge-completed">مكتمل</span>' : '<span class="badge badge-pending">قيد الانتظار</span>';

    // Build items rows
    let currencySymbol = '$';
    if (o.currency === 'SAR') currencySymbol = 'ر.س';
    else if (o.currency === 'YER') currencySymbol = 'ر.ي';
    
    const itemsRows = o.items.map(item => `
        <tr>
            <td style="text-align:right;">${item.title}</td>
            <td>${item.price.toLocaleString()} ${currencySymbol}</td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="font-weight:700;color:var(--text-gold);font-family:var(--font-tajawal);">${(item.price * item.quantity).toLocaleString()} ${currencySymbol}</td>
        </tr>
    `).join('');

    // Extra payment details view
    let paymentDetailsView = '';
    if (['bank', 'bcash', 'qurooshi', 'kuraimi'].includes(o.paymentMethod)) {
        const hasReceipt = o.paymentDetails && o.paymentDetails.hasReceipt;
        const receiptImg = o.paymentDetails && o.paymentDetails.receiptImage;
        
        paymentDetailsView = `
            <div style="grid-column: 1/-1; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
                <div class="order-detail-label">صورة إشعار/إيصال التحويل:</div>
                ${hasReceipt && receiptImg 
                    ? `<div style="margin-top:8px;"><img src="${receiptImg}" alt="Receipt" style="max-width:100%; max-height:220px; border-radius:8px; border:1px solid var(--border-color); cursor:pointer;" onclick="window.open(this.src)"></div>` 
                    : '<div style="color:var(--text-muted); font-size:0.85rem; font-style:italic; margin-top:5px;">لم يقم العميل بإرفاق صورة إشعار التحويل.</div>'}
            </div>
        `;
    } else if (o.paymentMethod === 'card') {
        const suffix = o.paymentDetails ? o.paymentDetails.cardSuffix : '••••';
        const cardName = o.paymentDetails ? o.paymentDetails.holderName : 'CARDHOLDER';
        paymentDetailsView = `
            <div style="grid-column: 1/-1; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px;">
                <div class="order-detail-label">تفاصيل البطاقة البنكية (محاكاة):</div>
                <div style="font-size:0.85rem; font-weight:600; margin-top:5px;">
                    رقم البطاقة: **** **** **** ${suffix} | حامل البطاقة: ${cardName}
                </div>
            </div>
        `;
    }

    body.innerHTML = `
        <div class="order-details-summary">
            <div class="order-details-grid">
                <div class="order-detail-item">
                    <div class="order-detail-label">رقم الطلب</div>
                    <div class="order-detail-val" style="font-family:monospace; font-size:1.1rem; color:var(--text-gold);">#${o.id}</div>
                </div>
                <div class="order-detail-item">
                    <div class="order-detail-label">تاريخ الطلب</div>
                    <div class="order-detail-val" style="font-size:0.8rem;">${dateStr}</div>
                </div>
                <div class="order-detail-item" style="margin-top:10px;">
                    <div class="order-detail-label">العميل</div>
                    <div class="order-detail-val" style="font-size:1rem;">${o.customerName}</div>
                </div>
                <div class="order-detail-item" style="margin-top:10px;">
                    <div class="order-detail-label">رقم الجوال</div>
                    <div class="order-detail-val" style="direction:ltr; text-align:right;">${o.customerPhone}</div>
                </div>
                <div class="order-detail-item" style="grid-column: 1/-1; margin-top:10px;">
                    <div class="order-detail-label">عنوان التوصيل</div>
                    <div class="order-detail-val">${o.customerCity} - ${o.customerAddress}</div>
                </div>
                <div class="order-detail-item" style="margin-top:10px;">
                    <div class="order-detail-label">طريقة الدفع</div>
                    <div class="order-detail-val">${pMethod}</div>
                </div>
                <div class="order-detail-item" style="margin-top:10px;">
                    <div class="order-detail-label">حالة الطلب الحالية</div>
                    <div class="order-detail-val">${statusText}</div>
                </div>
                ${paymentDetailsView}
            </div>
        </div>

        <h4 style="font-family:var(--font-tajawal); font-size:1rem; font-weight:700; margin-bottom:8px;"><i class="fa-solid fa-box" style="color:var(--primary-color); margin-left:8px;"></i>المنتجات المطلوبة</h4>
        
        <div class="admin-card-table order-items-table">
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>المنتج</th>
                            <th>سعر الوحدة</th>
                            <th style="text-align:center;">الكمية</th>
                            <th>المجموع</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsRows}
                        <tr style="background:rgba(255,255,255,0.02); border-top:2px solid var(--border-color);">
                            <td colspan="3" style="text-align:left; font-weight:700;">المبلغ الإجمالي النهائي:</td>
                            <td style="font-weight:800; color:var(--text-gold); font-size:1.15rem; font-family:var(--font-tajawal);">${o.totalPrice.toLocaleString()} ${currencySymbol}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:2rem;">
            ${o.status === 'pending' 
                ? `<button class="btn-primary" onclick="completeOrder(${o.id}); closeOrderDetailsModal();"><i class="fa-solid fa-check"></i> تعليم الطلب كمكتمل</button>` 
                : ''}
            <button class="btn-secondary" onclick="closeOrderDetailsModal()">إغلاق النافذة</button>
        </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Close order details
function closeOrderDetailsModal() {
    const modal = document.getElementById('order-details-modal-overlay');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}
