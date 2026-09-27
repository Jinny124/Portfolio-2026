/**
 * Titik masuk halaman detail proyek (projects/*.html).
 *
 * Jauh lebih ringan daripada js/main.js: halaman ini tidak punya hero
 * dengan SplitText/GradientText atau kartu dengan SpotlightCard/
 * TiltedCard -- jadi cukup tombol tema, animasi masuk saat di-scroll,
 * dan lightbox untuk gambar diagram/kode (kalau halamannya punya).
 */

import { AnimatedContent } from './reactbits/index.js';
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

Lightbox('.pd-lightbox-trigger');

setupThemeToggle(document.getElementById('theme-toggle'));
