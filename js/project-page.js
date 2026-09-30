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
import { setupMobileNav } from './navmenu.js';

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

/* Tab alur (Key flows): satu panel gambar+teks yang kontennya diganti
   sesuai tab yang diklik, bukan menumpuk 4 kartu sekaligus. No-op di
   halaman yang tidak punya .pd-flow-tabs. */
for (const tabs of document.querySelectorAll('.pd-flow-tabs')) {
  const tablist = tabs.querySelector('.pd-flow-tablist');
  const panelTrigger = tabs.querySelector('.pd-flow-panel-img');
  const panelImg = panelTrigger.querySelector('img');
  const panelType = tabs.querySelector('.pd-flow-panel-text .pill');
  const panelName = tabs.querySelector('.pd-flow-panel-text h3');
  const panelDesc = tabs.querySelector('.pd-flow-panel-text p');

  tablist.addEventListener('click', (event) => {
    const tab = event.target.closest('.pd-flow-tab');
    if (!tab || tab.classList.contains('is-active')) return;

    for (const other of tablist.querySelectorAll('.pd-flow-tab')) {
      other.classList.toggle('is-active', other === tab);
      other.setAttribute('aria-selected', String(other === tab));
    }

    panelImg.src = tab.dataset.img;
    panelImg.alt = tab.dataset.alt;
    panelTrigger.dataset.full = tab.dataset.img;
    panelTrigger.dataset.title = tab.dataset.alt;
    panelType.textContent = tab.dataset.type;
    panelName.textContent = tab.dataset.name;
    panelDesc.textContent = tab.dataset.desc;
  });
}

/* Carousel Screens (mobile): titik halaman mengikuti kartu yang lagi
   di tengah layar saat digeser. No-op di halaman yang tidak punya
   .pd-screens-dots (cuma Digital Invitation saat ini). */
for (const dotsEl of document.querySelectorAll('.pd-screens-dots')) {
  const row = dotsEl.previousElementSibling;
  if (!row || !row.classList.contains('pd-screens-row')) continue;

  const items = [...row.children];
  const dots = [...dotsEl.children];

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const index = items.indexOf(entry.target);
        for (const [i, dot] of dots.entries()) dot.classList.toggle('is-active', i === index);
      }
    },
    { root: row, threshold: 0.6 }
  );

  for (const item of items) observer.observe(item);
}

setupThemeToggle(document.getElementById('theme-toggle'));
setupMobileNav(document.querySelector('header.nav'), document.getElementById('nav-toggle'));
