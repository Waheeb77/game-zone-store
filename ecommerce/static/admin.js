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

// Translation Dictionary for Admin
const i18nAdmin = {
  ar: {
    admin_tab_overview_title: "لوحة التحكم العامة",
    admin_tab_overview_desc: "متابعة أداء المتجر، المبيعات وإدارة المنتجات والطلبات بشكل كامل.",
    admin_tab_products_title: "إدارة المنتجات",
    admin_tab_products_desc: "إضافة وتعديل وحذف منتجات المتجر مع تحديث المخزون والأسعار.",
    admin_tab_orders_title: "قائمة الطلبات المستلمة",
    admin_tab_orders_desc: "مراجعة الطلبات، وتأكيد التحويلات البنكية وإيصالات الدفع وتغيير الحالات.",
    admin_tab_settings_title: "إعدادات متجر ألعاب الكمبيوتر",
    admin_tab_settings_desc: "تخصيص طرق الدفع، معدلات التحويل للعملات، الحسابات والبيانات البنكية وشعار المتجر.",
    
    // Sidebar
    admin_menu_overview: "الإحصائيات العامة",
    admin_menu_products: "إدارة المنتجات",
    admin_menu_orders: "قائمة الطلبات",
    admin_menu_coupons: "أكواد الخصم",
    admin_menu_settings: "إعدادات المتجر",
    admin_return_store: "العودة للمتجر",
    admin_tab_coupons_title: "إدارة أكواد الخصم",
    admin_tab_coupons_desc: "إنشاء وتعديل وحذف كوبونات الخصم للمتجر وتحديد شروط انتهاء الصلاحية وعدد الاستخدامات.",
    table_coupon_code: "كود الخصم",
    table_coupon_discount: "نسبة الخصم",
    table_coupon_limit: "حد الاستخدام",
    table_coupon_uses: "عدد الاستخدامات",
    table_coupon_expiry: "تاريخ الانتهاء",
    table_coupon_status: "الحالة",
    table_coupon_actions: "الإجراءات",
    
    // Login
    admin_protection: "حماية الإدارة",
    admin_enter_password: "الرجاء إدخال كلمة مرور المدير للوصول للوحة التحكم",
    admin_password_label: "كلمة المرور *",
    admin_login_btn: "دخول لوحة التحكم",
    
    // KPI
    kpi_revenue: "إجمالي المبيعات",
    kpi_orders: "عدد الطلبات",
    kpi_active_products: "المنتجات النشطة",
    kpi_avg_order: "متوسط قيمة الطلب",
    
    // General
    table_order_id: "رقم الطلب",
    table_customer: "العميل",
    table_payment_method: "طريقة الدفع",
    table_date: "تاريخ الطلب",
    table_total_price: "القيمة الإجمالية",
    table_status: "حالة الطلب",
    table_actions: "الإجراءات"
  },
  en: {
    admin_tab_overview_title: "General Dashboard",
    admin_tab_overview_desc: "Monitor store performance, sales, products, and incoming orders in real-time.",
    admin_tab_products_title: "Product Management",
    admin_tab_products_desc: "Add, modify, and remove store products with inventory levels and prices.",
    admin_tab_orders_title: "Received Orders List",
    admin_tab_orders_desc: "Review orders, verify bank transfer receipts, and update order statuses.",
    admin_tab_settings_title: "Store Settings",
    admin_tab_settings_desc: "Customize payment options, exchange rates, bank credentials, and store logo.",
    
    // Sidebar
    admin_menu_overview: "Statistics & Overview",
    admin_menu_products: "Manage Products",
    admin_menu_orders: "Orders List",
    admin_menu_coupons: "Promo Codes",
    admin_menu_settings: "Store Settings",
    admin_return_store: "Return to Store",
    admin_tab_coupons_title: "Discount Codes Management",
    admin_tab_coupons_desc: "Create, modify, and delete promo/discount codes, set usage limits, or expiry dates.",
    table_coupon_code: "Promo Code",
    table_coupon_discount: "Discount",
    table_coupon_limit: "Usage Limit",
    table_coupon_uses: "Times Used",
    table_coupon_expiry: "Expiry Date",
    table_coupon_status: "Status",
    table_coupon_actions: "Actions",
    
    // Login
    admin_protection: "Admin Security",
    admin_enter_password: "Please enter the admin password to access the dashboard",
    admin_password_label: "Password *",
    admin_login_btn: "Enter Dashboard",
    
    // KPI
    kpi_revenue: "Total Sales",
    kpi_orders: "Total Orders",
    kpi_active_products: "Active Products",
    kpi_avg_order: "Avg Order Value",
    
    // General
    table_order_id: "Order ID",
    table_customer: "Customer",
    table_payment_method: "Payment Method",
    table_date: "Order Date",
    table_total_price: "Total Value",
    table_status: "Order Status",
    table_actions: "Actions"
  }
};

let currentLang = localStorage.getItem('store_lang') || 'ar';

function changeAdminLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('store_lang', lang);
    
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Set active class on language toggle buttons
    const arBtn = document.getElementById('lang-btn-ar');
    const enBtn = document.getElementById('lang-btn-en');
    if (arBtn && enBtn) {
        arBtn.classList.remove('active');
        enBtn.classList.remove('active');
        if (lang === 'ar') arBtn.classList.add('active');
        else enBtn.classList.add('active');
    }
    
    translateAdminPage();
    
    // Update active tab headers
    const title = document.getElementById('admin-current-tab-title');
    const desc = document.getElementById('admin-current-tab-desc');
    if (title && desc) {
        title.innerText = i18nAdmin[currentLang][`admin_tab_${currentTab}_title`] || title.innerText;
        desc.innerText = i18nAdmin[currentLang][`admin_tab_${currentTab}_desc`] || desc.innerText;
    }
    
    // Update current date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.innerText = new Date().toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', options);
    }
    
    // Re-render components
    if (currentTab === 'overview') fetchOrders();
    else if (currentTab === 'products') renderProductsTable();
    else if (currentTab === 'orders') renderOrdersTable();
}

function translateAdminPage() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18nAdmin[currentLang] && i18nAdmin[currentLang][key]) {
            const icon = el.querySelector('i');
            if (icon) {
                const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                if (textNode) {
                    textNode.nodeValue = " " + i18nAdmin[currentLang][key];
                } else {
                    el.innerHTML = icon.outerHTML + " " + i18nAdmin[currentLang][key];
                }
            } else {
                el.innerText = i18nAdmin[currentLang][key];
            }
        }
    });
}

// Hybrid API and LocalStorage helper functions for static page safety
async function apiGet(endpoint, fallbackKey, defaultVal) {
    try {
        const response = await fetch(endpoint);
        if (response.ok) {
            const data = await response.json();
            
            // Self-healing database sync logic for orders:
            if (fallbackKey === 'local_orders' && Array.isArray(data)) {
                let localData = [];
                try {
                    localData = JSON.parse(localStorage.getItem('local_orders')) || [];
                } catch (e) {}
                if (Array.isArray(localData) && localData.length > data.length) {
                    console.log("Server orders database reset detected. Restoring from client LocalStorage...");
                    // Merge localData and data to prevent any data loss:
                    const merged = [...data];
                    localData.forEach(localOrd => {
                        if (!merged.some(o => o.id === localOrd.id)) {
                            merged.push(localOrd);
                        }
                    });
                    // Post back to heal the server database
                    await apiPost(endpoint, fallbackKey, merged);
                    return merged;
                }
            }
            
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

    // Set active language switcher class
    const arBtn = document.getElementById('lang-btn-ar');
    const enBtn = document.getElementById('lang-btn-en');
    if (arBtn && enBtn) {
        arBtn.classList.remove('active');
        enBtn.classList.remove('active');
        if (currentLang === 'ar') arBtn.classList.add('active');
        else enBtn.classList.add('active');
    }

    // Set document lang and dir
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    // Set Current Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        dateEl.innerText = new Date().toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', options);
    }

    // Initial API Calls
    fetchSettings().then(() => {
        fetchProducts().then(() => {
            fetchOrders().then(() => {
                translateAdminPage();
            });
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
        title.innerText = i18nAdmin[currentLang].admin_tab_overview_title;
        desc.innerText = i18nAdmin[currentLang].admin_tab_overview_desc;
        fetchOrders();
    } else if (tabName === 'products') {
        title.innerText = i18nAdmin[currentLang].admin_tab_products_title;
        desc.innerText = i18nAdmin[currentLang].admin_tab_products_desc;
        renderProductsTable();
    } else if (tabName === 'orders') {
        title.innerText = i18nAdmin[currentLang].admin_tab_orders_title;
        desc.innerText = i18nAdmin[currentLang].admin_tab_orders_desc;
        renderOrdersTable();
    } else if (tabName === 'settings') {
        title.innerText = i18nAdmin[currentLang].admin_tab_settings_title;
        desc.innerText = i18nAdmin[currentLang].admin_tab_settings_desc;
        populateSettingsForm();
    } else if (tabName === 'coupons') {
        title.innerText = i18nAdmin[currentLang].admin_tab_coupons_title;
        desc.innerText = i18nAdmin[currentLang].admin_tab_coupons_desc;
        renderCouponsTable();
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
        ...settings, // Keep existing fields like coupons, etc.
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
                        <button class="btn-table-action" onclick="viewOrderDetails(${o.id})" title="${currentLang === 'ar' ? 'عرض التفاصيل' : 'View Details'}">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-table-action" onclick="printOrderInvoice(${o.id})" title="${currentLang === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}">
                            <i class="fa-solid fa-print"></i>
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
                        <button class="btn-table-action" onclick="viewOrderDetails(${o.id})" title="${currentLang === 'ar' ? 'عرض التفاصيل' : 'View Details'}">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="btn-table-action" onclick="printOrderInvoice(${o.id})" title="${currentLang === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}">
                            <i class="fa-solid fa-print"></i>
                        </button>
                        ${actionButtons}
                        <button class="btn-table-action delete" onclick="deleteOrder(${o.id})" title="${currentLang === 'ar' ? 'حذف الطلب' : 'Delete Order'}">
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
            <button class="btn-primary" onclick="printOrderInvoice(${o.id})" style="background:#a855f7; border-color:#a855f7; color:#fff;">
                <i class="fa-solid fa-print"></i> ${currentLang === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}
            </button>
            ${o.status === 'pending' 
                ? `<button class="btn-primary" onclick="completeOrder(${o.id}); closeOrderDetailsModal();"><i class="fa-solid fa-check"></i> ${currentLang === 'ar' ? 'تعليم الطلب كمكتمل' : 'Mark Completed'}</button>` 
                : ''}
            <button class="btn-secondary" onclick="closeOrderDetailsModal()">${currentLang === 'ar' ? 'إغلاق النافذة' : 'Close Window'}</button>
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

// Print Order Invoice Receipt
function printOrderInvoice(orderId) {
    const o = orders.find(x => x.id === orderId);
    if (!o) return;

    const printContainer = document.getElementById('invoice-print-template');
    if (!printContainer) return;

    // Format Date
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const orderDate = new Date(o.date).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', dateOptions);

    // Get Payment Method display text (localized)
    let pMethodLocal = '';
    if (o.paymentMethod === 'cod') pMethodLocal = currentLang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery';
    else if (o.paymentMethod === 'bank') pMethodLocal = currentLang === 'ar' ? 'تحويل بنكي' : 'Bank Transfer';
    else if (o.paymentMethod === 'card') pMethodLocal = currentLang === 'ar' ? 'بطاقة مدى / ائتمان' : 'Credit Card / Mada';
    else if (o.paymentMethod === 'bcash') pMethodLocal = currentLang === 'ar' ? 'B-Cash (بنك البسيري)' : 'B-Cash (Al-Buseiri Bank)';
    else if (o.paymentMethod === 'qurooshi') pMethodLocal = currentLang === 'ar' ? 'محفظة قروشي (بنك أمجاد)' : 'Qurooshi Wallet (Amjad Bank)';
    else if (o.paymentMethod === 'kuraimi') pMethodLocal = currentLang === 'ar' ? 'بنك الكريمي' : 'Kuraimi Bank';
    else pMethodLocal = o.paymentMethod;

    // Currency representation
    let currencySymbol = '$';
    if (o.currency === 'SAR') currencySymbol = currentLang === 'ar' ? 'ر.س' : 'SAR';
    else if (o.currency === 'YER') currencySymbol = currentLang === 'ar' ? 'ر.ي' : 'YER';

    // Logo rendering logic
    let logoHTML = '';
    if (settings.logo) {
        logoHTML = `<img src="${settings.logo}" alt="${settings.storeName}" class="invoice-logo-img">`;
    } else {
        logoHTML = `<div class="invoice-logo-txt">${settings.storeName || 'Game Zone'}</div>`;
    }

    // Get elegant uppercase English store name for the center title
    let storeNameEn = 'GAME ZONE STORE';
    if (settings.storeName && !/[\u0600-\u06FF]/.test(settings.storeName)) {
        storeNameEn = settings.storeName.toUpperCase();
    }

    // Items table rows
    const itemsRows = o.items.map(item => `
        <tr>
            <td>${item.title}</td>
            <td>${item.price.toLocaleString()} ${currencySymbol}</td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: inherit; font-weight: 700;">${(item.price * item.quantity).toLocaleString()} ${currencySymbol}</td>
        </tr>
    `).join('');

    // Build the complete HTML
    const ar = currentLang === 'ar';
    const invoiceHTML = `
        <div class="invoice-container" dir="${ar ? 'rtl' : 'ltr'}">
            <div class="invoice-header">
                <div class="invoice-logo-area">
                    ${logoHTML}
                </div>
                <div class="invoice-center-title">
                    <div class="invoice-title-en">${storeNameEn}</div>
                    <div class="invoice-subtitle-en">E-Commerce Packing Slip & Invoice</div>
                </div>
                <div class="invoice-meta">
                    <h2>${ar ? 'فاتورة طلب' : 'Order Invoice'}</h2>
                    <p><strong>${ar ? 'رقم الطلب:' : 'Order ID:'}</strong> #${o.id}</p>
                    <p><strong>${ar ? 'تاريخ الطلب:' : 'Order Date:'}</strong> ${orderDate}</p>
                </div>
            </div>

            <div class="invoice-details-grid">
                <div class="invoice-block">
                    <h4>${ar ? 'بيانات المتجر' : 'Store Details'}</h4>
                    <p><strong>${settings.storeName || 'Game Zone Store'}</strong></p>
                    <p>${ar ? 'بريد إلكتروني: support@gamezone.com' : 'Email: support@gamezone.com'}</p>
                    <p>${ar ? 'الموقع الإلكتروني: game-zone-store.onrender.com' : 'Website: game-zone-store.onrender.com'}</p>
                </div>
                <div class="invoice-block">
                    <h4>${ar ? 'بيانات العميل والتوصيل' : 'Customer & Shipping'}</h4>
                    <p><strong>${o.customerName}</strong></p>
                    <p><strong>${ar ? 'الهاتف:' : 'Phone:'}</strong> ${o.customerPhone}</p>
                    <p><strong>${ar ? 'العنوان:' : 'Address:'}</strong> ${o.customerCity} - ${o.customerAddress}</p>
                    <p><strong>${ar ? 'طريقة الدفع:' : 'Payment Method:'}</strong> ${pMethodLocal}</p>
                </div>
            </div>

            <table class="invoice-table">
                <thead>
                    <tr>
                        <th style="text-align: inherit;">${ar ? 'المنتج' : 'Product'}</th>
                        <th style="text-align: inherit;">${ar ? 'سعر الوحدة' : 'Unit Price'}</th>
                        <th style="text-align: center;">${ar ? 'الكمية' : 'Quantity'}</th>
                        <th style="text-align: inherit;">${ar ? 'الإجمالي' : 'Total'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsRows}
                </tbody>
            </table>

            <div class="invoice-summary">
                <div class="invoice-summary-row">
                    <span>${ar ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                    <span>${o.totalPrice.toLocaleString()} ${currencySymbol}</span>
                </div>
                <div class="invoice-summary-row total">
                    <span>${ar ? 'الإجمالي النهائي:' : 'Final Total:'}</span>
                    <span>${o.totalPrice.toLocaleString()} ${currencySymbol}</span>
                </div>
            </div>

            <div class="invoice-signature-area">
                <div class="signature-box">
                    <p class="signature-title">${ar ? 'توقيع المستلم:' : 'Receiver Signature:'}</p>
                    <div class="signature-line"></div>
                </div>
                <div class="signature-box">
                    <p class="signature-title">${ar ? 'توقيع وختم المتجر:' : 'Store Signature & Stamp:'}</p>
                    <div class="signature-line"></div>
                </div>
            </div>

            <div class="invoice-footer-note">
                <p>${ar ? `شكراً لتسوقكم من ${settings.storeName || 'Game Zone Store'}!` : `Thank you for shopping with ${settings.storeName || 'Game Zone Store'}!`}</p>
                <p style="font-size: 0.7rem; color: #aaa; margin-top: 5px;">${ar ? 'تم إنشاؤها تلقائياً عبر نظام الفواتير' : 'Automatically generated via the billing system'}</p>
            </div>
        </div>
    `;

    printContainer.innerHTML = invoiceHTML;

    // Trigger printing
    window.print();
}

// --- DISCOUNT COUPON MANAGEMENT ---

// Render Coupons List Table
function renderCouponsTable() {
    const tableBody = document.getElementById('coupons-table-body');
    if (!settings.coupons) settings.coupons = [];
    
    if (settings.coupons.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">${currentLang === 'ar' ? 'لا توجد أكواد خصم حالياً. أضف كوداً جديداً للبدء.' : 'No promo codes found. Add a new code to start.'}</td></tr>`;
        return;
    }

    tableBody.innerHTML = settings.coupons.map((c, index) => {
        // Determine status
        let statusHtml = '';
        let isExpired = false;
        let isLimitReached = false;
        
        if (c.expiryDate) {
            const exp = new Date(c.expiryDate);
            const today = new Date();
            today.setHours(0,0,0,0);
            if (today > exp) isExpired = true;
        }
        
        if (c.usageLimit && c.usageLimit > 0 && c.usageCount >= c.usageLimit) {
            isLimitReached = true;
        }

        if (isExpired) {
            statusHtml = `<span class="badge" style="background:rgba(239, 68, 68, 0.1); color:#ef4444; border: 1px solid rgba(239, 68, 68, 0.2);">${currentLang === 'ar' ? 'منتهي الصلاحية' : 'Expired'}</span>`;
        } else if (isLimitReached) {
            statusHtml = `<span class="badge" style="background:rgba(245, 158, 11, 0.1); color:#f59e0b; border: 1px solid rgba(245, 158, 11, 0.2);">${currentLang === 'ar' ? 'نفذت مرات الاستخدام' : 'Limit Reached'}</span>`;
        } else {
            statusHtml = `<span class="badge badge-completed">${currentLang === 'ar' ? 'نشط' : 'Active'}</span>`;
        }

        const limitText = c.usageLimit && c.usageLimit > 0 ? `${c.usageLimit} ${currentLang === 'ar' ? 'مرات' : 'times'}` : (currentLang === 'ar' ? 'غير محدود' : 'Unlimited');
        const expiryText = c.expiryDate ? c.expiryDate : (currentLang === 'ar' ? 'غير محدود' : 'Unlimited');

        return `
            <tr>
                <td style="font-weight:700; font-family:monospace; font-size:1rem; color:#fff;">${c.code}</td>
                <td style="font-family:var(--font-tajawal); font-weight:700; color:var(--text-gold);">${c.discount}%</td>
                <td>${limitText}</td>
                <td>${c.usageCount || 0}</td>
                <td>${expiryText}</td>
                <td>${statusHtml}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-table-action" onclick="openCouponModal('edit', ${index})" title="${currentLang === 'ar' ? 'تعديل الكود' : 'Edit Code'}">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-table-action delete" onclick="deleteCoupon(${index})" title="${currentLang === 'ar' ? 'حذف الكود' : 'Delete Code'}">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Open Coupon Modal
function openCouponModal(mode, index = null) {
    const modal = document.getElementById('coupon-modal-overlay');
    const title = document.getElementById('coupon-modal-title');
    const form = document.getElementById('coupon-form');

    form.reset();
    document.getElementById('coupon-index-field').value = '';

    if (mode === 'add') {
        title.innerText = currentLang === 'ar' ? "إضافة كود خصم جديد" : "Add New Promo Code";
    } else if (mode === 'edit') {
        title.innerText = currentLang === 'ar' ? "تعديل كود الخصم" : "Edit Promo Code";
        const c = settings.coupons[index];
        if (!c) return;

        document.getElementById('coupon-index-field').value = index;
        document.getElementById('coupon-code').value = c.code;
        document.getElementById('coupon-discount').value = c.discount;
        document.getElementById('coupon-limit').value = c.usageLimit || '';
        document.getElementById('coupon-expiry').value = c.expiryDate || '';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Close Coupon Modal
function closeCouponModal() {
    const modal = document.getElementById('coupon-modal-overlay');
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Save Coupon (Add or Edit)
async function saveCoupon(event) {
    event.preventDefault();
    if (!settings.coupons) settings.coupons = [];

    const indexVal = document.getElementById('coupon-index-field').value;
    const code = document.getElementById('coupon-code').value.trim().toUpperCase();
    const discount = parseInt(document.getElementById('coupon-discount').value);
    const limit = document.getElementById('coupon-limit').value ? parseInt(document.getElementById('coupon-limit').value) : 0;
    const expiry = document.getElementById('coupon-expiry').value || "";

    // Check if code is already used (only when adding a new one, or editing to a different code name)
    const existingIndex = settings.coupons.findIndex(c => c.code === code);
    if (existingIndex > -1 && (indexVal === '' || indexVal != existingIndex)) {
        alert(currentLang === 'ar' ? "كود الخصم هذا موجود بالفعل!" : "This promo code already exists!");
        return;
    }

    const couponData = {
        code: code,
        discount: discount,
        usageLimit: limit,
        usageCount: indexVal !== '' ? (settings.coupons[indexVal].usageCount || 0) : 0,
        expiryDate: expiry
    };

    if (indexVal === '') {
        // Add mode
        settings.coupons.push(couponData);
    } else {
        // Edit mode
        settings.coupons[indexVal] = couponData;
    }

    // Post to server to save settings
    try {
        const response = await apiPost('/api/settings', 'local_settings', settings);
        if (response.success) {
            closeCouponModal();
            renderCouponsTable();
            alert(currentLang === 'ar' ? "تم حفظ كود الخصم بنجاح!" : "Promo code saved successfully!");
        } else {
            alert(currentLang === 'ar' ? "فشل حفظ كود الخصم." : "Failed to save promo code.");
        }
    } catch (e) {
        console.error("Save coupon error:", e);
        alert(currentLang === 'ar' ? "حدث خطأ أثناء حفظ كود الخصم." : "Error saving promo code.");
    }
}

// Delete Coupon
async function deleteCoupon(index) {
    const confirmMsg = currentLang === 'ar' ? "هل أنت متأكد من حذف كود الخصم هذا؟" : "Are you sure you want to delete this promo code?";
    if (!confirm(confirmMsg)) return;

    settings.coupons.splice(index, 1);

    try {
        const response = await apiPost('/api/settings', 'local_settings', settings);
        if (response.success) {
            renderCouponsTable();
            alert(currentLang === 'ar' ? "تم حذف كود الخصم." : "Promo code deleted.");
        } else {
            alert(currentLang === 'ar' ? "فشل الحذف." : "Failed to delete.");
        }
    } catch (e) {
        console.error("Delete coupon error:", e);
        alert(currentLang === 'ar' ? "حدث خطأ أثناء الحذف." : "Error deleting.");
    }
}
