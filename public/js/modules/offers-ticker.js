const INTERVAL_MS = 5000;

export function initOffersTicker() {
  const root = document.querySelector('#offers-ticker');
  if (!root) return;

  const cards = [...root.querySelectorAll('.offer-card')];
  if (cards.length === 0) return;

  let index = 0;
  let timer = null;

  function goTo(next) {
    index = ((next % cards.length) + cards.length) % cards.length;
    cards.forEach((card, i) => {
      card.classList.toggle('offer-card--active', i === index);
    });
  }

  function start() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), INTERVAL_MS);
  }

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      goTo(i);
      start();
    });
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goTo(i);
        start();
      }
    });
  });

  goTo(0);
  start();
}
