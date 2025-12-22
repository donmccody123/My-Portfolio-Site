// Portfolio management and display
import { supabase } from './supabase.js';

const categories = [
  'All',
  'Flyers',
  'Logos',
  'Brochures',
  'Banners',
  'T-Shirts',
  'Branding',
  'Printing',
  'Installations',
];

let allItems = [];
let filteredItems = [];
let activeCategory = 'All';

// Initialize portfolio
export async function initPortfolio() {
  await fetchPortfolioItems();
  renderCategories();
  renderPortfolio();
}

// Fetch portfolio items from Supabase
async function fetchPortfolioItems() {
  try {
    const portfolioLoading = document.getElementById('portfolio-loading');
    const portfolioGrid = document.getElementById('portfolio-grid');
    const portfolioEmpty = document.getElementById('portfolio-empty');
    
    portfolioLoading.classList.remove('hidden');
    portfolioGrid.innerHTML = '';
    portfolioEmpty.classList.add('hidden');

    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    allItems = data || [];
    filterItems();
    portfolioLoading.classList.add('hidden');
    renderPortfolio();
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    document.getElementById('portfolio-loading').classList.add('hidden');
    document.getElementById('portfolio-empty').classList.remove('hidden');
  }
}

// Filter items by category
function filterItems() {
  if (activeCategory === 'All') {
    filteredItems = allItems;
  } else {
    filteredItems = allItems.filter(item =>
      item.category.toLowerCase() === activeCategory.toLowerCase()
    );
  }
}

// Render category buttons
function renderCategories() {
  const categoryButtons = document.getElementById('category-buttons');
  categoryButtons.innerHTML = categories.map(category => `
    <button
      onclick="setPortfolioCategory('${category}')"
      class="category-btn ${activeCategory === category ? 'active' : ''}"
      data-category="${category}"
    >
      ${category}
    </button>
  `).join('');
}

// Set active category
export function setPortfolioCategory(category) {
  activeCategory = category;
  filterItems();
  renderCategories();
  renderPortfolio();
}

// Render portfolio items
function renderPortfolio() {
  const portfolioGrid = document.getElementById('portfolio-grid');
  const portfolioEmpty = document.getElementById('portfolio-empty');
  const portfolioLoading = document.getElementById('portfolio-loading');

  portfolioLoading.classList.add('hidden');

  if (filteredItems.length === 0) {
    portfolioGrid.innerHTML = '';
    portfolioEmpty.classList.remove('hidden');
    return;
  }

  portfolioEmpty.classList.add('hidden');
  portfolioGrid.innerHTML = filteredItems.map(item => `
    <div
      onclick="openPortfolioModal(${JSON.stringify(item).replace(/"/g, '&quot;')})"
      class="portfolio-item"
    >
      <div class="portfolio-item-image">
        ${item.media_type === 'image' ? `
          <img
            src="${item.media_url}"
            alt="${item.title}"
          />
        ` : `
          <div class="relative w-full h-full flex items-center justify-center bg-gray-900">
            <video
              src="${item.media_url}"
              class="w-full h-full object-cover"
            ></video>
            <div class="absolute inset-0 flex items-center justify-center bg-opacity-40">
              <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        `}
        <div class="portfolio-item-category">
          ${item.category}
        </div>
      </div>
      <div class="portfolio-item-content">
        <h3 class="portfolio-item-title">${item.title}</h3>
        <p class="portfolio-item-description">${item.description}</p>
      </div>
    </div>
  `).join('');
}

// Open portfolio modal
export function openPortfolioModal(item) {
  const modal = document.getElementById('portfolio-modal');
  const modalImage = document.getElementById('modal-image');
  const modalVideo = document.getElementById('modal-video');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDescription = document.getElementById('modal-description');
  const modalThumbs = document.getElementById('modal-thumbs');

  modalTitle.textContent = item.title;
  modalCategory.textContent = item.category;
  modalDescription.textContent = item.description;

  const gallery = Array.isArray(item.media_gallery) && item.media_gallery.length
    ? item.media_gallery
    : [{ url: item.media_url, type: item.media_type }];

  function setActiveMedia(index) {
    const media = gallery[index];
    if (!media) return;
    if (media.type === 'image') {
      modalImage.src = media.url;
      modalImage.alt = item.title;
      modalImage.classList.remove('hidden');
      modalVideo.classList.add('hidden');
      modalVideo.pause();
    } else {
      modalVideo.src = media.url;
      modalVideo.classList.remove('hidden');
      modalImage.classList.add('hidden');
    }

    // highlight active thumb
    const thumbNodes = modalThumbs.querySelectorAll('.modal-thumb');
    thumbNodes.forEach((node, idx) => {
      if (idx === index) node.classList.add('active');
      else node.classList.remove('active');
    });
  }

  // Build thumbnails
  if (gallery.length > 1) {
    modalThumbs.classList.remove('hidden');
    modalThumbs.innerHTML = gallery.map((media, idx) => `
      <button class="modal-thumb ${idx === 0 ? 'active' : ''}" data-idx="${idx}" onclick="event.stopPropagation(); window.setModalMedia(${idx})">
        ${media.type === 'image'
          ? `<img src="${media.url}" alt="${item.title} thumb ${idx + 1}" />`
          : `<video src="${media.url}"></video>`}
      </button>
    `).join('');
  } else {
    modalThumbs.classList.add('hidden');
    modalThumbs.innerHTML = '';
  }

  window.setModalMedia = (idx) => setActiveMedia(idx);

  setActiveMedia(0);
  modal.classList.remove('hidden');
}

// Close portfolio modal
export function closePortfolioModal() {
  const modal = document.getElementById('portfolio-modal');
  modal.classList.add('hidden');
}

// Refresh portfolio (for admin after adding/deleting)
export async function refreshPortfolio() {
  await fetchPortfolioItems();
}

// Make functions available globally
window.setPortfolioCategory = setPortfolioCategory;
window.openPortfolioModal = openPortfolioModal;
window.closePortfolioModal = closePortfolioModal;

