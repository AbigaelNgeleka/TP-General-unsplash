const BASE_URL = 'https://api.unsplash.com';

/**
 * Fetches images from Unsplash API
 * @param {string} query - Search term
 * @param {number} page - Page number
 * @returns {Promise<Object>} - API response
 */
export async function searchImages(query, page = 1) {
    if (!config.API_KEY) {
        throw new Error('API Key is missing in config.js');
    }

    const url = `${BASE_URL}/search/photos?page=${page}&query=${encodeURIComponent(query)}&per_page=12&client_id=${config.API_KEY}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Limite API atteinte ou clé invalide.');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
