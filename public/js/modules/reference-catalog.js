import { PRODUCTS, REFERENCE_GROUPS, PRIORITY_BRANDS } from '../data/products.js';
import { formatPrice, buildWhatsAppLink } from '../utils/format.js';
import { imageWithFallback } from '../utils/images.js';

const BATTERY_SLIDES = 3;
const AUTO_INTERVAL_MS = 5000;
const BRANDS_PER_GROUP = 3;

const FEATURED_REF_IDS = ['ns40', 'ns60', '42'];

const BRAND_CLASS = {
  MAC: 'mac',
  WILLARD: 'willard',
  COEXITO: 'coexito',
  DUNCAN: 'duncan',
  VARTA: 'varta',
  Bosch: 'bosch',
  Rocket: 'rocket',
  'AC Delco': 'acdelco',
  Motorcraft: 'motorcraft',
  Hankook: 'hankook',
  Optima: 'optima',
};

function productText(product) {
  return `${product.reference} ${product.name} ${product.brand}`;
}

function groupProducts(group) {
  return PRODUCTS.filter((p) => group.match(productText(p)));
}

function pickFeatured(products, brand) {
  const brandProducts = products.filter((p) => p.brand === brand);
  return brandProducts.sort((a, b) => a.price - b.price)[0] || null;
}

function createBrandCard(product, groupLabel) {
  const brand = product.category || product.brand;
  const brandClass = BRAND_CLASS[brand] || 'generic';
  const offerBadge = product.offer ? '<span class="badge-discount">Oferta</span>' : '';

  const card = document.createElement('article');
  card.className = `ref-brand-card ref-brand-card--${brandClass}`;
  card.innerHTML = `
    <div class="ref-brand-card__image-wrap">
      ${offerBadge}
      <img class="ref-brand-card__image" alt="Batería ${groupLabel} ${brand} — ${product.reference}" loading="lazy" width="280" height="210" />
      <span class="ref-brand-card__brand">${brand}</span>
    </div>
    <div class="ref-brand-card__body">
      <p class="ref-brand-card__line">${product.line || brand}</p>
      <h4 class="ref-brand-card__name">${product.name}</h4>
      <p class="ref-brand-card__ref">Ref. ${product.reference}</p>
      <p class="ref-brand-card__price">${formatPrice(product.price)}</p>
      <a class="btn btn--whatsapp btn--sm" href="${buildWhatsAppLink(`Hola, me interesa ${product.name} (${product.reference}) ref. ${groupLabel} por ${formatPrice(product.price)}.`)}"
        target="_blank" rel="noopener noreferrer">Cotizar</a>
    </div>
  `;

  imageWithFallback(card.querySelector('.ref-brand-card__image'), product.image);
  return card;
}

function createGroupPanel(group, slideNum) {
  const products = groupProducts(group);
  if (products.length === 0) return null;

  const featuredByBrand = PRIORITY_BRANDS.map((brand) => pickFeatured(products, brand))
    .filter(Boolean)
    .slice(0, BRANDS_PER_GROUP);

  const panel = document.createElement('article');
  panel.className = 'ref-carousel-panel';
  panel.dataset.reference = group.label;
  panel.innerHTML = `
    <header class="ref-carousel-panel__header">
      <span class="ref-carousel-panel__num">${slideNum}</span>
      <div>
        <span class="ref-group__badge">${group.label}</span>
        <h3 class="ref-carousel-panel__title">Baterías referencia ${group.label}</h3>
        <p class="ref-carousel-panel__desc">${group.description}</p>
      </div>
    </header>
    <div class="ref-carousel-panel__brands" role="list"></div>
  `;

  const grid = panel.querySelector('.ref-carousel-panel__brands');
  featuredByBrand.forEach((product) => {
    grid.appendChild(createBrandCard(product, group.label));
  });

  return panel;
}

function initBatteryCarousel(container, groups) {
  if (groups.length === 0) return;

  let currentIndex = 0;
  let timer = null;

  const wrap = document.createElement('div');
  wrap.className = 'ref-carousel ref-carousel--battery';
  wrap.innerHTML = `
    <button type="button" class="ref-carousel__arrow ref-carousel__arrow--prev" aria-label="Referencia anterior">‹</button>
    <div class="ref-carousel__viewport">
      <div class="ref-carousel__track" aria-live="polite"></div>
    </div>
    <button type="button" class="ref-carousel__arrow ref-carousel__arrow--next" aria-label="Referencia siguiente">›</button>
    <div class="ref-carousel__dots" role="tablist" aria-label="Referencias de batería 1, 2 y 3"></div>
  `;

  const track = wrap.querySelector('.ref-carousel__track');
  const dots = wrap.querySelector('.ref-carousel__dots');

  groups.forEach((group, idx) => {
    const slide = document.createElement('div');
    slide.className = 'ref-carousel__slide ref-carousel__slide--single';
    const panel = createGroupPanel(group, idx + 1);
    if (panel) slide.appendChild(panel);
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'ref-carousel__dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Batería ${idx + 1}: ${group.label}`);
    dot.textContent = String(idx + 1);
    dot.addEventListener('click', () => goTo(idx, true));
    dots.appendChild(dot);
  });

  function goTo(index, pauseAuto = false) {
    currentIndex = ((index % groups.length) + groups.length) % groups.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.querySelectorAll('.ref-carousel__dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === currentIndex);
      d.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
    });
    if (pauseAuto) resetTimer();
  }

  function resetTimer() {
    if (timer) clearInterval(timer);
    if (groups.length <= 1) return;
    timer = setInterval(() => goTo(currentIndex + 1), AUTO_INTERVAL_MS);
  }

  wrap.querySelector('.ref-carousel__arrow--prev')?.addEventListener('click', () => {
    goTo(currentIndex - 1, true);
  });
  wrap.querySelector('.ref-carousel__arrow--next')?.addEventListener('click', () => {
    goTo(currentIndex + 1, true);
  });

  container.appendChild(wrap);
  goTo(0);
  resetTimer();
}

export function initReferenceCatalog() {
  const container = document.querySelector('#reference-catalog');
  if (!container) return;

  const selectedGroups = FEATURED_REF_IDS.map((id) => REFERENCE_GROUPS.find((g) => g.id === id))
    .filter(Boolean)
    .filter((g) => groupProducts(g).length > 0)
    .slice(0, BATTERY_SLIDES);

  initBatteryCarousel(container, selectedGroups);

  const total = selectedGroups.reduce((sum, g) => sum + groupProducts(g).length, 0);
  const counter = document.querySelector('#reference-count');
  if (counter) {
    counter.textContent = `3 referencias destacadas · ${total} productos · rota cada 5 segundos`;
  }
}
