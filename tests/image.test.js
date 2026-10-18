import { renderMarsImage, MARS_IMAGE_URL } from '../src/image';

describe('renderMarsImage', () => {
  let container;
  beforeEach(() => {
    document.body.innerHTML = '<section id="hero"></section>';
    container = document.getElementById('hero');
  });

  test('shows a loading state while the image is pending, then renders the image', async () => {
    let resolveLoad;
    const loader = jest.fn(() => new Promise((res) => { resolveLoad = res; }));
    const done = renderMarsImage(container, MARS_IMAGE_URL, loader);

    expect(container.classList.contains('hero--loading')).toBe(true);
    expect(container.querySelector('img')).toBeNull();

    resolveLoad(MARS_IMAGE_URL);
    await expect(done).resolves.toBe(true);

    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe(MARS_IMAGE_URL);
    expect(img.alt).toMatch(/red planet/i);
    expect(container.classList.contains('hero--loading')).toBe(false);
  });

  test('requests the Unsplash photo', async () => {
    const loader = jest.fn().mockResolvedValue('x');
    await renderMarsImage(container, undefined, loader);
    expect(loader).toHaveBeenCalledWith(expect.stringContaining('unsplash.com/photos/4IrVnSpwk48'));
  });

  test('falls back to a message if the image fails to load', async () => {
    const loader = jest.fn().mockRejectedValue(new Error('offline'));
    await expect(renderMarsImage(container, MARS_IMAGE_URL, loader)).resolves.toBe(false);
    expect(container.querySelector('img')).toBeNull();
    expect(container.classList.contains('hero--failed')).toBe(true);
    expect(container.textContent).toMatch(/out of signal/i);
  });
});
