/**
 * Titik masuk halaman detail proyek (projects/*.html).
 *
 * Jauh lebih ringan daripada js/main.js: halaman ini tidak punya hero
 * dengan SplitText/GradientText, kartu dengan SpotlightCard/TiltedCard,
 * atau lightbox sertifikat -- jadi cukup tombol tema dan animasi masuk
 * saat di-scroll.
 */

import { AnimatedContent } from './reactbits/index.js';
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

setupThemeToggle(document.getElementById('theme-toggle'));
