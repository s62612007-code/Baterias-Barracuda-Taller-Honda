import { PRODUCTS, BRAND_FILTERS, SERVICES } from '../data/products.js';
import { formatPrice, buildWhatsAppLink } from '../utils/format.js';
import { resolveImage, imageWithFallback } from '../utils/images.js';

const PAGE_SIZE = 12;
const DEFAULT_BRAND = 'DUNCAN';

const BRAND_ORDER = [
  'DUNCAN',
  'MAC',
  'VARTA',
  'WILLARD',
  'Bosch',
  'AC Delco',
  'COEXITO',
  'Rocket',
  'Optima',
  'Motorcraft',
  'Magna',
  'Yuasa',
  'CSB',
  'Estacionaria',
  'Power Taxi',
  'Hankook',
  'Otras',
  'Moto',
];

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
  Beste: 'beste',
  Paccar: 'paccar',
  Kaise: 'stationary',
  CSB: 'stationary',
  'Max Power': 'stationary',
  Trojan: 'stationary',
  Magna: 'magna',
  Yuasa: 'moto',
  Estacionaria: 'stationary',
  Moto: 'moto',
  Otras: 'generic',
  'Power Taxi': 'power-taxi',
};

function slugify(brand) {
  return brand
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function refSortKey(reference) {
  const r = reference.toUpperCase().replace(/\s+/g, '');
  const ns = r.match(/^(NS\d+)/);
  if (ns) return `0-${ns[1]}-${r}`;
  const ist = r.match(/^(\d{2})IST/);
  if (ist) return `1-${ist[1]}-${r}`;
  const num = r.match(/^(\d{2})/);
  if (num) return `2-${num[1]}-${r}`;
  return `9-${r}`;
}

function groupByBrand(products) {
  const groups = new Map();
  products.forEach((product) => {
    const brand = product.category || product.brand;
    if (!groups.has(brand)) groups.set(brand, []);
    groups.get(brand).push(product);
  });
  groups.forEach((items, brand) => {
    groups.set(
      brand,
      items.sort((a, b) => refSortKey(a.reference).localeCompare(refSortKey(b.reference), 'es')),
    );
  });
  return groups;
}

function orderedBrands(groups) {
  const seen = new Set();
  const ordered = [];
  BRAND_ORDER.forEach((brand) => {
    if (groups.has(brand)) {
      ordered.push(brand);
      seen.add(brand);
    }
  });
  [...groups.keys()]
    .filter((brand) => !seen.has(brand))
    .sort((a, b) => a.localeCompare(b, 'es'))
    .forEach((brand) => ordered.push(brand));
  return ordered;
}

function defaultBrand(brands) {
  if (brands.includes(DEFAULT_BRAND)) return DEFAULT_BRAND;
  return brands[0] || null;
}

function pageCount(total) {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

function parseHash() {
  const hash = window.location.hash.slice(1);
  const match = hash.match(/^marca-(.+?)(?:-(?:indice-|pag-)?(\d+))?$/);
  if (!match) return { brandSlug: null, page: 1 };
  return { brandSlug: match[1], page: match[2] ? Number(match[2]) : 1 };
}

function buildHash(brand, page) {
  const slug = slugify(brand);
  return page <= 1 ? `#marca-${slug}` : `#marca-${slug}-${page}`;
}

function createProductCard(product) {
  const offerBadge = product.offer ? '<span class="badge-discount">Oferta</span>' : '';
  const lineTag = product.line ? `<span class="product-card__tag">${product.line}</span>` : '';
  const originalPrice = product.originalPrice
    ? `<span class="product-card__price-old">${formatPrice(product.originalPrice)}</span>`
    : '';
  const imageSrc = resolveImage(product.image);

  const card = document.createElement('article');
  card.className = 'product-card product-card--clean';
  card.dataset.brand = product.category || product.brand;
  card.dataset.name = product.name.toLowerCase();
  card.dataset.reference = product.reference.toLowerCase();
  card.setAttribute('role', 'listitem');
  card.innerHTML = `
    <div class="product-card__image-wrap product-card__image-wrap--clean">
      ${offerBadge}
      <img
        class="product-card__image"
        src="${imageSrc}"
        alt="Batería ${product.reference} — ${product.brand}"
        loading="lazy"
        width="400"
        height="300"
      />
      <span class="product-card__ref-badge">${product.reference}</span>
    </div>
    <div class="product-card__body">
      <p class="product-card__brand-line">${product.brand}${lineTag ? ` · ${product.line}` : ''}</p>
      <h3 class="product-card__title">${product.name}</h3>
      <div class="product-card__meta">
        <span class="product-card__tag">Pol. ${product.polarity}</span>
      </div>
      <p class="product-card__price">
        ${originalPrice}
        <span class="product-card__price-current">${formatPrice(product.price)}</span>
      </p>
      <a
        class="btn btn--whatsapp btn--sm"
        href="${buildWhatsAppLink(`Hola, me interesa ${product.name} (${product.reference}) por ${formatPrice(product.price)}.`)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Cotizar
      </a>
    </div>
  `;
  if (product.image) {
    imageWithFallback(card.querySelector('.product-card__image'), product.image);
  }
  return card;
}

function createPagination(brand, currentPage, totalPages, totalProducts, onSelect) {
  const nav = document.createElement('nav');
  nav.className = 'brand-pagination';
  nav.setAttribute('aria-label', `Páginas de ${brand}`);

  const wrap = document.createElement('div');
  wrap.className = 'brand-pagination__nav';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'brand-pagination__arrow';
  prev.textContent = '← Anterior';
  prev.disabled = currentPage <= 1;
  prev.addEventListener('click', () => onSelect(currentPage - 1));

  const pages = document.createElement('div');
  pages.className = 'brand-pagination__pages';

  const maxVisible = 7;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  startPage = Math.max(1, endPage - maxVisible + 1);

  for (let i = startPage; i <= endPage; i += 1) {
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'brand-pagination__link';
    link.textContent = String(i);
    link.setAttribute('aria-label', `${brand}, página ${i} de ${totalPages}`);
    if (i === currentPage) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
    link.addEventListener('click', () => onSelect(i));
    pages.appendChild(link);
  }

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'brand-pagination__arrow';
  next.textContent = 'Siguiente →';
  next.disabled = currentPage >= totalPages;
  next.addEventListener('click', () => onSelect(currentPage + 1));

  wrap.appendChild(prev);
  wrap.appendChild(pages);
  wrap.appendChild(next);
  nav.appendChild(wrap);
  return nav;
}

function createPageInfo(brand, currentPage, totalPages, totalProducts) {
  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, totalProducts);
  const info = document.createElement('div');
  info.className = 'catalog-page-info';
  info.innerHTML = `
    <p class="catalog-page-info__range">
      <em>${brand}</em> · Mostrando ${start}–${end} de ${totalProducts} baterías
    </p>
    <p class="catalog-page-info__steps">
      Página ${currentPage} de ${totalPages} · Elija otra marca arriba
    </p>
  `;
  return info;
}

function scrollBrandIntoView(track, brand) {
  const pill = track.querySelector(`[data-brand="${CSS.escape(brand)}"]`);
  if (pill) {
    pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}

function renderBrandCarousel(track, brands, groups, activeBrand, onSelect) {
  track.innerHTML = '';
  brands.forEach((brand) => {
    const count = groups.get(brand).length;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `brand-carousel__pill brand-carousel__pill--${BRAND_CLASS[brand] || 'mac'}`;
    btn.dataset.brand = brand;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', brand === activeBrand ? 'true' : 'false');
    btn.innerHTML = `<span class="brand-carousel__name">${brand}</span><span class="brand-carousel__count">${count}</span>`;
    if (brand === activeBrand) btn.classList.add('is-active');
    btn.addEventListener('click', () => onSelect(brand, 1));
    track.appendChild(btn);
  });
  scrollBrandIntoView(track, activeBrand);
}

function renderBrandSection(container, brand, products, page, onPageChange) {
  container.innerHTML = '';
  const brandClass = BRAND_CLASS[brand] || 'mac';
  const brandSlug = slugify(brand);
  const totalPages = pageCount(products.length);
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const slice = products.slice(start, start + PAGE_SIZE);

  const section = document.createElement('section');
  section.className = `brand-block brand-block--${brandClass} brand-block--clean`;
  section.id = `marca-${brandSlug}`;
  section.dataset.brand = brand;

  const header = document.createElement('header');
  header.className = 'brand-block__header brand-block__header--clean';
  header.innerHTML = `
    <div class="brand-block__heading">
      <h3 class="brand-block__title">${brand}</h3>
      <p class="brand-block__count">${products.length} referencias · ${safePage} de ${totalPages}</p>
    </div>
    <div class="brand-block__actions">
      <a
        class="btn btn--whatsapp btn--sm"
        href="${buildWhatsAppLink(`Hola, quiero cotizar baterías ${brand}.`)}"
        target="_blank"
        rel="noopener noreferrer"
      >Cotizar ${brand}</a>
      <a class="btn btn--primary btn--sm" href="#buscador?marca=${brandSlug}">Aplicativo auto</a>
    </div>
  `;
  section.appendChild(header);
  section.appendChild(createPageInfo(brand, safePage, totalPages, products.length));

  if (totalPages > 1) {
    section.appendChild(createPagination(brand, safePage, totalPages, products.length, (p) => onPageChange(brand, p)));
  }

  const grid = document.createElement('div');
  grid.className = 'products-grid products-grid--12 brand-block__grid';
  grid.setAttribute('role', 'list');
  slice.forEach((product) => grid.appendChild(createProductCard(product)));
  section.appendChild(grid);

  if (totalPages > 1) {
    const bottomNav = createPagination(brand, safePage, totalPages, products.length, (p) => onPageChange(brand, p));
    bottomNav.classList.add('brand-pagination--bottom');
    section.appendChild(bottomNav);
  }

  container.appendChild(section);
}

function renderSearchResults(container, products, query) {
  container.innerHTML = '';
  const sorted = [...products].sort((a, b) =>
    refSortKey(a.reference).localeCompare(refSortKey(b.reference), 'es'),
  );
  const section = document.createElement('section');
  section.className = 'brand-block brand-block--search brand-block--clean';
  section.innerHTML = `
    <header class="brand-block__header brand-block__header--clean">
      <h3 class="brand-block__title">Resultados</h3>
      <p class="brand-block__count">${sorted.length} coincidencia${sorted.length === 1 ? '' : 's'} para “${query}”</p>
    </header>
  `;
  const grid = document.createElement('div');
  grid.className = 'products-grid products-grid--12 brand-block__grid';
  grid.setAttribute('role', 'list');
  sorted.forEach((product) => grid.appendChild(createProductCard(product)));
  section.appendChild(grid);
  container.appendChild(section);
}

function updateCount(groups, activeBrand, query, visibleCount) {
  const counter = document.querySelector('#catalog-count');
  if (!counter) return;
  if (query) {
    counter.textContent = `${visibleCount} resultado${visibleCount === 1 ? '' : 's'} para “${query}”`;
    return;
  }
  if (activeBrand) {
    const total = groups.get(activeBrand)?.length || 0;
    const pages = pageCount(total);
    counter.textContent = `${activeBrand}: ${total} referencias · ${pages} página${pages === 1 ? '' : 's'} de ${PAGE_SIZE}`;
    return;
  }
  counter.textContent = `${PRODUCTS.length} productos · inicia en DUNCAN`;
}

export function initCatalog() {
  const carouselWrap = document.querySelector('#brand-carousel');
  const carouselTrack = document.querySelector('#brand-jump');
  const sectionsContainer = document.querySelector('#brand-sections');
  const search = document.querySelector('#catalog-search');

  if (!carouselTrack || !sectionsContainer) return;

  const groups = groupByBrand(PRODUCTS);
  const brands = orderedBrands(groups);
  let activeBrand = defaultBrand(brands);
  let activePage = 1;
  let searchQuery = '';

  carouselWrap?.querySelector('.brand-carousel__prev')?.addEventListener('click', () => {
    carouselTrack.scrollBy({ left: -220, behavior: 'smooth' });
  });
  carouselWrap?.querySelector('.brand-carousel__next')?.addEventListener('click', () => {
    carouselTrack.scrollBy({ left: 220, behavior: 'smooth' });
  });

  function syncFromHash() {
    if (searchQuery) return;
    const { brandSlug, page } = parseHash();
    if (!brandSlug) return;
    const brand = brands.find((b) => slugify(b) === brandSlug);
    if (brand) {
      activeBrand = brand;
      activePage = page;
    }
  }

  function updateHash(brand, page) {
    if (searchQuery) return;
    const hash = buildHash(brand, page);
    if (window.location.hash !== hash) {
      history.replaceState(null, '', hash);
    }
  }

  function selectBrand(brand, page = 1) {
    activeBrand = brand;
    activePage = page;
    updateHash(brand, page);
    render();
  }

  function render() {
    if (searchQuery) {
      const q = searchQuery.trim().toLowerCase();
      const matches = PRODUCTS.filter((p) => {
        const brand = (p.category || p.brand).toLowerCase();
        const haystack = `${p.name} ${p.reference} ${brand}`.toLowerCase();
        return haystack.includes(q);
      });
      carouselTrack.querySelectorAll('.brand-carousel__pill').forEach((p) => p.classList.remove('is-active'));
      if (matches.length === 0) {
        sectionsContainer.innerHTML = `<p class="catalog-placeholder">Sin resultados para “${searchQuery}”.</p>`;
      } else {
        renderSearchResults(sectionsContainer, matches, searchQuery);
      }
      updateCount(groups, null, searchQuery, matches.length);
      return;
    }

    syncFromHash();
    if (!activeBrand && brands.length) activeBrand = defaultBrand(brands);

    renderBrandCarousel(carouselTrack, brands, groups, activeBrand, selectBrand);

    const products = groups.get(activeBrand) || [];
    renderBrandSection(sectionsContainer, activeBrand, products, activePage, (brand, page) => {
      activeBrand = brand;
      activePage = page;
      updateHash(brand, page);
      render();
      document.querySelector('#catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    updateCount(groups, activeBrand, '', products.length);
  }

  search?.addEventListener('input', () => {
    searchQuery = search.value;
    render();
  });

  window.addEventListener('hashchange', () => {
    if (!searchQuery) render();
  });

  if (!window.location.hash.includes('marca-')) {
    activeBrand = defaultBrand(brands);
    activePage = 1;
    updateHash(activeBrand, 1);
  }

  render();
}
