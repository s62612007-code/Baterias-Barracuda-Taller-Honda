const INTERVAL_MS = 5000;

const OFFERS = [
  {
    num: 1,
    title: 'Llame antes de 30 minutos',
    desc: '<strong>10% menos</strong> en el precio final de su batería',
  },
  {
    num: 2,
    title: 'Domicilio gratis',
    desc: 'Entrega e instalación sin costo de envío en Cali',
  },
  {
    num: 3,
    title: 'Renovación con soporte',
    desc: 'Soporte o borne incluido por renovación — <strong>o 7% menos</strong>',
  },
];

export function initOffersTicker() {
  const root = document.querySelector('#offers-ticker');
  if (!root) return;

  let index = 0;
  let timer = null;

  root.innerHTML = `
    <div class="offers-ticker__viewport">
      <div class="offers-ticker__track" aria-live="polite"></div>
    </div>
    <div class="offers-ticker__dots" role="tablist" aria-label="Ofertas"></div>
  `;

  const track = root.querySelector('.offers-ticker__track');
  const dots = root.querySelector('.offers-ticker__dots');

  OFFERS.forEach((offer) => {
    const slide = document.createElement('article');
    slide.className = 'offers-ticker__slide';
    slide.innerHTML = `
      <span class="offers-ticker__num">${offer.num}</span>
      <div class="offers-ticker__body">
        <h2 class="offers-ticker__title">${offer.title}</h2>
        <p class="offers-ticker__desc">${offer.desc}</p>
      </div>
    `;
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'offers-ticker__dot';
    dot.setAttribute('aria-label', `Oferta ${offer.num}`);
    dots.appendChild(dot);
  });

  function goTo(next) {
    index = ((next % OFFERS.length) + OFFERS.length) % OFFERS.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.querySelectorAll('.offers-ticker__dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === index);
    });
  }

  function start() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), INTERVAL_MS);
  }

  dots.querySelectorAll('.offers-ticker__dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      start();
    });
  });

  goTo(0);
  start();
}
