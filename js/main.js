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

/**
 * Gulir ke section dengan id tertentu, seperti lompatan # bawaan
 * browser, tapi dipicu manual supaya bisa dipakai baik dari klik
 * langsung maupun dari alamat yang sudah membawa # saat halaman
 * dimuat (lihat pemakaian di bawah).
 * @param {string} id
 * @param {'smooth'|'auto'} [behaviorOverride] paksa satu nilai behavior,
 *        lewati deteksi prefers-reduced-motion. Dipakai untuk lompatan
 *        saat halaman baru dimuat -- lihat komentar di pemanggilnya.
 */
function scrollToSection(id, behaviorOverride) {
  // 'auto' bukan "instan" -- artinya "ikut CSS scroll-behavior", dan
  // base.css set scroll-behavior: smooth di <html>. Jadi instan yang benar
  // harus eksplisit 'instant', bukan 'auto'.
  const behavior =
    behaviorOverride ??
    (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth');

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
}

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

  scrollToSection(id);
});

// Tautan dari halaman lain yang menuju sini dengan #, misalnya
// "projects/qa-checkout.html" -> "../index.html#kontak", atau tautan lama
// yang sudah terlanjur dibagikan dengan #. Digulir manual dulu -- bukan
// mengandalkan lompatan # bawaan browser -- karena replaceState di bawah
// membuang location.hash sebelum lompatan bawaan itu sempat terjadi,
// sehingga kalau dibiarkan, halaman malah diam di posisi paling atas.
//
// Behavior dipaksa 'instant', bukan 'smooth': lompatan # bawaan browser
// sendiri juga selalu instan, jadi ini tidak mengurangi apa-apa dari
// perilaku normal. ('auto' TIDAK berarti instan -- itu berarti "ikut
// scroll-behavior CSS", dan base.css set itu ke smooth di <html>, jadi
// 'auto' di sini justru tetap animasi smooth.)
//
// scrollIntoView dipanggil berulang lewat requestAnimationFrame, bukan
// sekali saja -- di tab yang baru dimuat dan belum sempat digambar
// (atau masih di latar), satu panggilan bisa diam-diam tidak berefek
// sama sekali (bukan cuma telat: posisi gulir benar-benar tidak
// berubah). Mengulang beberapa kali menjamin salah satu percobaan jatuh
// di frame yang sudah bisa menggambar. Kalau percobaan pertama sudah
// berhasil (kasus normal), sisa percobaan cuma menegaskan ulang posisi
// yang sama, tidak berdampak apa pun.
/* ---------------- navigasi: sorot tautan sesuai section yang terlihat ---------------- */

const navLinks = [...document.querySelectorAll('nav.links a[href^="#"]')];
const navSectionMap = new Map();
for (const link of navLinks) {
  const section = document.getElementById(link.getAttribute('href').slice(1));
  if (section) navSectionMap.set(section, link);
}

function setActiveNavLink(activeLink) {
  for (const link of navLinks) link.classList.toggle('is-active', link === activeLink);
}

// Tentang jadi sorotan bawaan (hero di atasnya belum punya tautan sendiri).
if (navLinks[0]) setActiveNavLink(navLinks[0]);

if (navSectionMap.size && 'IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveNavLink(navSectionMap.get(entry.target));
      }
    },
    // Pita tipis di 35% dari atas viewport: section "aktif" adalah yang
    // sedang melewati pita itu saat digulir, bukan yang sekadar terlihat.
    { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
  );
  for (const section of navSectionMap.keys()) navObserver.observe(section);
}

if (location.hash) {
  const id = location.hash.slice(1);
  history.replaceState(null, '', location.pathname + location.search);

  (document.fonts?.ready ?? Promise.resolve()).then(() => {
    let sisaPercobaan = 15;
    function ulangGulir() {
      scrollToSection(id, 'instant');
      sisaPercobaan -= 1;
      if (sisaPercobaan > 0) requestAnimationFrame(ulangGulir);
    }
    ulangGulir();
  });
}
