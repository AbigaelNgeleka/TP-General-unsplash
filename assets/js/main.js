import { searchImages } from './api.js';
import { renderGallery, toggleLoader, closeModal, openModal } from './ui.js';

// State
let currentQuery = '';
let currentPage = 1;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const DEFAULT_QUERY = 'design';

// DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const galleryGrid = document.getElementById('gallery-grid');
const loadMoreContainer = document.getElementById('load-more-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const favoritesSection = document.getElementById('favorites-section');
const favoritesGrid = document.getElementById('favorites-grid');
const toggleFavoritesBtn = document.getElementById('toggle-favorites-btn');
const closeFavoritesBtn = document.getElementById('close-favorites');
const noFavoritesMsg = document.getElementById('no-favorites-msg');
const modal = document.getElementById('modal');
const closeModalBtn = document.querySelector('.close-modal');
const modalFavBtn = document.getElementById('modal-fav-btn');

// --- Initialization ---
function init() {
    updateFavoritesUI();
    preloadInitialResults();
}

// --- Event Listeners ---

// Search
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    currentQuery = query;
    currentPage = 1;
    loadMoreContainer.classList.add('hidden');

    await performSearch(true);
});

// Load More
loadMoreBtn.addEventListener('click', async () => {
    currentPage++;
    await performSearch(false);
});

// Toggle Favorites Section
toggleFavoritesBtn.addEventListener('click', () => {
    favoritesSection.classList.toggle('hidden');
    updateFavoritesUI();
});

closeFavoritesBtn.addEventListener('click', () => {
    favoritesSection.classList.add('hidden');
});

// Modal Actions
closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Modal Favorite Button
modalFavBtn.addEventListener('click', () => {
    const image = JSON.parse(modalFavBtn.dataset.image);
    toggleFavorite(image);

    // Update modal button state
    const isFav = isFavorite(image.id);
    const icon = modalFavBtn.querySelector('i');
    if (isFav) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
        modalFavBtn.classList.add('active');
    } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
        modalFavBtn.classList.remove('active');
    }

    // Update grids
    updateGalleryUI();
});

// Gallery Favorite Buttons (Delegation)
galleryGrid.addEventListener('click', handleGridClick);
favoritesGrid.addEventListener('click', handleGridClick);

function handleGridClick(e) {
    const btn = e.target.closest('.fav-btn');
    if (!btn) return;

    // Prevent opening the modal when clicking the heart
    e.stopPropagation();

    const image = JSON.parse(btn.dataset.image);
    toggleFavorite(image);
}

async function preloadInitialResults() {
    // Montre quelque chose dès l'ouverture en lançant une recherche par défaut
    const emptyMsg = galleryGrid.querySelector('.empty-state p');
    if (emptyMsg) {
        emptyMsg.textContent = 'Chargement des inspirations...';
    }

    currentQuery = DEFAULT_QUERY;
    currentPage = 1;
    searchInput.value = DEFAULT_QUERY;

    try {
        await performSearch(true);
    } catch (err) {
        console.error('Impossible de charger les inspirations par défaut', err);
    }
}

// --- Logic ---

/**
 * Performs the search and updates UI
 * @param {boolean} clear - Whether to clear existing results
 */
async function performSearch(clear) {
    toggleLoader(true);
    try {
        const data = await searchImages(currentQuery, currentPage);

        const favIds = favorites.map(f => f.id);
        renderGallery(data.results, galleryGrid, favIds, clear);

        if (data.total_pages > currentPage) {
            loadMoreContainer.classList.remove('hidden');
        } else {
            loadMoreContainer.classList.add('hidden');
        }
    } catch (error) {
        console.error(error);
        alert('Une erreur est survenue lors de la recherche.');
    } finally {
        toggleLoader(false);
    }
}

function isFavorite(id) {
    return favorites.some(f => f.id === id);
}

function toggleFavorite(image) {
    const index = favorites.findIndex(f => f.id === image.id);
    if (index === -1) {
        favorites.push(image);
    } else {
        favorites.splice(index, 1);
    }
    saveFavorites();
    updateFavoritesUI();
    updateGalleryUI(); // Update hearts in the main grid
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function updateFavoritesUI() {
    const favIds = favorites.map(f => f.id);
    renderGallery(favorites, favoritesGrid, favIds, true);

    if (favorites.length === 0) {
        noFavoritesMsg.classList.remove('hidden');
    } else {
        noFavoritesMsg.classList.add('hidden');
    }
}

function updateGalleryUI() {
    // Update heart icons in the main gallery without re-rendering everything
    const cards = galleryGrid.querySelectorAll('.image-card');
    cards.forEach(card => {
        const id = card.dataset.id;
        const btn = card.querySelector('.fav-btn');
        const icon = btn.querySelector('i');

        if (isFavorite(id)) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
            btn.classList.add('active');
        } else {
            icon.classList.remove('fa-solid');
            icon.classList.add('fa-regular');
            btn.classList.remove('active');
        }
    });
}

// Start the app
init();
