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
let cart = [];
let selectedCategory = "all";
let selectedPaymentMethod = "cod";
let uploadedReceiptBase64 = null;
let activeCurrency = "USD"; // USD or SAR
let discountRate = 0; // percentage
let activePromoCode = "";

// Translation Dictionary
const i18n = {
  ar: {
    hero_subtitle: "متجر الألعاب الاحترافي الأول",
    hero_desc: "اكتشف تشكيلتنا الاحترافية من قطع غيار ومستلزمات ألعاب الكمبيوتر. نوفر قطعاً جديدة ومستعملة مضمونة بأسعار منافسة مع دعم فني متكامل.",
    search_placeholder: "ابحث عن كرت شاشة، معالج، لوحة أم...",
    cart_title: "عربة التسوق",
    cart_empty: "عربتك فارغة من العتاد حالياً",
    promo_placeholder: "كوبون الخصم (مثال: GAME20)",
    apply_promo: "تطبيق",
    coupon_discount: "خصم الكوبون",
    cart_total: "المجموع الإجمالي:",
    checkout_btn: "إتمام عملية الشراء",
    checkout_title: "إتمام طلب الشراء والدفع",
    shipping_info: "بيانات الشحن والتوصيل",
    checkout_name_label: "الاسم الكامل *",
    checkout_name_placeholder: "أدخل اسمك ثلاثي",
    checkout_phone_label: "رقم الجوال *",
    checkout_phone_placeholder: "مثال: +9665xxxxxxxx أو +967xxxxxxx",
    checkout_city_label: "المدينة *",
    checkout_city_placeholder: "مثال: الرياض",
    checkout_address_label: "العنوان التفصيلي للحي والشارع *",
    checkout_address_placeholder: "مثال: حي الياسمين، شارع الملقا، مبنى رقم 12",
    payment_method: "طريقة الدفع المفضلة",
    pay_cod: "الدفع عند الاستلام",
    pay_bank: "تحويل بنكي",
    pay_card: "بطاقة مدى / ائتمان",
    pay_bcash: "B-Cash (البسيري)",
    pay_qurooshi: "محفظة قروشي (أمجاد)",
    pay_kuraimi: "بنك الكريمي",
    cod_info: "الدفع نقداً أو ببطاقة مدى عند استلام الطلب من المندوب. لا توجد رسوم إضافية على التوصيل.",
    bank_info_text: "يرجى تحويل المبلغ المطلوب إلى الحساب البنكي التالي:",
    bank_name: "اسم البنك",
    bank_holder: "صاحب الحساب",
    bank_iban: "رقم الآيبان IBAN",
    upload_receipt: "اضغط هنا لرفع صورة إيصال التحويل (اختياري)",
    receipt_attached: "تم إرفاق صورة إيصال التحويل بنجاح",
    delete_btn: "حذف",
    card_holder_title: "صاحب البطاقة",
    card_expiry_title: "الانتهاء",
    card_back_text: "تخضع هذه البطاقة لشروط الاستخدام المعتمدة. للاستخدام الفردي فقط. صممت لأغراض المحاكاة والشراء التجريبي.",
    card_holder_label: "اسم حامل البطاقة (بالإنجليزية كما هو مطبوع) *",
    card_number_label: "رقم البطاقة *",
    card_expiry_label: "تاريخ الانتهاء *",
    card_cvv_label: "الرمز السري (CVV) *",
    bcash_info_text: "يرجى تحويل المبلغ المطلوب عبر خدمة B-Cash (بنك البسيري) إلى الرقم التالي:",
    bcash_number: "رقم حساب B-Cash",
    upload_bcash_receipt: "اضغط هنا لرفع صورة إشعار تحويل B-Cash (اختياري)",
    qurooshi_info_text: "يرجى تحويل المبلغ المطلوب عبر محفظة قروشي (بنك أمجاد) إلى الرقم التالي:",
    qurooshi_number: "رقم محفظة قروشي",
    upload_qurooshi_receipt: "اضغط هنا لرفع صورة إشعار تحويل قروشي (اختياري)",
    kuraimi_info_text: "يرجى تحويل المبلغ المطلوب إلى حساب بنك الكريمي التالي:",
    kuraimi_number: "رقم حساب الكريمي",
    upload_kuraimi_receipt: "اضغط هنا لرفع صورة إشعار تحويل الكريمي (اختياري)",
    checkout_total_price_label: "المبلغ الإجمالي المطلوب دفعه:",
    confirm_order: "تأكيد الطلب والدفع",
    cancel_btn_text: "تراجع",
    success_title: "تم إرسال طلبك بنجاح!",
    continue_shopping: "متابعة التسوق",
    footer_copy: "جميع الحقوق محفوظة &copy; 2026. متجر قطع ومستلزمات الألعاب الاحترافي.",
    
    // Dynamic translations
    stock_empty: "نفذت الكمية",
    stock_max_cart: "أقصى كمية في السلة",
    stock_only_two: "متبقي قطعتين فقط!",
    stock_available: "متوفر: {stock} قطع",
    add_to_cart_title: "إضافة للحقيبة",
    success_desc_tmpl: "شكراً لثقتك بمتجرنا. تم استلام طلبك برقم <strong id=\"success-order-id\">#{id}</strong> بنجاح. سيقوم فريقنا بالتواصل معك قريباً لتأكيد الشحن والتوصيل.",
    
    // Categories
    cat_all: "الكل",
    cat_new: "قطع جديدة",
    cat_used: "قطع مستعملة",
    cat_acc: "إكسسوارات",
    cat_builds: "تجميعات كاملة",
    cat_monitors: "شاشات",
    cat_furniture: "طاولات وكراسي",
    cat_laptops: "لابتوبات"
  },
  en: {
    hero_subtitle: "The Ultimate Professional Gaming Store",
    hero_desc: "Discover our professional selection of computer gaming parts and accessories. We provide guaranteed new and used parts at competitive prices with full technical support.",
    search_placeholder: "Search for GPU, CPU, motherboard...",
    cart_title: "Shopping Cart",
    cart_empty: "Your cart is currently empty of gear",
    promo_placeholder: "Promo Code (e.g. GAME20)",
    apply_promo: "Apply",
    coupon_discount: "Coupon Discount",
    cart_total: "Grand Total:",
    checkout_btn: "Proceed to Checkout",
    checkout_title: "Complete Order & Payment",
    shipping_info: "Shipping & Delivery Information",
    checkout_name_label: "Full Name *",
    checkout_name_placeholder: "Enter your full name",
    checkout_phone_label: "Phone Number *",
    checkout_phone_placeholder: "e.g. +9665xxxxxxxx or +967xxxxxxx",
    checkout_city_label: "City *",
    checkout_city_placeholder: "e.g. Riyadh",
    checkout_address_label: "Detailed Address (District & Street) *",
    checkout_address_placeholder: "e.g. Alyasmin Dist, Almalqa St, Building No. 12",
    payment_method: "Preferred Payment Method",
    pay_cod: "Cash on Delivery",
    pay_bank: "Bank Transfer",
    pay_card: "Mada / Credit Card",
    pay_bcash: "B-Cash (Buseiri)",
    pay_qurooshi: "Qurooshi Wallet",
    pay_kuraimi: "Kuraimi Bank",
    cod_info: "Pay with cash or Mada card when receiving the order. No extra delivery charges apply.",
    bank_info_text: "Please transfer the required amount to the following bank account:",
    bank_name: "Bank Name",
    bank_holder: "Account Holder",
    bank_iban: "IBAN Number",
    upload_receipt: "Click here to upload transfer receipt (Optional)",
    receipt_attached: "Transfer receipt attached successfully",
    delete_btn: "Delete",
    card_holder_title: "CARDHOLDER",
    card_expiry_title: "EXPIRY",
    card_back_text: "This card is subject to standard terms of use. For individual use only. Designed for simulation and trial purchases.",
    card_holder_label: "Cardholder Name (in English as printed) *",
    card_number_label: "Card Number *",
    card_expiry_label: "Expiry Date *",
    card_cvv_label: "Security Code (CVV) *",
    bcash_info_text: "Please transfer the required amount via B-Cash (Al-Buseiri Bank) to the following number:",
    bcash_number: "B-Cash Account Number",
    upload_bcash_receipt: "Click here to upload B-Cash receipt (Optional)",
    qurooshi_info_text: "Please transfer the required amount via Qurooshi wallet (Amjad Bank) to the following number:",
    qurooshi_number: "Qurooshi Wallet Number",
    upload_qurooshi_receipt: "Click here to upload Qurooshi receipt (Optional)",
    kuraimi_info_text: "Please transfer the required amount to the following Kuraimi Bank account:",
    kuraimi_number: "Kuraimi Account Number",
    upload_kuraimi_receipt: "Click here to upload Kuraimi receipt (Optional)",
    checkout_total_price_label: "Total Amount Required to Pay:",
    confirm_order: "Confirm Order & Pay",
    cancel_btn_text: "Cancel",
    success_title: "Your order has been placed!",
    continue_shopping: "Continue Shopping",
    footer_copy: "All Rights Reserved &copy; 2026. Game Zone Store.",
    
    // Dynamic translations
    stock_empty: "Out of Stock",
    stock_max_cart: "Max quantity in cart",
    stock_only_two: "Only 2 pieces left!",
    stock_available: "Available: {stock} units",
    add_to_cart_title: "Add to Bag",
    success_desc_tmpl: "Thank you for shopping with us. Your order #{id} was received successfully. Our team will contact you shortly to confirm shipping.",
    
    // Categories
    cat_all: "All",
    cat_new: "New Parts",
    cat_used: "Used Parts",
    cat_acc: "Accessories",
    cat_builds: "Complete Builds",
    cat_monitors: "Monitors",
    cat_furniture: "Gaming Furniture",
    cat_laptops: "Laptops"
  }
};

let currentLang = localStorage.getItem('store_lang') || 'ar';

// Language switching logic
function changeStoreLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('store_lang', lang);
    
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // Toggle active class on language toggle buttons
    const arBtn = document.getElementById('lang-btn-ar');
    const enBtn = document.getElementById('lang-btn-en');
    if (arBtn && enBtn) {
        arBtn.classList.remove('active');
        enBtn.classList.remove('active');
        if (lang === 'ar') arBtn.classList.add('active');
        else enBtn.classList.add('active');
    }
    
    translatePage();
    renderCategories();
    renderProducts();
    updateCartUI();
}

// Translate all data-i18n items
function translatePage() {
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[currentLang] && i18n[currentLang][key]) {
            const icon = el.querySelector('i');
            if (icon) {
                const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                if (textNode) {
                    textNode.nodeValue = " " + i18n[currentLang][key];
                } else {
                    el.innerHTML = icon.outerHTML + " " + i18n[currentLang][key];
                }
            } else {
                el.innerText = i18n[currentLang][key];
            }
        }
    });

    const i18nPlaceholders = document.querySelectorAll('[data-i18n-placeholder]');
    i18nPlaceholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[currentLang] && i18n[currentLang][key]) {
            el.placeholder = i18n[currentLang][key];
        }
    });
}

// Render expanded categories dynamically
function renderCategories() {
    const list = document.getElementById('categories-list');
    if (!list) return;

    const cats = [
        { id: 'all', labelKey: 'cat_all', icon: 'fa-gamepad' },
        { id: 'جديد', labelKey: 'cat_new', icon: 'fa-sparkles' },
        { id: 'مستعمل', labelKey: 'cat_used', icon: 'fa-recycle' },
        { id: 'إكسسوارات', labelKey: 'cat_acc', icon: 'fa-keyboard' },
        { id: 'تجميعات', labelKey: 'cat_builds', icon: 'fa-laptop-code' },
        { id: 'شاشات', labelKey: 'cat_monitors', icon: 'fa-desktop' },
        { id: 'طاولات وكراسي', labelKey: 'cat_furniture', icon: 'fa-couch' },
        { id: 'لابتوبات', labelKey: 'cat_laptops', icon: 'fa-laptop' }
    ];

    list.innerHTML = cats.map(cat => {
        const activeClass = selectedCategory === cat.id ? 'active' : '';
        const label = i18n[currentLang][cat.labelKey];
        const marginStyle = currentLang === 'ar' ? 'margin-left: 6px;' : 'margin-right: 6px;';
        return `
            <button class="category-btn ${activeClass}" onclick="selectCategory('${cat.id}', this)">
                <i class="fa-solid ${cat.icon}" style="${marginStyle}"></i>${label}
            </button>
        `;
    }).join('');
}

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
    const arBtn = document.getElementById('lang-btn-ar');
    const enBtn = document.getElementById('lang-btn-en');
    if (arBtn && enBtn) {
        arBtn.classList.remove('active');
        enBtn.classList.remove('active');
        if (currentLang === 'ar') arBtn.classList.add('active');
        else enBtn.classList.add('active');
    }
    
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    loadCartFromLocalStorage();
    fetchSettings().then(() => {
        fetchProducts().then(() => {
            renderCategories();
            translatePage();
        });
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

    // Update Yemeni bank details display
    const bcashNum = document.getElementById('bcash-number-display');
    const qurooshiNum = document.getElementById('qurooshi-number-display');
    const kuraimiNum = document.getElementById('kuraimi-number-display');
    if (bcashNum) bcashNum.innerText = settings.bcashNumber || '770000000';
    if (qurooshiNum) qurooshiNum.innerText = settings.qurooshiNumber || '771000000';
    if (kuraimiNum) kuraimiNum.innerText = settings.kuraimiNumber || '3000000';

    // Update payment tabs visibility
    const tabCod = document.getElementById('tab-btn-cod');
    const tabBank = document.getElementById('tab-btn-bank');
    const tabCard = document.getElementById('tab-btn-card');
    const tabBcash = document.getElementById('tab-btn-bcash');
    const tabQurooshi = document.getElementById('tab-btn-qurooshi');
    const tabKuraimi = document.getElementById('tab-btn-kuraimi');

    if (tabCod) tabCod.style.display = settings.enableCod ? 'flex' : 'none';
    if (tabBank) tabBank.style.display = settings.enableBank ? 'flex' : 'none';
    if (tabCard) tabCard.style.display = settings.enableCard ? 'flex' : 'none';
    if (tabBcash) tabBcash.style.display = settings.enableBcash ? 'flex' : 'none';
    if (tabQurooshi) tabQurooshi.style.display = settings.enableQurooshi ? 'flex' : 'none';
    if (tabKuraimi) tabKuraimi.style.display = settings.enableKuraimi ? 'flex' : 'none';

    // Update currency switcher buttons active class
    const usdBtn = document.getElementById('cur-btn-usd');
    const sarBtn = document.getElementById('cur-btn-sar');
    const yerBtn = document.getElementById('cur-btn-yer');
    if (usdBtn && sarBtn && yerBtn) {
        usdBtn.classList.remove('active');
        sarBtn.classList.remove('active');
        yerBtn.classList.remove('active');
        if (activeCurrency === 'USD') {
            usdBtn.classList.add('active');
        } else if (activeCurrency === 'SAR') {
            sarBtn.classList.add('active');
        } else if (activeCurrency === 'YER') {
            yerBtn.classList.add('active');
        }
    }

    // Auto-select first available payment tab
    let defaultTab = 'cod';
    if (!settings.enableCod) {
        if (settings.enableBank) defaultTab = 'bank';
        else if (settings.enableCard) defaultTab = 'card';
        else if (settings.enableBcash) defaultTab = 'bcash';
        else if (settings.enableQurooshi) defaultTab = 'qurooshi';
        else if (settings.enableKuraimi) defaultTab = 'kuraimi';
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
    const yerBtn = document.getElementById('cur-btn-yer');
    
    if (usdBtn && sarBtn && yerBtn) {
        usdBtn.classList.remove('active');
        sarBtn.classList.remove('active');
        yerBtn.classList.remove('active');
        if (currency === 'USD') {
            usdBtn.classList.add('active');
        } else if (currency === 'SAR') {
            sarBtn.classList.add('active');
        } else if (currency === 'YER') {
            yerBtn.classList.add('active');
        }
    }

    renderProducts();
    updateCartUI();
}

// Currency convert helper function
function convertPrice(priceUSD) {
    if (activeCurrency === 'SAR') {
        const rate = settings.usdToSarRate || 3.75;
        return Math.round(priceUSD * rate);
    } else if (activeCurrency === 'YER') {
        const rate = settings.usdToYerRate || 1600.0;
        return Math.round(priceUSD * rate);
    }
    return priceUSD;
}

function getCurrencySymbol() {
    if (activeCurrency === 'SAR') return 'ر.س';
    if (activeCurrency === 'YER') return 'ر.ي';
    return '$';
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
        filtered = filtered.filter(p => {
            const title = (currentLang === 'en' && p.title_en) ? p.title_en : p.title;
            const desc = (currentLang === 'en' && p.description_en) ? p.description_en : p.description;
            return title.toLowerCase().includes(query) || 
                   (desc && desc.toLowerCase().includes(query)) ||
                   p.category.toLowerCase().includes(query);
        });
    }

    if (filtered.length === 0) {
        const noProductsText = currentLang === 'en' ? 'No parts match your search.' : 'لا توجد قطع تطابق بحثك حالياً.';
        gridContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
                <i class="fa-solid fa-gamepad" style="font-size: 3rem; margin-bottom: 1rem; opacity:0.1;"></i>
                <p>${noProductsText}</p>
            </div>
        `;
        return;
    }

    gridContainer.innerHTML = filtered.map(product => {
        const displayPrice = convertPrice(product.price);
        const currencySymbol = getCurrencySymbol();
        const categoryClass = product.category === 'مستعمل' ? 'used-badge' : '';

        // Title and Description English fallback
        const title = (currentLang === 'en' && product.title_en) ? product.title_en : product.title;
        const description = (currentLang === 'en' && product.description_en) ? product.description_en : product.description;

        // Translate Category Badge
        let catBadge = product.category;
        if (currentLang === 'en') {
            if (product.category === 'جديد') catBadge = 'New';
            else if (product.category === 'مستعمل') catBadge = 'Used';
            else if (product.category === 'إكسسوارات') catBadge = 'Accessories';
            else if (product.category === 'تجميعات') catBadge = 'Builds';
            else if (product.category === 'شاشات') catBadge = 'Monitors';
            else if (product.category === 'طاولات وكراسي') catBadge = 'Gaming Furniture';
            else if (product.category === 'لابتوبات') catBadge = 'Laptops';
        }

        // Stock labels and visual status
        let stockHtml = '';
        let addBtnDisabled = '';
        const currentInCart = getProductQuantityInCart(product.id);
        const availableStock = (product.stock ?? 5) - currentInCart;

        if ((product.stock ?? 5) <= 0) {
            stockHtml = `<span style="font-size: 0.75rem; color: #ef4444; font-weight: 700; display: block; margin-top: 4px;"><i class="fa-solid fa-triangle-exclamation"></i> ${i18n[currentLang].stock_empty}</span>`;
            addBtnDisabled = 'disabled style="opacity: 0.5; border-color: #ef4444; color: #ef4444;"';
        } else if (availableStock <= 0) {
            stockHtml = `<span style="font-size: 0.75rem; color: #f59e0b; font-weight: 700; display: block; margin-top: 4px;"><i class="fa-solid fa-cart-shopping"></i> ${i18n[currentLang].stock_max_cart}</span>`;
            addBtnDisabled = 'disabled style="opacity: 0.5; border-color: #f59e0b; color: #f59e0b;"';
        } else if ((product.stock ?? 5) <= 2) {
            stockHtml = `<span style="font-size: 0.75rem; color: #ef4444; font-weight: 700; display: block; margin-top: 4px;"><i class="fa-solid fa-fire"></i> ${i18n[currentLang].stock_only_two}</span>`;
        } else {
            stockHtml = `<span style="font-size: 0.75rem; color: #10b981; font-weight: 700; display: block; margin-top: 4px;"><i class="fa-solid fa-circle-check"></i> ${i18n[currentLang].stock_available.replace('{stock}', product.stock)}</span>`;
        }

        const addToCartTitle = i18n[currentLang].add_to_cart_title;

        return `
            <div class="product-card">
                <span class="product-category ${categoryClass}">${catBadge}</span>
                <div class="product-img-container">
                    <img src="${product.image || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop&q=80'}" alt="${title}" class="product-img" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${title}</h3>
                    <div class="product-description">${description || ''}</div>
                    ${stockHtml}
                    <div class="product-footer">
                        <div class="product-price">
                            ${displayPrice.toLocaleString()} <span>${currencySymbol}</span>
                        </div>
                        <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${addBtnDisabled} title="${addToCartTitle}">
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
    renderCategories();
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
        alert(currentLang === 'en' ? "Sorry, cannot add more. The available stock has been reached." : "عذراً، لا يمكن إضافة المزيد. لقد استنفدت الكمية المتوفرة في المخزن لهذا المنتج.");
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
        alert(currentLang === 'en' ? "Sorry, maximum available stock has been reached." : "عذراً، تم الوصول للحد الأقصى للكمية المتوفرة في المخزن.");
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
        alert(currentLang === 'en' ? "Please enter a coupon code first." : "يرجى إدخال رمز الكوبون أولاً.");
        return;
    }

    // Dynamic Coupons Check
    if (!settings.coupons) settings.coupons = [];
    const coupon = settings.coupons.find(c => c.code === code);

    if (coupon) {
        // Expiry check
        if (coupon.expiryDate) {
            const exp = new Date(coupon.expiryDate);
            const today = new Date();
            today.setHours(0,0,0,0);
            if (today > exp) {
                alert(currentLang === 'en' ? "This promo code has expired." : "كود الخصم هذا منتهي الصلاحية.");
                discountRate = 0;
                activePromoCode = "";
                updateCartUI();
                return;
            }
        }

        // Limit check
        if (coupon.usageLimit && coupon.usageLimit > 0 && (coupon.usageCount || 0) >= coupon.usageLimit) {
            alert(currentLang === 'en' ? "This promo code has reached its usage limit." : "لقد استنفد كود الخصم هذا الحد الأقصى للاستخدام.");
            discountRate = 0;
            activePromoCode = "";
            updateCartUI();
            return;
        }

        discountRate = coupon.discount / 100;
        activePromoCode = coupon.code;
        const msg = currentLang === 'en' 
            ? `Success! Promo code applied (${coupon.discount}% off).` 
            : `نجاح! تم تطبيق كود الخصم بنجاح (خصم ${coupon.discount}%).`;
        alert(msg);
    } else {
        alert(currentLang === 'en' ? "Invalid or expired coupon code." : "كوبون غير صالح أو منتهي الصلاحية.");
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
        const cartEmptyText = i18n[currentLang].cart_empty;
        itemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fa-solid fa-gamepad"></i>
                <p>${cartEmptyText}</p>
            </div>
        `;
        totalVal.innerText = `0 ${getCurrencySymbol()}`;
        checkoutBtn.disabled = true;
        document.getElementById('cart-discount-row').style.display = 'none';
        return;
    }

    checkoutBtn.disabled = false;
    
    const subtotalUSD = getCartTotalUSD();
    const discountUSD = Math.round(subtotalUSD * discountRate);
    const finalTotalUSD = Math.max(0, subtotalUSD - discountUSD);

    // Apply currency conversions
    const displayTotal = convertPrice(finalTotalUSD);
    const displayDiscount = convertPrice(discountUSD);
    const currencySymbol = getCurrencySymbol();
    
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
        const title = (currentLang === 'en' && item.product.title_en) ? item.product.title_en : item.product.title;
        const deleteBtnTitle = i18n[currentLang].delete_btn;
        return `
            <div class="cart-item">
                <img src="${item.product.image || 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=200&auto=format&fit=crop&q=80'}" alt="${title}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${title}</div>
                    <div class="cart-item-price">${convertPrice(item.product.price).toLocaleString()} ${getCurrencySymbol()}</div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="changeQuantity(${item.product.id}, -1)">-</button>
                        <span class="qty-val">${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.product.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart(${item.product.id})" title="${deleteBtnTitle}">
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
    const displayTotal = convertPrice(finalTotalUSD);
    const currencySymbol = getCurrencySymbol();
    
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
            const title = (currentLang === 'en' && item.product.title_en) ? item.product.title_en : item.product.title;
            const errorMsg = currentLang === 'en' ? 
                `Sorry, the requested quantity for (${title}) exceeds the available stock (${maxStock} units). Please edit your cart.` : 
                `عذراً، الكمية المطلوبة للمنتج (${title}) تفوق المخزون المتاح حالياً (${maxStock} قطع). يرجى تعديل السلة.`;
            alert(errorMsg);
            return;
        }
    }

    const name = document.getElementById('checkout-name').value;
    const phone = document.getElementById('checkout-phone').value;
    const city = document.getElementById('checkout-city').value;
    const address = document.getElementById('checkout-address').value;

    let paymentDetails = {};

    if (['bank', 'bcash', 'qurooshi', 'kuraimi'].includes(selectedPaymentMethod)) {
        paymentDetails = {
            hasReceipt: uploadedReceiptBase64 ? true : false,
            receiptImage: uploadedReceiptBase64
        };
    } else if (selectedPaymentMethod === 'card') {
        const cardNum = document.getElementById('card-number').value.replace(/\s+/g, '');
        if (cardNum.length < 15) {
            alert(currentLang === 'en' ? "Please enter a valid card number." : "يرجى إدخال رقم بطاقة صالح.");
            return;
        }
        const expiry = document.getElementById('card-expiry').value;
        if (expiry.length < 5) {
            alert(currentLang === 'en' ? "Please enter a valid card expiry date." : "يرجى إدخال تاريخ انتهاء صالح.");
            return;
        }
        const cvv = document.getElementById('card-cvv').value;
        if (cvv.length < 3) {
            alert(currentLang === 'en' ? "Please enter a valid CVV security code." : "يرجى إدخال رمز الأمان CVV.");
            return;
        }

        paymentDetails = {
            cardSuffix: cardNum.slice(-4),
            holderName: document.getElementById('card-holder').value
        };
    }

    const finalTotalUSD = getFinalCartTotalUSD();
    const displayTotal = convertPrice(finalTotalUSD);

    const orderId = Math.floor(100000 + Math.random() * 900000);
    const orderData = {
        id: orderId,
        customerName: name,
        customerPhone: phone,
        customerCity: city,
        customerAddress: address,
        items: cart.map(item => {
            const itemPrice = convertPrice(item.product.price);
            const title = (currentLang === 'en' && item.product.title_en) ? item.product.title_en : item.product.title;
            return {
                id: item.product.id,
                title: title,
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
    submitBtn.innerHTML = currentLang === 'en' ? `<i class="fa-solid fa-spinner fa-spin"></i> Submitting order...` : `<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال الطلب...`;

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
            
            // If a promo code was used, increment its usage count in settings on the server
            if (activePromoCode) {
                try {
                    // Fetch latest settings from server to avoid race conditions
                    const freshSettings = await apiGet('/api/settings', 'local_settings', settings);
                    if (freshSettings && freshSettings.coupons) {
                        const coupon = freshSettings.coupons.find(c => c.code === activePromoCode);
                        if (coupon) {
                            coupon.usageCount = (coupon.usageCount || 0) + 1;
                            await apiPost('/api/settings', 'local_settings', freshSettings);
                            settings = freshSettings; // update global settings object
                        }
                    }
                } catch (err) {
                    console.error("Failed to increment coupon usage:", err);
                }
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
            
            const successDesc = document.getElementById('success-desc-container');
            if (successDesc) {
                successDesc.innerHTML = i18n[currentLang].success_desc_tmpl.replace('{id}', orderId);
            }
            
            // Switch views
            document.getElementById('checkout-form-body').style.display = 'none';
            document.getElementById('checkout-success-body').style.display = 'block';
        } else {
            alert(currentLang === 'en' ? "Sorry, failed to submit the order. Please try again." : "عذراً، فشل إرسال الطلب. يرجى المحاولة مجدداً.");
        }
    } catch (e) {
        console.error("Order submit failed:", e);
        alert(currentLang === 'en' ? "An unexpected error occurred. Please try again." : "حدث خطأ غير متوقع أثناء إرسال الطلب.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ` + (currentLang === 'en' ? "Confirm Order & Pay" : "تأكيد الطلب والدفع");
    }
}
