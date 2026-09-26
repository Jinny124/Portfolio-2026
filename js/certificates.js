/**
 * Titik masuk halaman certificates.html: daftar lengkap semua sertifikat.
 *
 * Mirip js/project-page.js, tapi ditambah SpotlightCard/TiltedCard dan
 * Lightbox supaya kartu sertifikat berperilaku sama seperti di index.html.
 */

import { AnimatedContent, SpotlightCard, TiltedCard } from './reactbits/index.js';
import Lightbox from './lightbox.js';
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
    spotlightColor: 'rgba(140,197,238,0.32)',
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

Lightbox('.cert-thumb');

setupThemeToggle(document.getElementById('theme-toggle'));
