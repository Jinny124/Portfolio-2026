/**
 * Lightbox untuk pratinjau sertifikat.
 *
 * Dibangun di atas elemen <dialog> bawaan browser, jadi penutupan dengan
 * Esc, jebakan fokus, dan pengembalian fokus ke tombol pemicu sudah
 * ditangani browser tanpa kode tambahan.
 *
 * Tombol pemicu adalah <button class="cert-thumb"> yang membawa
 * data-full (berkas ukuran penuh) dan data-title (keterangan).
 */

/**
 * @param {string} selector pemilih tombol pemicu.
 * @returns {{destroy: () => void}}
 */
export default function Lightbox(selector) {
  const triggers = [...document.querySelectorAll(selector)];
  if (!triggers.length) return { destroy() {} };

  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';

  const img = document.createElement('img');
  img.alt = '';

  const bar = document.createElement('div');
  bar.className = 'lightbox-bar';

  const title = document.createElement('span');
  title.className = 'lightbox-title';

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'lightbox-close';
  close.setAttribute('aria-label', 'Tutup pratinjau');
  close.textContent = '×';

  bar.append(title, close);
  dialog.append(img, bar);
  document.body.append(dialog);

  function open(trigger) {
    const thumb = trigger.querySelector('img');
    img.src = trigger.dataset.full ?? thumb?.src ?? '';
    img.alt = thumb?.alt ?? '';
    title.textContent = trigger.dataset.title ?? thumb?.alt ?? '';
    dialog.showModal();
  }

  close.addEventListener('click', () => dialog.close());

  // Klik di luar gambar menutup pratinjau. Target klik pada latar adalah
  // elemen <dialog> itu sendiri, bukan isinya.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  // Bebaskan memori gambar besar setelah pratinjau ditutup.
  dialog.addEventListener('close', () => {
    img.removeAttribute('src');
  });

  const handlers = triggers.map((trigger) => {
    const handler = () => open(trigger);
    trigger.addEventListener('click', handler);
    return { trigger, handler };
  });

  return {
    destroy() {
      handlers.forEach(({ trigger, handler }) => trigger.removeEventListener('click', handler));
      dialog.remove();
    },
  };
}
