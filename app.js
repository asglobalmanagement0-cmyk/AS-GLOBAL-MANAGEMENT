/* =========================================================================
   AS GLOBAL MANAGEMENT — FULL SECURE & CONNECTED ENGINE
   ========================================================================= */

// 1. FIREBASE CONFIGURATION (as-global-management)
const firebaseConfig = {
  apiKey: "AIzaSyCjhGH7znnOF6QV_EmRVOxfVUbJLe6E8hI",
  authDomain: "as-global-management.firebaseapp.com",
  projectId: "as-global-management",
  storageBucket: "as-global-management.firebasestorage.app",
  messagingSenderId: "733475933170",
  appId: "1:733475933170:web:41c763502d6adc5ddaf96b",
  measurementId: "G-WPVH9WWR22"
};

let db = null;
if (typeof firebase !== "undefined") {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
  } catch (e) {
    console.error("Firebase init:", e);
  }
}

// 2. CONSTANTS & SERVICES DATA
const GOOGLE_SHEET_WEBHOOK_URL = "";
const CART_STORAGE_KEY = "asgm_cart_v18";
const BOOKINGS_STORAGE_KEY = "asgm_bookings_v18";
const SYNC_QUEUE_KEY = "asgm_sync_queue_v4";

const BHK_MULTIPLIERS = {
  "1bhk": 1.0,
  "2bhk": 1.25,
  "3bhk": 1.55,
  "villa": 2.1,
  "commercial": 2.4
};

const SERVICES = [
  {
    id: "cockroach",
    name: "Cockroach Gel Treatment",
    glyph: "🪳",
    desc: "Odorless Bayer Maxforce gel dots applied along modular kitchens, hinges, and appliances. No need to empty cupboards.",
    basePrice: 799,
    rating: 4.9,
    chips: ["Odorless Gel", "Kitchen-Safe", "Child & Pet Safe"],
    protocol: "Targeted application of Fipronil micro-gel dots on cabinet hinges, refrigerator compressors, electrical channels, and drain edges.",
    safety: "100% non-toxic to humans and animals. Safe around food items and utensils.",
    warranty: "30-Day Zero-Infestation Guarantee. Complimentary re-application if roaches are sighted.",
    prep: "No preparation required. You do not need to empty kitchen cabinets or vacate premises."
  },
  {
    id: "termite",
    name: "Termite Drill & Injection",
    glyph: "🐜",
    desc: "Deep chemical barrier drill-and-inject technology preserving wooden door frames, flooring, and wardrobes.",
    basePrice: 2499,
    rating: 4.9,
    chips: ["Drill & Inject", "Written Warranty", "Wall Barrier"],
    protocol: "12mm holes precision-drilled along skirting and door posts. Pressurized termiticide injection followed by color-matched sealing.",
    safety: "Odorless synthetic barrier formulation approved for indoor residential usage.",
    warranty: "1-Year Written Warranty for targeted drilling sites.",
    prep: "Provide 2 feet of clear access to affected walls, wooden frames, and wardrobes."
  },
  {
    id: "bedbugs",
    name: "Bed Bug Steam Extermination",
    glyph: "🛏️",
    desc: "Comprehensive 2-visit high temperature dry steam + residual contact kill across mattresses, seams, and headboards.",
    basePrice: 1599,
    rating: 4.8,
    chips: ["2 Visits Included", "Dry Steam", "Mattress Safe"],
    protocol: "180°C superheated dry steam to eliminate bed bug eggs on contact, followed by odorless deltamethrin micro-mist.",
    safety: "Targeted localized treatment. Mattresses are completely safe for sleeping within 3 hours.",
    warranty: "Includes mandatory day-15 follow-up inspection and treatment.",
    prep: "Remove bedsheets and pillow covers for high-heat laundry washing."
  },
  {
    id: "rodent",
    name: "Rodent Control & Exclusion",
    glyph: "🐀",
    desc: "Smart tamper-resistant bait stations, industrial glue boards, and structural entry-point exclusion for rats and mice.",
    basePrice: 1199,
    rating: 4.7,
    chips: ["Smart Baits", "Entry Sealing", "Trapping"],
    protocol: "Anticoagulant bait blocks secured inside lockable tamper-proof stations along perimeter runs and false ceilings.",
    safety: "Tamper-resistant bait stations prevent accidental access by children or household pets.",
    warranty: "30-Day Rodent Density Reduction Guarantee.",
    prep: "Keep utility and plumbing access shafts accessible for technicians."
  },
  {
    id: "mosquito",
    name: "Mosquito Fogging & Larvicide",
    glyph: "🦟",
    desc: "Thermal outdoor fogging + anti-larval chemical treatment for gardens, terraces, parking lots, and societies.",
    basePrice: 999,
    rating: 4.8,
    chips: ["Thermal Fog", "Anti-Larval", "Society Bulk"],
    protocol: "Outdoor thermal pulse-jet fogging combined with Bacillus thuringiensis israelensis (BTI) microbial larvicide.",
    safety: "Outdoor application only. WHO-approved public health standard chemical blend.",
    warranty: "Immediate adult swarm eradication on day of service.",
    prep: "Close external balcony doors and windows during active fogging operations."
  },
  {
    id: "ants",
    name: "General Pest Control",
    glyph: "🕸️",
    desc: "Residual perimeter spray covering red and black ants, spiders, silverfish, and crawling domestic insects.",
    basePrice: 899,
    rating: 4.7,
    chips: ["Perimeter Spray", "Ants & Spiders", "Long-Lasting"],
    protocol: "Odorless synthetic pyrethroid perimeter barrier spray along skirting boards, door thresholds, and window channels.",
    safety: "CIB-registered non-hazardous chemical. Quick drying within 20 minutes.",
    warranty: "30-Day General Crawling Insect Barrier Warranty.",
    prep: "Ensure room corners and baseboards are swept clear."
  },
  {
    id: "woodborer",
    name: "Wood Borer Micro-Injection",
    glyph: "🪵",
    desc: "Specialized petroleum-based solvent injection into powder-falling pinholes to eradicate wood-boring beetle larvae.",
    basePrice: 1399,
    rating: 4.8,
    chips: ["Syringe Injection", "Preserves Wood", "Deep Penetration"],
    protocol: "Targeted syringe micro-injection of wood preservative directly into active frass-producing pinholes.",
    safety: "Localized syringe application avoids chemical exposure to ambient room air.",
    warranty: "60-Day Wood Borer Larvae Warranty.",
    prep: "Wipe down furniture surface to reveal active pinholes."
  },
  {
    id: "disinfection",
    name: "Disinfection & Sanitization",
    glyph: "🧴",
    desc: "Hospital-grade ULV ultra-low volume cold misting eradicating 99.99% of pathogenic viruses and bacteria.",
    basePrice: 1299,
    rating: 4.9,
    chips: ["Hospital Grade", "99.99% Kill", "Safe Mist"],
    protocol: "Ultra-low volume atomization of quaternary ammonium formulation covering touch points and workstations.",
    safety: "EPA-registered hospital disinfectant. Biodegradable and leaves no sticky residue.",
    warranty: "Certified laboratory standard pathogen kill on application.",
    prep: "Cover exposed food items and raw paper files."
  }
];

const AVAILABLE_SLOTS = [
  { label: "⚡ Emergency Window (Within 90 mins)", cutoffHour: 19 },
  { label: "08:00 AM – 11:00 AM", cutoffHour: 11 },
  { label: "11:00 AM – 02:00 PM", cutoffHour: 14 },
  { label: "02:00 PM – 05:00 PM", cutoffHour: 17 },
  { label: "05:00 PM – 08:00 PM", cutoffHour: 20 }
];

// 3. STATE AND HELPERS
let currentBHK = "1bhk";
let customPricingMap = {};
let latestBooking = null;
let portalRecords = [];
let activeView = "home";
let isSubmitting = false;
let isCommercialSubmitting = false;
let clickCount = 0;
let clickTimer = null;
let toastTimer = null;

function readStorageJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && typeof parsed === "object" ? parsed : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeStorageJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Storage write skipped:", e);
  }
}

function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn("Storage remove skipped:", e);
  }
}

function loadSavedCart() {
  const parsed = readStorageJSON(CART_STORAGE_KEY, []);
  if (!Array.isArray(parsed)) return [];
  const validIds = new Set(SERVICES.map((s) => s.id));
  return parsed.filter((item) => item && typeof item.id === "string" && validIds.has(item.id));
}

let cart = loadSavedCart();

const $ = (id) => document.getElementById(id);
const fmt = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

function esc(str) {
  return String(str || "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

function cleanPhone(val) {
  if (!val) return "";
  let digits = String(val).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
}

function isValidIndianPhone(val) {
  const clean = cleanPhone(val);
  return /^[6-9]\d{9}$/.test(clean);
}

function formatLocalDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatReadableDate(dateStr) {
  if (!dateStr) return "";
  const parts = String(dateStr).split("-");
  if (parts.length === 3) {
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return Number.isNaN(d.getTime()) ? String(dateStr) : d.toDateString();
  }
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? String(dateStr) : d.toDateString();
}

function withTimeout(promise, ms = 6000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), ms)
    )
  ]);
}

async function postToSheetWithTimeout(payload, ms = 6000) {
  if (!GOOGLE_SHEET_WEBHOOK_URL) return;
  if (!navigator.onLine) throw new Error("Offline");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timer);
  }
}

function getServicePrice(serviceOrItem) {
  const id = serviceOrItem.id;
  if (
    customPricingMap[id] &&
    customPricingMap[id][currentBHK] !== undefined &&
    customPricingMap[id][currentBHK] !== ""
  ) {
    return Number(customPricingMap[id][currentBHK]);
  }
  const base = Number(serviceOrItem.basePrice || 0);
  const mult = BHK_MULTIPLIERS[currentBHK] || 1.0;
  return Math.round((base * mult) / 10) * 10;
}

function initLivePricing() {
  if (!db) return;
  db.collection("settings").doc("service_prices").onSnapshot(
    (doc) => {
      if (doc.exists && doc.data() && doc.data().prices) {
        customPricingMap = doc.data().prices;
        renderServiceCards();
        renderCart();
        updateStickyBar();
      }
    },
    (err) => {
      console.warn("Live pricing sync skipped:", err.message);
    }
  );
}

function toast(msg) {
  const t = $("toast");
  if (!t) return;
  clearTimeout(toastTimer);
  t.textContent = msg;
  t.classList.add("show");
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

// 4. NAVIGATION & HISTORY SYNC
function hideModalUI(el) {
  if (!el) return;
  el.classList.remove("show");
  document.body.style.overflow = "";
}

function hideMobileDrawerUI() {
  const drawer = $("mobile-drawer");
  const overlay = $("drawer-overlay");
  const toggle = $("menu-toggle");
  if (drawer) drawer.classList.remove("open");
  if (overlay) overlay.classList.remove("active");
  if (toggle) toggle.classList.remove("open");
  document.body.style.overflow = "";
}

window.addEventListener("popstate", () => {
  const openModalEl = document.querySelector(".modal-overlay.show:not(#loading-modal)");
  if (openModalEl) {
    hideModalUI(openModalEl);
    return;
  }
  const drawer = $("mobile-drawer");
  if (drawer && drawer.classList.contains("open")) {
    hideMobileDrawerUI();
  }
});

function toggleMobileMenu() {
  const drawer = $("mobile-drawer");
  const overlay = $("drawer-overlay");
  const toggle = $("menu-toggle");
  if (!drawer || !overlay || !toggle) return;

  if (drawer.classList.contains("open")) {
    closeMobileMenu();
  } else {
    drawer.classList.add("open");
    overlay.classList.add("active");
    toggle.classList.add("open");
    document.body.style.overflow = "hidden";
    history.pushState({ drawer: true }, "");
  }
}

function closeMobileMenu(skipHistory = false) {
  const drawer = $("mobile-drawer");
  const wasOpen = drawer && drawer.classList.contains("open");
  hideMobileDrawerUI();
  if (!skipHistory && wasOpen && history.state && history.state.drawer) {
    history.back();
  }
}

function goFromDrawer(viewId) {
  closeMobileMenu(true);
  go(viewId);
}

function go(viewId) {
  activeView = viewId;
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("show"));
  const target = $("view-" + viewId);
  if (target) target.classList.add("show");

  document.querySelectorAll(".desktop-nav .nav-link").forEach((b) => b.classList.remove("active"));
  const navBtn = $("nav-" + viewId);
  if (navBtn) navBtn.classList.add("active");

  document.querySelectorAll(".mobile-nav-list button").forEach((b) => b.classList.remove("active"));
  const mNavBtn = $("mnav-" + viewId);
  if (mNavBtn) mNavBtn.classList.add("active");

  if (viewId === "book") {
    renderCart();
    refreshSlots();
  }
  updateStickyBar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startNewBooking() {
  go("services");
}

function setBHK(bhkKey, btnEl) {
  currentBHK = bhkKey;
  document.querySelectorAll(".bhk-btn").forEach((b) => {
    const onclickAttr = b.getAttribute("onclick") || "";
    b.classList.toggle(
      "active",
      onclickAttr.toLowerCase().includes(`'${bhkKey.toLowerCase()}'`)
    );
  });
  if (btnEl) btnEl.classList.add("active");

  renderServiceCards();
  renderCart();
  updateStickyBar();
  toast(`Pricing updated for ${bhkKey.toUpperCase()} configuration`);
}

// 5. SERVICE CARDS & CART
function createServiceCardHTML(s) {
  const inCart = cart.some((item) => item.id === s.id);
  const price = getServicePrice(s);
  const chipsHTML = s.chips.map((c) => `<span class="chip">${c}</span>`).join("");

  return `
    <div class="card ${inCart ? "selected" : ""}" id="card-${s.id}">
      <div class="card-body">
        <div class="card-header-row">
          <div class="card-glyph-tag">${s.glyph}</div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
            <span class="card-badge">★ ${s.rating}</span>
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--primary);">30-Day Guarantee</span>
          </div>
        </div>
        <h3>${s.name}</h3>
        <p>${s.desc}</p>
        <div class="chips">${chipsHTML}</div>
        <div class="card-foot">
          <div class="price-tag">${fmt(price)} <small>/ ${currentBHK.toUpperCase()}</small></div>
          <div class="card-actions">
            <button type="button" class="detail-link" onclick="openServiceModal('${s.id}')">Info</button>
            <button type="button" class="action-btn ${inCart ? "added" : ""}" onclick="toggleCart('${s.id}')">
              ${inCart ? "✓ Added" : "+ Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderServiceCards() {
  const homeContainer = $("home-services-grid");
  const catalogContainer = $("catalog-services-grid");

  if (homeContainer) {
    homeContainer.innerHTML = SERVICES.slice(0, 4).map(createServiceCardHTML).join("");
  }
  if (catalogContainer) {
    catalogContainer.innerHTML = SERVICES.map(createServiceCardHTML).join("");
  }
}

function toggleCart(serviceId) {
  const existingIndex = cart.findIndex((item) => item.id === serviceId);

  if (existingIndex > -1) {
    cart = cart.filter((item) => item.id !== serviceId);
    toast("Treatment removed");
  } else {
    const s = SERVICES.find((item) => item.id === serviceId);
    if (!s) return;
    cart.push({ id: s.id, name: s.name, basePrice: s.basePrice });
    toast("✓ Treatment added to booking");
  }

  writeStorageJSON(CART_STORAGE_KEY, cart);
  renderServiceCards();
  renderCart();
  updateStickyBar();
}

function renderCart() {
  const count = cart.length;
  const bDesktop = $("cart-badge");
  const bMobile = $("cart-badge-m");
  if (bDesktop) bDesktop.textContent = count;
  if (bMobile) bMobile.textContent = count;

  const container = $("cart-container");
  const totalRow = $("cart-total-row");
  const submitBtn = $("submit-btn");
  if (!container) return;

  if (count === 0) {
    container.innerHTML = `
      <div style="padding: 24px 16px; text-align: center; color: var(--slate-600); background: var(--primary-light); border: 1.5px dashed var(--accent); border-radius: 14px; font-size: 0.9rem;">
        <b>⚠ No Treatment Selected Yet</b>
        <p style="font-size: 0.8rem; margin: 6px 0 12px; color: #92400e;">Please choose at least one pest eradication service.</p>
        <button type="button" class="btn" style="padding: 8px 16px; font-size: 0.84rem; min-height: 40px;" onclick="go('services')">👉 Select a Treatment (+ Add)</button>
      </div>
    `;
    if (totalRow) totalRow.style.display = "none";
    if (submitBtn) {
      submitBtn.textContent = "Select a Treatment First (+ Add)";
      submitBtn.disabled = true;
    }
    return;
  }

  if (submitBtn && !isSubmitting) {
    submitBtn.textContent = "Confirm Service Visit (Pay Post-Service) ✔";
    submitBtn.disabled = false;
  }

  container.innerHTML = cart.map((item) => {
    const itemPrice = getServicePrice(item);
    return `
      <div class="cart-item">
        <div>
          <span class="cart-item-title">${esc(item.name)}</span>
          <span class="cart-item-subtitle">${currentBHK.toUpperCase()} · 30-Day Written Warranty</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <b style="font-size: 0.95rem;">${fmt(itemPrice)}</b>
          <button type="button" class="cart-item-remove" onclick="toggleCart('${item.id}')" aria-label="Remove ${esc(item.name)}">✕</button>
        </div>
      </div>
    `;
  }).join("");

  const grandTotal = cart.reduce((sum, item) => sum + getServicePrice(item), 0);
  const totalVal = $("cart-total-val");
  if (totalVal) totalVal.textContent = fmt(grandTotal);
  if (totalRow) totalRow.style.display = "flex";
}

function updateStickyBar() {
  const bar = $("sticky-bar");
  if (!bar) return;

  if (cart.length === 0 || activeView === "book" || activeView === "success") {
    bar.classList.remove("show");
    return;
  }

  const total = cart.reduce((sum, item) => sum + getServicePrice(item), 0);
  const sbCount = $("sb-count");
  const sbTotal = $("sb-total");
  if (sbCount) sbCount.textContent = `${cart.length} Treatment${cart.length > 1 ? "s" : ""}`;
  if (sbTotal) sbTotal.textContent = fmt(total);
  bar.classList.add("show");
}

// 6. MODALS
function openModal(id, trackHistory = true) {
  const el = $(id);
  if (el) {
    const alreadyOpen = el.classList.contains("show");
    el.classList.add("show");
    document.body.style.overflow = "hidden";
    if (trackHistory && !alreadyOpen) {
      history.pushState({ modalId: id }, "");
    }
  }
}

function closeModal(id, skipHistory = false) {
  const el = $(id);
  if (el) {
    const wasOpen = el.classList.contains("show");
    hideModalUI(el);
    if (!skipHistory && wasOpen && history.state && history.state.modalId === id) {
      history.back();
    }
  }
}

function openServiceModal(id) {
  const s = SERVICES.find((item) => item.id === id);
  if (!s) return;

  $("modal-service-title").textContent = s.name;
  $("modal-service-body").innerHTML = `
    <div style="font-size: 0.9rem; line-height: 1.7; color: var(--slate-700);">
      <p style="margin-bottom: 12px;">${s.desc}</p>
      <div style="background: var(--primary-light); padding: 12px; border-radius: 12px; margin-bottom: 10px;">
        <b style="color: var(--primary); display: block;">🔬 Treatment Process:</b>
        ${s.protocol}
      </div>
      <div style="background: var(--primary-light); padding: 12px; border-radius: 12px; margin-bottom: 10px;">
        <b style="color: var(--primary); display: block;">🛡️ Safety Information:</b>
        ${s.safety}
      </div>
      <div style="background: var(--primary-light); padding: 12px; border-radius: 12px;">
        <b style="color: #92400e; display: block;">📜 Warranty &amp; Prep:</b>
        ${s.warranty}<br>
        <span style="font-size: 0.8rem; color: #78350f;">${s.prep}</span>
      </div>
    </div>
  `;

  const addBtn = $("modal-service-add-btn");
  const inCart = cart.some((item) => item.id === s.id);
  addBtn.textContent = inCart ? "Remove from Booking" : "Add to Booking";
  addBtn.onclick = () => {
    toggleCart(s.id);
    closeModal("service-modal");
  };
  openModal("service-modal");
}

// 7. FORM VALIDATION
function validateLive(fieldId, isValid) {
  const el = $(fieldId);
  if (!el) return;
  el.classList.toggle("valid", isValid);
  el.classList.toggle("invalid", !isValid);
}

function validatePhoneLive(input) {
  validateLive("f-phone", isValidIndianPhone(input.value));
}

// 8. REAL-TIME SLOTS
async function getBookedSlotsForDate(dateVal) {
  const bookedSlots = new Set();

  if (db && dateVal) {
    try {
      const snap = await withTimeout(
        db.collection("bookings").where("date", "==", dateVal).get(),
        4500
      );
      snap.forEach((doc) => {
        const data = doc.data();
        if (data && data.slot && data.status !== "Cancelled") {
          bookedSlots.add(data.slot);
        }
      });
    } catch (err) {
      console.warn("Could not query Firebase slots:", err);
    }
  }

  const localBookings = readStorageJSON(BOOKINGS_STORAGE_KEY, []);
  if (Array.isArray(localBookings)) {
    localBookings.forEach((b) => {
      if (b && b.date === dateVal && b.slot && b.status !== "Cancelled") {
        bookedSlots.add(b.slot);
      }
    });
  }

  return bookedSlots;
}

async function refreshSlots(silent = false) {
  const dateInput = $("in-date");
  const slotSelect = $("in-slot");
  if (!dateInput || !slotSelect) return;

  const dateVal = dateInput.value;
  if (!dateVal) return;

  const prevSelectedSlot = slotSelect.value;
  slotSelect.innerHTML = '<option value="">Checking slot availability…</option>';

  const bookedSlots = await getBookedSlotsForDate(dateVal);

  // Prevent stale async responses from overwriting a newly chosen date
  if (dateInput.value !== dateVal) return;

  const now = new Date();
  const todayStr = formatLocalDate(now);
  const isToday = dateVal === todayStr;
  const currentHour = now.getHours();

  slotSelect.innerHTML = '<option value="">Select available slot…</option>';
  let availableCount = 0;

  AVAILABLE_SLOTS.forEach((slot) => {
    const isPassed = isToday && currentHour >= slot.cutoffHour;
    const isBooked = bookedSlots.has(slot.label);

    const opt = document.createElement("option");
    opt.value = slot.label;

    if (isBooked) {
      opt.textContent = `❌ ${slot.label} (Booked / Unavailable)`;
      opt.disabled = true;
    } else if (isPassed) {
      opt.textContent = `⏰ ${slot.label} (Window Passed)`;
      opt.disabled = true;
    } else {
      opt.textContent = `✓ ${slot.label}`;
      if (prevSelectedSlot === slot.label) opt.selected = true;
      availableCount++;
    }
    slotSelect.appendChild(opt);
  });

  if (availableCount === 0 && !silent && activeView === "book") {
    toast(`All slots booked for ${dateVal}. Please select another date.`);
  }
}

function selectQuickDate(offsetDays, btn, silent = false) {
  document.querySelectorAll(".qdate-pill").forEach((p) => p.classList.remove("active"));
  if (btn) btn.classList.add("active");
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const dateInput = $("in-date");
  if (dateInput) {
    dateInput.value = formatLocalDate(d);
    validateLive("f-date", true);
    refreshSlots(silent);
  }
}

function handleDateChange() {
  document.querySelectorAll(".qdate-pill").forEach((p) => p.classList.remove("active"));
  const dateInput = $("in-date");
  if (dateInput) {
    validateLive("f-date", Boolean(dateInput.value) && dateInput.value >= dateInput.min);
    refreshSlots();
  }
}

function validateBookingForm() {
  const nameOk = $("in-name").value.trim().length >= 2;
  const phoneOk = isValidIndianPhone($("in-phone").value);
  const addressOk = $("in-address").value.trim().length >= 8;
  const dateInput = $("in-date");
  const dateOk = dateInput.value !== "" && dateInput.value >= dateInput.min;
  const slotOk = $("in-slot").value !== "";

  validateLive("f-name", nameOk);
  validateLive("f-phone", phoneOk);
  validateLive("f-address", addressOk);
  validateLive("f-date", dateOk);
  validateLive("f-slot", slotOk);

  if (!nameOk) { toast("Please enter your full name."); return false; }
  if (!phoneOk) { toast("Please enter a valid 10-digit Indian mobile number."); return false; }
  if (!addressOk) { toast("Please enter your street address & flat number."); return false; }
  if (!dateOk || !slotOk) { toast("Please select a valid date and available slot."); return false; }

  return true;
}

// 9. BOOKING SUBMISSION
async function syncOfflineQueue() {
  if (!GOOGLE_SHEET_WEBHOOK_URL || !navigator.onLine) return;
  const queue = readStorageJSON(SYNC_QUEUE_KEY, []);
  if (!Array.isArray(queue) || !queue.length) return;

  const remaining = [];
  for (const item of queue) {
    try {
      await postToSheetWithTimeout(item, 6000);
    } catch (err) {
      remaining.push(item);
    }
  }
  writeStorageJSON(SYNC_QUEUE_KEY, remaining);
}
window.addEventListener("online", syncOfflineQueue);

async function handleBookingSubmission(e) {
  e.preventDefault();
  if (isSubmitting) return;

  if (cart.length === 0) {
    toast("⚠ Please add at least one treatment before checkout.");
    go("services");
    return;
  }

  if (!validateBookingForm()) return;

  const chosenDate = $("in-date").value;
  const chosenSlot = $("in-slot").value;

  isSubmitting = true;
  const submitBtn = $("submit-btn");
  submitBtn.disabled = true;

  openModal("loading-modal", false);

  try {
    if (!db) {
      throw new Error("Firebase is not initialized.");
    }

    // Re-check slot availability right before saving to prevent double-booking
    const latestBookedSlots = await getBookedSlotsForDate(chosenDate);
    if (latestBookedSlots.has(chosenSlot)) {
      closeModal("loading-modal", true);
      await refreshSlots();
      toast("⚠ That arrival slot was just booked. Please select another slot.");
      return;
    }

    const total = cart.reduce((sum, item) => sum + getServicePrice(item), 0);
    const serviceNames = cart.map((item) => item.name).join(", ");
    const ref = "ASM-" + Math.floor(100000 + Math.random() * 900000);
    const sanitizedPhone = cleanPhone($("in-phone").value);

    const booking = {
      ref: ref,
      name: $("in-name").value.trim(),
      phone: sanitizedPhone,
      type: currentBHK.toUpperCase(),
      address: $("in-address").value.trim(),
      date: chosenDate,
      slot: chosenSlot,
      notes: $("in-notes").value.trim(),
      services: serviceNames,
      total: total,
      status: "Confirmed",
      placed: new Date().toLocaleDateString("en-IN"),
      createdAtMs: Date.now()
    };

    await withTimeout(db.collection("bookings").doc(ref).set({
      ...booking,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }), 7000);

    if (GOOGLE_SHEET_WEBHOOK_URL) {
      try {
        await postToSheetWithTimeout(booking, 6000);
      } catch (sheetErr) {
        console.warn("Sheet sync queued:", sheetErr);
        const queue = readStorageJSON(SYNC_QUEUE_KEY, []);
        if (Array.isArray(queue)) {
          queue.push(booking);
          writeStorageJSON(SYNC_QUEUE_KEY, queue);
        }
      }
    }

    const bookings = readStorageJSON(BOOKINGS_STORAGE_KEY, []);
    const updatedBookings = Array.isArray(bookings) ? bookings : [];
    updatedBookings.unshift(booking);
    writeStorageJSON(BOOKINGS_STORAGE_KEY, updatedBookings);
    latestBooking = booking;

    cart = [];
    removeStorageItem(CART_STORAGE_KEY);
    $("booking-form").reset();
    document.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
    initDateInputs(true);

    renderServiceCards();
    renderCart();
    updateStickyBar();

    $("success-ref").textContent = ref;
    $("success-details").innerHTML = `
      Thank you <b>${esc(booking.name)}</b>. Your appointment for <b>${esc(booking.services)}</b> has been booked for
      <b>${formatReadableDate(booking.date)}</b> (${esc(booking.slot)}).<br>
      Payable amount: <b>${fmt(booking.total)}</b> upon inspection.
    `;

    closeModal("loading-modal", true);
    go("success");
  } catch (err) {
    console.error("Booking save failed:", err);
    closeModal("loading-modal", true);
    toast("Could not save booking (" + (err.code || err.message) + "). Please try again.");
  } finally {
    isSubmitting = false;
    if (cart.length > 0 && submitBtn) {
      submitBtn.disabled = false;
    }
  }
}

// 10. PORTAL LOOKUP
async function handlePortalLookup(e) {
  e.preventDefault();
  const inputVal = $("portal-input").value.trim();
  const container = $("portal-results");

  const isRefSearch = /^ASM-/i.test(inputVal);
  const cleanedQuery = isRefSearch ? inputVal.toUpperCase() : cleanPhone(inputVal);

  if (isRefSearch && cleanedQuery.length < 6) {
    toast("Please enter a valid booking reference code (e.g. ASM-123456).");
    return;
  }
  if (!isRefSearch && !isValidIndianPhone(cleanedQuery)) {
    toast("Please enter a valid 10-digit mobile number or ASM reference code.");
    return;
  }

  container.innerHTML = `<div class="panel" style="text-align:center;">Searching records...</div>`;

  let records = [];

  if (db) {
    try {
      const query = isRefSearch
        ? db.collection("bookings").where("ref", "==", cleanedQuery)
        : db.collection("bookings").where("phone", "==", cleanedQuery);
      const snapshot = await withTimeout(query.get(), 5000);
      snapshot.forEach((doc) => records.push(doc.data()));
    } catch (err) {
      console.warn("Fallback to local records:", err);
    }
  }

  const localBookings = readStorageJSON(BOOKINGS_STORAGE_KEY, []);
  if (Array.isArray(localBookings)) {
    const localFiltered = localBookings.filter((b) => {
      if (!b) return false;
      if (isRefSearch) return b.ref && b.ref.toUpperCase() === cleanedQuery;
      return b.phone && cleanPhone(b.phone) === cleanedQuery;
    });

    localFiltered.forEach((lb) => {
      if (!records.some((r) => r.ref === lb.ref)) records.push(lb);
    });
  }

  portalRecords = records;

  if (records.length === 0) {
    container.innerHTML = `
      <div class="panel" style="text-align: center; color: var(--slate-600);">
        No records found for <b>${esc(inputVal)}</b>.<br>
        Please check your mobile number or booking reference code.
      </div>
    `;
    return;
  }

  container.innerHTML = records.map((b) => `
    <div class="panel" style="margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
        <b>Booking Ref: <code style="color: var(--primary); font-weight: 800;">${esc(b.ref)}</code></b>
        <span style="font-size:0.75rem; font-weight:700; padding:3px 9px; border-radius:999px; background:var(--primary-light); color:var(--primary);">${esc(b.status)}</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; font-size: 0.86rem;">
        <div><span style="color: var(--slate-400); display: block; font-size: 0.72rem;">SERVICES</span><b>${esc(b.services)}</b></div>
        <div><span style="color: var(--slate-400); display: block; font-size: 0.72rem;">VISIT SLOT</span><b>${formatReadableDate(b.date)} (${esc(b.slot)})</b></div>
        <div><span style="color: var(--slate-400); display: block; font-size: 0.72rem;">AMOUNT</span><b>${fmt(b.total)} (Post-Service)</b></div>
      </div>
      <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--slate-100); display: flex; gap: 8px;">
        <button type="button" class="btn secondary" style="padding: 6px 14px; font-size: 0.8rem; min-height: 38px;" onclick="openPrintModalData('${esc(b.ref)}')">🖨️ Warranty Card</button>
      </div>
    </div>
  `).join("");
}

function copyBookingDetails() {
  const b = latestBooking;
  if (!b) return;

  const text = `*AS Global Management Booking*\nRef: ${b.ref}\nServices: ${b.services}\nDate: ${formatReadableDate(b.date)} (${b.slot})\nTotal: ${fmt(b.total)}\nStatus: Pay Post-Service with 30-Day Warranty`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => toast("✓ Booking details copied! Ready to paste into WhatsApp."))
      .catch(() => toast("Ref: " + b.ref));
  } else {
    toast("Ref: " + b.ref);
  }
}

async function handleCommercialInquiry(e) {
  e.preventDefault();
  if (isCommercialSubmitting) return;

  const org = $("comm-org").value.trim();
  const name = $("comm-name").value.trim();
  if (org.length < 2 || name.length < 2) {
    toast("Please enter your organization and contact name.");
    return;
  }
  if (!isValidIndianPhone($("comm-phone").value)) {
    toast("Please enter a valid 10-digit Indian mobile number.");
    return;
  }

  const inquiry = {
    org: org,
    name: name,
    phone: cleanPhone($("comm-phone").value),
    type: $("comm-type").value,
    notes: $("comm-notes").value.trim(),
    date: new Date().toLocaleDateString("en-IN"),
    createdAtMs: Date.now()
  };

  const btn = $("comm-submit-btn");
  isCommercialSubmitting = true;
  if (btn) btn.disabled = true;

  try {
    if (!db) throw new Error("Database unavailable");
    await withTimeout(db.collection("commercial_inquiries").add({
      ...inquiry,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }), 5000);

    toast("✓ Commercial site audit inquiry registered. Our team will contact you.");
    const form = $("comm-form");
    if (form) form.reset();
  } catch (err) {
    console.warn("Commercial inquiry error:", err);
    toast("⚠ Could not submit inquiry. Please check your connection and try again.");
  } finally {
    isCommercialSubmitting = false;
    if (btn) btn.disabled = false;
  }
}

function openPrintModalData(ref) {
  const bookings = readStorageJSON(BOOKINGS_STORAGE_KEY, []);
  const localMatch = Array.isArray(bookings) ? bookings.find((item) => item && item.ref === ref) : null;
  const b = portalRecords.find((item) => item && item.ref === ref) || localMatch;
  if (b) showPrintModal(b);
}

function openPrintModalCurrent() {
  if (latestBooking) showPrintModal(latestBooking);
}

function showPrintModal(b) {
  latestBooking = b;
  $("m-ref").textContent = b.ref;
  $("m-date").textContent = b.placed || new Date().toLocaleDateString("en-IN");
  $("m-name").textContent = b.name;
  $("m-phone").textContent = b.phone;
  $("m-address").textContent = `${b.type} — ${b.address}`;
  $("m-slot").textContent = `${formatReadableDate(b.date)} (${b.slot})`;
  $("m-services").textContent = b.services;
  $("m-total").textContent = fmt(b.total) + " (Pay Post-Service)";
  openModal("print-modal");
}

function handleLogoClick() {
  clearTimeout(clickTimer);
  clickCount++;
  if (clickCount >= 3) {
    clickCount = 0;
    window.location.href = "admin.html";
    return;
  }
  clickTimer = setTimeout(() => {
    clickCount = 0;
  }, 2000);
}

function initDateInputs(silent = true) {
  const now = new Date();
  const minDate = formatLocalDate(now);
  const dateInput = $("in-date");
  if (dateInput) dateInput.min = minDate;

  if (now.getHours() >= 20) {
    const todayBtn = $("btn-today");
    if (todayBtn) todayBtn.style.display = "none";
    selectQuickDate(1, $("btn-tmrw"), silent);
  } else {
    selectQuickDate(0, $("btn-today"), silent);
  }
}

// 11. RUN ON LOAD
window.addEventListener("DOMContentLoaded", () => {
  initLivePricing();
  initDateInputs(true);
  renderServiceCards();
  renderCart();
  syncOfflineQueue().catch(() => {});
  go("home");
});
