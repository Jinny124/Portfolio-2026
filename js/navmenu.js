/**
 * Menu navigasi mobile (hamburger).
 *
 * Di bawah 720px, nav.links (pill horizontal) disembunyikan oleh CSS --
 * modul ini yang menampilkannya kembali sebagai panel dropdown lewat
 * class "menu-open" pada header.nav, dipicu tombol hamburger.
 */

/**
 * @param {HTMLElement|null} nav elemen header.nav
 * @param {HTMLElement|null} toggle tombol hamburger
 */
export function setupMobileNav(nav, toggle) {
  if (!nav || !toggle) return;

  const links = nav.querySelector('nav.links');

  function setOpen(open) {
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('menu-open'));
  });

  // Klik tautan di dalam menu menutupnya -- perlu di halaman index.html,
  // tempat tautan cuma menggulir tanpa memuat ulang halaman.
  links?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (!nav.classList.contains('menu-open')) return;
    if (nav.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
}
