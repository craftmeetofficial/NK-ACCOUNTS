/* ===== DEMO LISTINGS DATA ===== */
const listings = [
  {
    id: 1,
    title: "Premium Gaming Account Bundle",
    category: "Gaming",
    price: 4500,
    description: "High-level multi-platform gaming account with rare skins and exclusive content. Ideal for competitive players seeking a head start.",
    ref: "NK-0001",
    featured: true,
    icon: "🎮"
  },
  {
    id: 2,
    title: "Streaming Platform Pro Access",
    category: "Streaming",
    price: 2200,
    description: "Full-featured streaming service account with ad-free viewing, offline downloads, and multi-device support.",
    ref: "NK-0002",
    featured: true,
    icon: "📺"
  },
  {
    id: 3,
    title: "Creative Suite Professional",
    category: "Software",
    price: 8900,
    description: "Industry-standard design and editing software suite. Includes cloud storage and regular feature updates.",
    ref: "NK-0003",
    featured: false,
    icon: "🎨"
  },
  {
    id: 4,
    title: "Social Growth Starter Pack",
    category: "Social",
    price: 1800,
    description: "Established social media profile with organic engagement history. Perfect for creators building their brand.",
    ref: "NK-0004",
    featured: true,
    icon: "📱"
  },
  {
    id: 5,
    title: "Productivity Workspace Pro",
    category: "Productivity",
    price: 3200,
    description: "Collaborative workspace tool with advanced project management, integrations, and team features.",
    ref: "NK-0005",
    featured: false,
    icon: "⚡"
  },
  {
    id: 6,
    title: "AAA Game Library Access",
    category: "Gaming",
    price: 6700,
    description: "Extensive library of popular titles with cloud saves and cross-platform play. Regular new releases added.",
    ref: "NK-0006",
    featured: true,
    icon: "🕹️"
  },
  {
    id: 7,
    title: "Music Streaming Unlimited",
    category: "Streaming",
    price: 1500,
    description: "Unlimited music streaming with high-fidelity audio, offline mode, and curated playlists.",
    ref: "NK-0007",
    featured: false,
    icon: "🎵"
  },
  {
    id: 8,
    title: "Developer Tools Suite",
    category: "Software",
    price: 5400,
    description: "Complete development environment with IDE, version control, and deployment tools for modern workflows.",
    ref: "NK-0008",
    featured: false,
    icon: "💻"
  },
  {
    id: 9,
    title: "Influencer Ready Profile",
    category: "Social",
    price: 4100,
    description: "Verified-style social account with consistent posting history and engaged audience niche.",
    ref: "NK-0009",
    featured: true,
    icon: "⭐"
  },
  {
    id: 10,
    title: "Cloud Storage Enterprise",
    category: "Productivity",
    price: 2800,
    description: "Large-capacity secure cloud storage with file sharing, version history, and advanced security options.",
    ref: "NK-0010",
    featured: false,
    icon: "☁️"
  },
  {
    id: 11,
    title: "Esports Ranked Account",
    category: "Gaming",
    price: 7500,
    description: "Competitive ranked profile with strong statistics and exclusive seasonal rewards unlocked.",
    ref: "NK-0011",
    featured: true,
    icon: "🏆"
  },
  {
    id: 12,
    title: "Video Production Toolkit",
    category: "Software",
    price: 6200,
    description: "Professional video editing and effects package used by content creators and studios worldwide.",
    ref: "NK-0012",
    featured: false,
    icon: "🎬"
  }
];

/* ===== STATE ===== */
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

/* ===== RENDER LISTINGS ===== */
function formatPrice(price) {
  return "LKR " + price.toLocaleString("en-LK");
}

function getFilteredListings() {
  let result = [...listings];

  if (currentCategory !== "all") {
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

  // Re-observe new cards for reveal
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

  // Active nav link
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

  // Reset errors
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

  // Honest frontend-only feedback (no backend)
  feedback.className = "form-feedback info";
  feedback.innerHTML = `
    <strong>Form validated successfully.</strong><br>
    This is a frontend-only demo website. Messages are not sent to a server.
    Please contact the Account Manager (Navod Akalanka) directly via your preferred channel to complete your inquiry.
  `;
  feedback.hidden = false;

  contactForm.reset();
});

/* ===== REVEAL ON SCROLL ===== */
function observeReveals() {
  const reveals = document.querySelectorAll(".reveal:not(.visible)");
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

  // Add reveal class to static sections
  document.querySelectorAll(".step-card, .profile-card").forEach(el => {
    el.classList.add("reveal");
  });
  observeReveals();
});