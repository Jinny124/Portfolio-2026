/**
 * Pengelolaan tema terang/gelap.
 *
 * Tema terang (sage dan putih) adalah bawaan untuk semua pengunjung,
 * termasuk yang sistemnya diatur gelap. Tema gelap hanya aktif kalau
 * pengunjung memilihnya lewat tombol, dan pilihan itu diingat di
 * localStorage.
 *
 * Nilai warna sebenarnya ada di css/tokens.css; file ini hanya
 * memasang atribut data-theme di elemen <html>.
 */

// Kunci baru: pilihan tema dari desain lama (gelap-ungu) sengaja tidak
// dibawa, supaya semua orang melihat tampilan sage terang dulu.
const STORAGE_KEY = 'eugenia-theme';
const root = document.documentElement;

/** Palet yang dipakai efek JavaScript, disamakan dengan token CSS. */
export const PALETTES = {
  light: {
    gradient: ['#2f6fb0', '#7fbbe8', '#1f5a94'],
  },
  dark: {
    gradient: ['#8cc5ee', '#bfe0f7', '#6aaee0'],
  },
};

/** Baca pilihan tersimpan. Mode penyamaran bisa melarang akses. */
function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function writeStored(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Penyimpanan diblokir; tema tetap jalan, hanya tidak diingat.
  }
}

/** Terapkan pilihan tersimpan sebelum halaman digambar. */
export function restoreTheme() {
  const stored = readStored();
  if (stored) root.setAttribute('data-theme', stored);
}

/** @returns {boolean} apakah tampilan saat ini gelap. */
export function isDark() {
  return root.getAttribute('data-theme') === 'dark';
}

/** @returns {{gradient: string[]}} palet tema aktif. */
export function currentPalette() {
  return isDark() ? PALETTES.dark : PALETTES.light;
}

/**
 * Pasang tombol pengganti tema.
 * @param {HTMLElement} button
 * @param {(palette: {gradient: string[]}) => void} onChange
 */
export function setupThemeToggle(button, onChange) {
  if (!button) return;

  button.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    writeStored(next);
    onChange?.(currentPalette());
  });
}
