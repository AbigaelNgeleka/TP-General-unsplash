/**
 * Creates an image card HTML element
 * @param {Object} image - Image object from Unsplash API
 * @param {boolean} isFavorite - Whether the image is in favorites
 * @returns {HTMLElement} - The card element
 */
export function createImageCard(image, isFavorite = false) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.dataset.id = image.id;

    const heartClass = isFavorite ? 'fa-solid' : 'fa-regular';
    const activeClass = isFavorite ? 'active' : '';

    card.innerHTML = `
        <div class="image-wrapper">
            <img src="${image.urls.small}" alt="${image.alt_description || 'Unsplash Image'}" loading="lazy">
        </div>
        <div class="card-info">
            <a href="${image.user.links.html}" target="_blank" class="photographer">
                <img src="${image.user.profile_image.small}" alt="${image.user.name}">
                <span>${image.user.name}</span>
            </a>
            <button class="btn-icon fav-btn ${activeClass}" aria-label="Ajouter aux favoris" data-image='${JSON.stringify(image).replace(/'/g, "&apos;")}'>
                <i class="${heartClass} fa-heart"></i>
            </button>
        </div>
    `;

    // Event listener for image click (open modal)
    const imgWrapper = card.querySelector('.image-wrapper');
    imgWrapper.addEventListener('click', () => {
        openModal(image, isFavorite);
    });

    return card;
}

/**
 * Renders a list of images to the grid
 * @param {Array} images - List of image objects
 * @param {HTMLElement} container - Container element
 * @param {Array} favoritesIds - List of favorite image IDs
 * @param {boolean} clear - Whether to clear the container first
 */
export function renderGallery(images, container, favoritesIds, clear = false) {
    if (clear) {
        container.innerHTML = '';
    }

    if (images.length === 0 && clear) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-magnifying-glass"></i>
                <p>Aucun résultat trouvé.</p>
            </div>
        `;
        return;
    }

    const fragment = document.createDocumentFragment();
    images.forEach(image => {
        const isFavorite = favoritesIds.includes(image.id);
        const card = createImageCard(image, isFavorite);
        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}

/**
 * Toggles the loading spinner
 * @param {boolean} show 
 */
export function toggleLoader(show) {
    const loader = document.getElementById('loader');
    if (show) {
        loader.classList.remove('hidden');
    } else {
        loader.classList.add('hidden');
    }
}

/**
 * Opens the modal with image details
 * @param {Object} image 
 * @param {boolean} isFavorite 
 */
export function openModal(image, isFavorite) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-image');
    const userImg = document.getElementById('modal-user-img');
    const userName = document.getElementById('modal-user-name');
    const userLink = document.getElementById('modal-user-link');
    const favBtn = document.getElementById('modal-fav-btn');
    const favIcon = favBtn.querySelector('i');

    modalImg.src = image.urls.regular;
    modalImg.alt = image.alt_description || 'Image detail';
    userImg.src = image.user.profile_image.medium;
    userName.textContent = image.user.name;
    userLink.href = image.user.links.html;

    // Set favorite state in modal
    favBtn.dataset.id = image.id;
    // We need to pass the full image object to the button for saving
    favBtn.dataset.image = JSON.stringify(image);

    if (isFavorite) {
        favIcon.classList.remove('fa-regular');
        favIcon.classList.add('fa-solid');
        favBtn.classList.add('active');
    } else {
        favIcon.classList.remove('fa-solid');
        favIcon.classList.add('fa-regular');
        favBtn.classList.remove('active');
    }

    modal.classList.add('active');
}

/**
 * Closes the modal
 */
export function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.getElementById('modal-image').src = ''; // Clear src
}
