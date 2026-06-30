const PLACEHOLDER = 'assets/images/honda-logo.svg';

export function resolveImage(src) {
  if (!src) return PLACEHOLDER;
  if (src.startsWith('http')) return src;
  return src;
}

export function imageWithFallback(imgEl, src) {
  imgEl.src = resolveImage(src);
  imgEl.addEventListener(
    'error',
    () => {
      if (!imgEl.dataset.fallback) {
        imgEl.dataset.fallback = '1';
        imgEl.src = PLACEHOLDER;
      }
    },
    { once: true },
  );
}
