/**
 * Titik masuk halaman: memasang komponen React Bits ke markup di
 * index.html dan menyambungkannya ke pengganti tema.
 *
 * Elemen dipilih lewat atribut data-*, jadi menambah kartu baru di HTML
 * cukup dengan menyalin atributnya, tanpa menyentuh file ini.
 */

import {
  AnimatedContent,
  GradientText,
  SpotlightCard,
  SplitText,
  TiltedCard,
} from './reactbits/index.js';

import { onceInView } from './reactbits/utils.js';
import Lightbox from './lightbox.js';
import { currentPalette, restoreTheme, setupThemeToggle } from './theme.js';

restoreTheme();

/** Instance yang warnanya perlu ikut berganti saat tema diganti. */
const themed = [];

/* ---------------- SplitText + GradientText: judul hero ---------------- */

/** Indeks kata pada judul hero yang diberi gradien: "Hibau". */
const GRADIENT_WORDS = [2];

const heroHeading = SplitText(document.getElementById('hero-heading'), {
  splitType: 'words',
  delay: 60,
  duration: 0.9,
  ease: 'power3.out',
  from: { opacity: 0, y: 40 },
  to: { opacity: 1, y: 0 },
  threshold: 0.1,
  rootMargin: '0px',
  onLetterAnimationComplete() {
    // Gradien dipasang setelah animasi selesai supaya pemecahan kata dan
    // pembungkusan .text-content tidak saling menimpa.
    for (const index of GRADIENT_WORDS) {
      const word = heroHeading.words[index];
      if (!word) continue;

      themed.push(
        GradientText(word, {
          colors: currentPalette().gradient,
          animationSpeed: 7,
          inline: true,
          yoyo: true,
        })
      );
    }
  },
});

/* ---------------- GradientText: judul kontak ---------------- */

themed.push(
  GradientText(document.getElementById('grad-terhubung'), {
    colors: currentPalette().gradient,
    animationSpeed: 7,
    inline: true,
    yoyo: true,
  })
);

/* ---------------- AnimatedContent: seluruh blok bertanda ---------------- */

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

/* ---------------- bar keahlian ---------------- */

// Tiap bar punya pemicunya sendiri, tidak menumpang callback penyelesaian
// AnimatedContent. Peristiwa selesai animasi tidak selalu terkirim -- di tab
// latar, misalnya -- dan kalau bar bergantung padanya, isinya tidak pernah
// terisi meski kartunya sudah terlihat. Pengisian lebarnya sendiri dianimasikan
// oleh transition di css/sections.css.
for (const bar of document.querySelectorAll('.skill-bar-fill')) {
  onceInView(bar, 0.15, '0px', () => {
    bar.style.width = `${bar.dataset.level}%`;
  });
}

/* ---------------- SpotlightCard ---------------- */

for (const el of document.querySelectorAll('[data-spotlight]')) {
  SpotlightCard(el, {
    spotlightColor:
      el.dataset.spotlight === 'accent'
        ? 'rgba(47,111,176,0.16)'
        : 'rgba(140,197,238,0.32)',
  });
}

/* ---------------- TiltedCard ---------------- */

for (const el of document.querySelectorAll('[data-tilt]')) {
  TiltedCard(el, {
    // Default React Bits 14 derajat; diturunkan karena ini kartu teks,
    // bukan gambar, dan kemiringan besar membuat teks sulit dibaca.
    rotateAmplitude: 9,
    // Default 1.1 membuat kartu saling tindih di dalam grid.
    scaleOnHover: 1.03,
    captionText: el.dataset.caption ?? '',
    showTooltip: Boolean(el.dataset.caption),
  });
}

/* ---------------- pratinjau sertifikat ---------------- */

Lightbox('.cert-thumb');

/* ---------------- sorot latar mengikuti kursor ---------------- */

const spot = document.getElementById('bg-spot');
if (spot && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener(
    'pointermove',
    (event) => {
      spot.style.setProperty('--mx', `${((event.clientX / window.innerWidth) * 100).toFixed(1)}%`);
      spot.style.setProperty('--my', `${((event.clientY / window.innerHeight) * 100).toFixed(1)}%`);
    },
    { passive: true }
  );
}

/* ---------------- tombol tema ---------------- */

setupThemeToggle(document.getElementById('theme-toggle'), (palette) => {
  themed.forEach((instance) => instance.setColors(palette.gradient));
});

/* ---------------- navigasi dalam halaman tanpa # di alamat ---------------- */

// Tautan seperti href="#kontak" tetap menggulir ke section-nya, tapi alamat
// di bar browser tetap "/" dan tidak berubah jadi "/#kontak". href-nya tetap
// ditulis "#kontak" di HTML, jadi tanpa JavaScript tautannya masih jalan.
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.button !== 0) return;
  // Ctrl/Cmd/Shift-klik dibiarkan ke perilaku bawaan browser.
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  event.preventDefault();

  const id = link.getAttribute('href').slice(1);
  // href="#" (tautan yang belum diisi): jangan lompat ke atas halaman.
  if (!id) return;

  const behavior = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth';

  // #top menunjuk <main>, yang posisinya di bawah header lengket; untuk
  // benar-benar ke paling atas, gulir ke 0.
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior, block: 'start' });

  // Pindahkan fokus ke section tujuan, seperti lompatan # bawaan browser,
  // supaya pengguna keyboard dan pembaca layar ikut berpindah.
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
});

// Tautan lama yang sudah terlanjur dibagikan dengan #, misalnya "/#kontak",
// tetap membuka section itu; setelah browser menggulir ke sana, # dibuang
// dari alamat.
if (location.hash) {
  history.replaceState(null, '', location.pathname + location.search);
}
