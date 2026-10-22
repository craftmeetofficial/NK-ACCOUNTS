/* ===== FIREBASE SETUP & LISTINGS ===== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXycN3dBMmSO2n3Dc2vQDmK_mOO3XJ22M",
  authDomain: "nk-accounts.firebaseapp.com",
  databaseURL: "https://nk-accounts-default-rtdb.firebaseio.com",
  projectId: "nk-accounts",
  storageBucket: "nk-accounts.firebasestorage.app",
  messagingSenderId: "647793698356",
  appId: "1:647793698356:web:3ee8a12ab0265f125b0c61",
  measurementId: "G-BKPP3B4LVB"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

let listings = [];
let currentCategory = "all";
let currentSearch = "";
let currentSort = "default";
let wishlist = JSON.parse(localStorage.getItem("nkWishlist") || "[]");

/* ===== DOM REFS ===== */
const listingsGrid = document.getElementById("listingsGrid");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const categoriesGrid = document.getElementById("categoriesGrid");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const modalOverlay = document.getElementById("modalOverlay");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const toast = document.getElementById("toast");
const contactForm = document.getElementById("contactForm");
const navbar = document.getElementById("navbar");
const googleLoginBtn = document.getElementById("googleLoginBtn");
const navAuthContainer = document.getElementById("navAuthContainer");

/* ===== FETCH LISTINGS FROM FIREBASE ===== */
const listingsRef = ref(database, 'listings');
onValue(listingsRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) {
    listings = [];
  } else {
    listings = Object.keys(data).map(key => ({ id: key, ...data[key] }));
  }
  setupCategories();
  renderListings();
});

/* ===== RENDER LISTINGS ===== */
function formatPrice(price) {
  return "LKR " + Number(price).toLocaleString("en-LK");
}

/* ===== CATEGORY FILTER SETUP (Strictly Only 'ALL' Tab) ===== */
function setupCategories() {
  if (!categoriesGrid) return;
  categoriesGrid.innerHTML = `
    <button class="category-btn active" data-category="all">
      ALL
    </button>
  `;
}

function getFilteredListings() {
  let result = [...listings];

  // Search filter
  if (currentSearch.trim()) {
    const q = currentSearch.toLowerCase().trim();
    result = result.filter(l =>
      (l.title && l.title.toLowerCase().includes(q)) ||
      (l.category && l.category.toLowerCase().includes(q)) ||
      (l.refId && l.refId.toLowerCase().includes(q)) ||
      (l.description && l.description.toLowerCase().includes(q))
    );
  }

  // Sorting
  switch (currentSort) {
    case "price-asc":
      result.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case "price-desc":
      result.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case "title-asc":
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
      break;
    case "title-desc":
      result.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
      break;
  }

  return result;
}

function renderListings() {
  const filtered = getFilteredListings();

  if (filtered.length === 0) {
    listingsGrid.innerHTML = "";
    noResults.hidden = false;
    return;
  }

  noResults.hidden = true;
  listingsGrid.innerHTML = filtered.map(item => {
    const inWishlist = wishlist.includes(item.id);
    return `
      <article class="listing-card reveal" data-id="${item.id}">
        <div class="listing-image">
          <span class="placeholder-icon">🛍️</span>
          ${item.featured ? '<span class="listing-badge">FEATURED</span>' : ""}
        </div>
        <div class="listing-body">
          <span class="listing-category">${item.category || 'Digital'}</span>
          <h3 class="listing-title">${item.title}</h3>
          <p class="listing-desc">${item.description}</p>
          <div class="listing-meta">
            <span class="listing-price">${formatPrice(item.price)}</span>
            <span class="listing-ref">${item.refId || ''}</span>
          </div>
          <div class="listing-actions">
            <button class="btn btn-primary btn-sm view-btn" data-id="${item.id}">View Details</button>
            <button class="btn btn-wishlist btn-sm wishlist-btn ${inWishlist ? "active" : ""}" data-id="${item.id}" aria-label="Toggle wishlist">
              ${inWishlist ? "♥ Saved" : "♡ Wishlist"}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  observeReveals();
}

/* ===== SEARCH ===== */
if (searchInput) {
  searchInput.addEventListener("input", () => {
    currentSearch = searchInput.value;
    renderListings();
  });
}

/* ===== SORT ===== */
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    renderListings();
  });
}

/* ===== GOOGLE LOGIN ===== */
if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Logged in user: ", result.user.email);
        window.location.href = "contact.html";
      })
      .catch((error) => {
        alert("Google Login Failed: " + error.message);
      });
  });
}

/* ===== NAVBAR AUTH STATE ===== */
onAuthStateChanged(auth, (user) => {
  if (navAuthContainer) {
    if (user) {
      navAuthContainer.innerHTML = `
        <span style="color: #00f2fe; font-size: 0.85rem;">${user.email.split('@')[0]}</span>
        <button id="navLogoutBtn" class="btn btn-outline" style="padding: 4px 10px; font-size: 0.8rem;">Logout</button>
      `;
      const navLogoutBtn = document.getElementById("navLogoutBtn");
      if (navLogoutBtn) {
        navLogoutBtn.addEventListener("click", () => signOut(auth));
      }
    } else {
      navAuthContainer.innerHTML = `
        <a href="contact.html?mode=login" class="btn btn-outline" style="padding: 6px 14px; font-size: 0.85rem; text-decoration: none;">Login</a>
        <a href="contact.html?mode=signup" class="btn btn-primary" style="padding: 6px 14px; font-size: 0.85rem; text-decoration: none;">Sign Up</a>
      `;
    }
  }
});

/* ===== WISHLIST ===== */
function toggleWishlist(id) {
  const index = wishlist.indexOf(id);
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast("Removed from wishlist", true);
  } else {
    wishlist.push(id);
    showToast("Added to wishlist", true);
  }
  localStorage.setItem("nkWishlist", JSON.stringify(wishlist));
  renderListings();
}

function showToast(message, isWishlist = false) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.toggle("wishlist", isWishlist);
  toast.hidden = false;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => { toast.hidden = true; }, 300);
  }, 2200);
}

/* ===== MODAL (Full Details Popup) ===== */
function openModal(id) {
  const item = listings.find(l => l.id === id);
  if (!item) return;

  modalBody.innerHTML = `
    <div style="font-size: 2.2rem; text-align: center; margin-bottom: 10px;">🛍️</div>
    <p style="color: #00f2fe; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; margin-bottom: 5px;">${item.category || 'Digital'}</p>
    <h2 style="color: #fff; font-size: 1.4rem; margin-bottom: 10px;">${item.title}</h2>
    <p style="color: #00f2fe; font-size: 1.3rem; font-weight: 700; margin-bottom: 15px;">${formatPrice(item.price)}</p>
    <p style="color: #d1d1e0; font-size: 0.95rem; line-height: 1.5; margin-bottom: 15px;">${item.description}</p>
    <p style="color: #8a8a9e; font-size: 0.85rem; margin-bottom: 20px;">Reference ID: <strong style="color: #fff;">${item.refId || ''}</strong></p>
    <button class="btn btn-primary btn-full" onclick="window.location.href='contact.html?ref=${item.refId || ''}'">
      Inquire About This Listing
    </button>
  `;

  modalOverlay.hidden = false;
  requestAnimationFrame(() => modalOverlay.classList.add("open"));
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove("open");
  setTimeout(() => {
    modalOverlay.hidden = true;
    document.body.style.overflow = "";
  }, 300);
}

if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("open")) closeModal();
});

/* ===== DELEGATED CLICKS ===== */
if (listingsGrid) {
  listingsGrid.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".view-btn");
    if (viewBtn) {
      openModal(viewBtn.dataset.id);
      return;
    }
    const wishBtn = e.target.closest(".wishlist-btn");
    if (wishBtn) {
      toggleWishlist(wishBtn.dataset.id);
    }
  });
}

/* ===== MOBILE NAV ===== */
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
}

/* ===== NAVBAR SCROLL ===== */
window.addEventListener("scroll", () => {
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);

  const sections = document.querySelectorAll("section[id]");
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) {
      current = sec.getAttribute("id");
    }
  });
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      link.classList.toggle("active", href === "#" + current);
    }
  });
});

/* ===== REVEAL ON SCROLL ===== */
function observeReveals() {
  if (!listingsGrid) return;
  const reveals = listingsGrid.querySelectorAll(".reveal:not(.visible)");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  reveals.forEach(el => observer.observe(el));
}

/* ===== CONTACT FORM (If present on page) ===== */
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");
    const feedback = document.getElementById("formFeedback");

    [name, email, subject, message].forEach(el => el && el.classList.remove("error"));
    
    if (document.getElementById("nameError")) document.getElementById("nameError").textContent = "";
    if (document.getElementById("emailError")) document.getElementById("emailError").textContent = "";
    if (document.getElementById("subjectError")) document.getElementById("subjectError").textContent = "";
    if (document.getElementById("messageError")) document.getElementById("messageError").textContent = "";
    if (feedback) feedback.hidden = true;

    let valid = true;

    if (name && (!name.value.trim() || name.value.trim().length < 2)) {
      name.classList.add("error");
      if (document.getElementById("nameError")) {
        document.getElementById("nameError").textContent = "Please enter your full name (at least 2 characters).";
      }
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && (!email.value.trim() || !emailRegex.test(email.value.trim()))) {
      email.classList.add("error");
      if (document.getElementById("emailError")) {
        document.getElementById("emailError").textContent = "Please enter a valid email address.";
      }
      valid = false;
    }

    if (subject && (!subject.value.trim() || subject.value.trim().length < 3)) {
      subject.classList.add("error");
      if (document.getElementById("subjectError")) {
        document.getElementById("subjectError").textContent = "Please enter a subject (at least 3 characters).";
      }
      valid = false;
    }

    if (message && (!message.value.trim() || message.value.trim().length < 10)) {
      message.classList.add("error");
      if (document.getElementById("messageError")) {
        document.getElementById("messageError").textContent = "Please enter a message (at least 10 characters).";
      }
      valid = false;
    }

    if (!valid) return;

    if (feedback) {
      feedback.className = "form-feedback info";
      feedback.innerHTML = `
        <strong>Message Sent Successfully!</strong><br>
        Thank you for contacting NK ACCOUNTS. Our team will get back to you shortly.
      `;
      feedback.hidden = false;
    }

    contactForm.reset();
  });
}

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", () => {
  renderListings();
  observeReveals();
});
