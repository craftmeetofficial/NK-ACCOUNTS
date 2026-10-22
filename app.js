/* ===== DEMO LISTINGS DATA (eBay Only) ===== */
const listings = [
  {
    id: 1,
    title: "eBay Verified Seller Account",
    category: "eBay",
    price: 15000,
    description: "High-feedback established eBay seller account with active selling history and instant payment setup.",
    ref: "EB-0001",
    featured: true,
    icon: "🛍️"
  },
  {
    id: 2,
    title: "eBay Dropshipping Pro Store",
    category: "eBay",
    price: 22000,
    description: "Fully optimized eBay store geared for dropshipping with high-demand product listings and supplier templates.",
    ref: "EB-0002",
    featured: true,
    icon: "📦"
  },
  {
    id: 3,
    title: "eBay US Marketplace Account",
    category: "eBay",
    price: 18500,
    description: "Registered US region eBay account with high limits, ready for scaling cross-border e-commerce business.",
    ref: "EB-0003",
    featured: false,
    icon: "🇺🇸"
  },
  {
    id: 4,
    title: "eBay Bulk Listing Manager Suite",
    category: "eBay",
    price: 9500,
    description: "Automated toolkit and software access for managing inventory, tracking orders, and optimizing eBay listings.",
    ref: "EB-0004",
    featured: false,
    icon: "⚙️"
  }
];

/* ===== STATE ===== */
let currentCategory = "eBay";
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

/* ===== RENDER LISTINGS ===== */
function formatPrice(price) {
  return "LKR " + price.toLocaleString("en-LK");
}

function getFilteredListings() {
  let result = [...listings];

  if (currentCategory !== "all" && currentCategory !== "eBay") {
    result = result.filter(l => l.category === currentCategory);
  }

  if (currentSearch.trim()) {
    const q = currentSearch.toLowerCase().trim();
    result = result.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) ||
      l.ref.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q)
    );
  }

  switch (currentSort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "title-asc":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "title-desc":
      result.sort((a, b) => b.title.localeCompare(a.title));
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
          <span class="placeholder-icon">${item.icon}</span>
          ${item.featured ? '<span class="listing-badge">FEATURED</span>' : ""}
        </div>
        <div class="listing-body">
          <span class="listing-category">${item.category}</span>
          <h3 class="listing-title">${item.title}</h3>
          <p class="listing-desc">${item.description}</p>
          <div class="listing-meta">
            <span class="listing-price">${formatPrice(item.price)}</span>
            <span class="listing-ref">${item.ref}</span>
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

/* ===== CATEGORY FILTER ===== */
categoriesGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".category-btn");
  if (!btn) return;

  document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentCategory = btn.dataset.category;
  renderListings();
});

/* ===== SEARCH ===== */
searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value;
  renderListings();
});

/* ===== SORT ===== */
sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  renderListings();
});

/* ===== WISHLIST ===== */
function toggleWishlist(id) {
  id = Number(id);
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
  toast.textContent = message;
  toast.classList.toggle("wishlist", isWishlist);
  toast.hidden = false;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => { toast.hidden = true; }, 300);
  }, 2200);
}

/* ===== MODAL ===== */
function openModal(id) {
  const item = listings.find(l => l.id === Number(id));
  if (!item) return;

  modalBody.innerHTML = `
    <div class="modal-image">${item.icon}</div>
    <p class="modal-category">${item.category}</p>
    <h2 class="modal-title">${item.title}</h2>
    <p class="modal-price">${formatPrice(item.price)}</p>
    <p class="modal-desc">${item.description}</p>
    <p class="modal-ref">Reference: <span>${item.ref}</span></p>
    <p class="modal-desc" style="font-size:0.85rem;opacity:0.8;">
      This is a demo listing. No real account credentials or sensitive data are displayed or transferred through this website.
    </p>
    <button class="btn btn-primary btn-full" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'}); closeModal();">
      Inquire About This Listing
    </button>
  `;

  modalOverlay.hidden = false;
  requestAnimationFrame(() => modalOverlay.classList.add("open"));
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.classList.remove("open");
  setTimeout(() => {
    modalOverlay.hidden = true;
    document.body.style.overflow = "";
  }, 300);
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modalOverlay.classList.contains("open")) closeModal();
});

/* ===== DELEGATED CLICKS ===== */
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

/* ===== MOBILE NAV ===== */
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

/* ===== NAVBAR SCROLL ===== */
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);

  const sections = document.querySelectorAll("section[id]");
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) {
      current = sec.getAttribute("id");
    }
  });
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
});

/* ===== CONTACT FORM ===== */
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");
  const feedback = document.getElementById("formFeedback");

  [name, email, subject, message].forEach(el => el.classList.remove("error"));
  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("subjectError").textContent = "";
  document.getElementById("messageError").textContent = "";
  feedback.hidden = true;

  let valid = true;

  if (!name.value.trim() || name.value.trim().length < 2) {
    name.classList.add("error");
    document.getElementById("nameError").textContent = "Please enter your full name (at least 2 characters).";
    valid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
    email.classList.add("error");
    document.getElementById("emailError").textContent = "Please enter a valid email address.";
    valid = false;
  }

  if (!subject.value.trim() || subject.value.trim().length < 3) {
    subject.classList.add("error");
    document.getElementById("subjectError").textContent = "Please enter a subject (at least 3 characters).";
    valid = false;
  }

  if (!message.value.trim() || message.value.trim().length < 10) {
    message.classList.add("error");
    document.getElementById("messageError").textContent = "Please enter a message (at least 10 characters).";
    valid = false;
  }

  if (!valid) return;

  feedback.className = "form-feedback info";
  feedback.innerHTML = `
    <strong>Form validated successfully.` + `<br>` + `</strong>
    This is a frontend-only demo website. Messages are not sent to a server.
    Please contact the Account Manager (Navod Akalanka) directly via your preferred channel to complete your inquiry.
  `;
  feedback.hidden = false;

  contactForm.reset();
});

/* ===== REVEAL ON SCROLL ===== */
function observeReveals() {
  const reveals = document.getElementById("listingsGrid").querySelectorAll(".reveal:not(.visible)");
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

/* ===== INIT ===== */
document.addEventListener("DOMContentLoaded", () => {
  renderListings();
  observeReveals();
});
