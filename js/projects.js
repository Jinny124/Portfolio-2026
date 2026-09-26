/**
 * Titik masuk halaman projects.html: daftar lengkap semua proyek.
 *
 * Mirip js/project-page.js, tapi ditambah SpotlightCard/TiltedCard supaya
 * kartu proyek berperilaku sama seperti di index.html.
 */

import { AnimatedContent, SpotlightCard, TiltedCard } from './reactbits/index.js';
import { restoreTheme, setupThemeToggle } from './theme.js';

restoreTheme();

for (const el of document.querySelectorAll('[data-animated-content]')) {
  AnimatedContent(el, {
    distance: 40,
    direction: 'vertical',
    duration: 0.8,
    ease: 'power3.out',
    threshold: 0.15,
    delay: Number.parseFloat(el.dataset.acDelay ?? '0'),
  });
}

for (const el of document.querySelectorAll('[data-spotlight]')) {
  SpotlightCard(el, {
    spotlightColor: 'rgba(47,111,176,0.16)',
  });
}

for (const el of document.querySelectorAll('[data-tilt]')) {
  TiltedCard(el, {
    rotateAmplitude: 9,
    scaleOnHover: 1.03,
    captionText: el.dataset.caption ?? '',
    showTooltip: Boolean(el.dataset.caption),
  });
}

setupThemeToggle(document.getElementById('theme-toggle'));
