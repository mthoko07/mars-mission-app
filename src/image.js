// Direct download link for the Unsplash photo "a red planet with a black background" (4IrVnSpwk48).
export const MARS_IMAGE_URL =
  'https://unsplash.com/photos/4IrVnSpwk48/download?force=true&w=1600';

/**
 * Loads an image asynchronously. Resolves with the URL once the browser has
 * fully fetched it, rejects if it fails to load.
 */
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error(`Could not load image: ${url}`));
    img.src = url;
  });
}

/**
 * Renders the hero picture asynchronously into `container`.
 * The page stays usable while the image loads; a placeholder is shown meanwhile
 * and a graceful fallback if the request fails.
 */
export async function renderMarsImage(container, url = MARS_IMAGE_URL, loader = preloadImage) {
  container.classList.add('hero--loading');
  try {
    const loaded = await loader(url);
    const img = document.createElement('img');
    img.src = loaded;
    img.alt = 'A red planet against a black background';
    img.className = 'hero__img';
    container.innerHTML = '';
    container.appendChild(img);
    container.classList.remove('hero--loading');
    container.classList.add('hero--loaded');
    return true;
  } catch (err) {
    container.classList.remove('hero--loading');
    container.classList.add('hero--failed');
    container.textContent = 'Mars is out of signal range right now.';
    return false;
  }
}
