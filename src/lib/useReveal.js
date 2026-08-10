import { useEffect } from 'react';

const REVEAL_SELECTOR = '[data-reveal]';
const SPLIT_SELECTOR = '[data-split]';

function easeOutCubic(p) {
  return 1 - Math.pow(1 - p, 3);
}

function runCountUp(el) {
  const raw = el.dataset.countup;
  if (raw === undefined) return;
  const target = parseFloat(raw) || 0;
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = parseInt(el.dataset.duration || '1600', 10);
  const decimals = Math.max(0, (raw.split('.')[1] || '').length);
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const value = target * easeOutCubic(p);
    el.textContent = prefix + (decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString()) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Split text into masked words + characters so headings can animate letter-by-letter. */
function splitHeading(el) {
  if (el.dataset.splitDone === '1') return;
  el.dataset.splitDone = '1';
  const text = el.textContent;
  if (!text) return;
  const label = text.replace(/\s+/g, ' ').trim();
  if (label) el.setAttribute('aria-label', label);
  el.textContent = '';

  let charIndex = 0;
  text.split(/(\s+)/).forEach((part) => {
    if (!part.trim()) {
      el.appendChild(document.createTextNode(' '));
      return;
    }
    const word = document.createElement('span');
    word.className = 'split-word';
    word.setAttribute('aria-hidden', 'true');
    Array.from(part).forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'split-char';
      span.style.setProperty('--i', charIndex++);
      span.textContent = ch;
      word.appendChild(span);
    });
    el.appendChild(word);
  });
}

export function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(REVEAL_SELECTOR));
    const splitEls = Array.from(document.querySelectorAll(SPLIT_SELECTOR));
    if (!els.length && !splitEls.length) return undefined;

    splitEls.forEach(splitHeading);

    els.forEach((el) => el.classList.add('reveal-ready'));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const parent = el.closest('[data-stagger]');
          if (parent) {
            const siblings = Array.from(parent.querySelectorAll(REVEAL_SELECTOR));
            const index = siblings.indexOf(el);
            el.style.transitionDelay = `${Math.min(index, 12) * 90}ms`;
          }
          runCountUp(el);
          el.classList.add('is-revealed');
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    els.forEach((el) => io.observe(el));

    const splitObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          splitObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.35, rootMargin: '0px 0px -6% 0px' }
    );

    splitEls.forEach((el) => {
      el.classList.add('split-ready');
      splitObserver.observe(el);
    });

    return () => {
      io.disconnect();
      splitObserver.disconnect();
    };
  });
}

export function useScrolled() {
  useEffect(() => {
    const onScroll = () => {
      document.documentElement.classList.toggle('is-scrolled', window.scrollY > 16);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
}

export function useParallax() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!els.length) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        els.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax || '0.2');
          const rect = el.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          const mid = window.innerHeight / 2;
          const offset = (mid - (rect.top + rect.height / 2)) * speed;
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        });
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
}
