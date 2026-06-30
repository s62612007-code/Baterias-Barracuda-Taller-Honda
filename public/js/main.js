import { ACCESSORIES } from './data/products.js';
import { formatPrice } from './utils/format.js';
import { initCatalog } from './modules/catalog.js';
import { initReferenceCatalog } from './modules/reference-catalog.js';
import { initFitmentFinder } from './modules/fitment-finder.js';
import { initOffersTicker } from './modules/offers-ticker.js';

function renderAccessories() {
  const container = document.querySelector('#accessories-bar');
  if (!container) return;

  const title = document.createElement('p');
  title.className = 'accessories-bar__title';
  title.textContent = 'Accesorios en venta:';
  container.appendChild(title);

  ACCESSORIES.forEach((item) => {
    const chip = document.createElement('div');
    chip.className = 'accessory-chip';
    chip.innerHTML = `<strong>${item.name}:</strong> ${formatPrice(item.price)}`;
    container.appendChild(chip);
  });
}

function initNavHighlight() {
  document.querySelectorAll('.nav-list a, .ref-nav__pill').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        const target = href.split('?')[0];
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initOffersTicker();
  initCatalog();
  initReferenceCatalog();
  initFitmentFinder();
  renderAccessories();
  initNavHighlight();
});
