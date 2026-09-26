# Eugenia Laellisa Hibau — Portofolio

Portofolio satu halaman untuk Eugenia "Jinny" Laellisa Hibau (System Analyst ·
Frontend Developer · Quality Assurance). Dibangun dengan HTML, CSS, dan
JavaScript murni — tanpa framework, tanpa bundler, tanpa `npm install`, dan
tanpa library eksternal selain Google Fonts.

Efek teksnya dan kartunya adalah port vanilla dari komponen
[React Bits](https://www.reactbits.dev/).

Tampilan: latar putih dengan aksen baby blue, font **Syne** untuk judul,
**Karla** untuk teks, **Fragment Mono** untuk label. Tema terang adalah bawaan
untuk semua pengunjung; tema gelap navy hanya lewat tombol di navigasi.

---

## Menjalankan

Halaman ini memakai ES Module, jadi harus dibuka lewat HTTP, bukan dengan
klik dua kali berkas `index.html`. Pilih salah satu cara:

**Live Server (paling mudah di VS Code)**

Pasang ekstensi Live Server — VS Code akan menawarkannya otomatis karena
sudah terdaftar di `.vscode/extensions.json`. Lalu klik kanan `index.html`
→ **Open with Live Server**.

**Python**

```bash
py -3 -m http.server 5500
```

Buka `http://localhost:5500`.

**Node**

```bash
npx serve .
```

> Kalau `index.html` dibuka langsung tanpa server, seluruh teks dan tata
> letak tetap tampil normal — yang hilang hanya animasinya,
> karena browser menolak memuat modul dari `file://`.

---

## Struktur berkas

```
MyPorto2026/
├── index.html              # markup halaman
├── assets/
│   └── sertifikat/         # gambar sertifikat, sisi panjang maks 1400 px
├── css/
│   ├── tokens.css          # variabel warna, radius, font (terang & gelap)
│   ├── base.css            # reset, tipografi dasar, .container
│   ├── reactbits.css       # CSS komponen React Bits
│   ├── layout.css          # latar, navigasi, tombol, hero, footer
│   └── sections.css        # Tentang, Keahlian, Proyek, Sertifikat, Kontak
└── js/
    ├── main.js             # memasang komponen ke elemen di index.html
    ├── theme.js            # tema gelap/terang + palet warna
    ├── lightbox.js         # pratinjau sertifikat ukuran penuh (<dialog>)
    └── reactbits/
        ├── index.js        # titik ekspor semua komponen
        ├── utils.js        # easing, keyframe, pegas, ticker bersama
        ├── SplitText.js
        ├── GradientText.js
        ├── AnimatedContent.js
        ├── SpotlightCard.js
        └── TiltedCard.js
```

---

## Komponen React Bits

Lima komponen diport dari React ke JavaScript biasa. Nama prop dan nilai
default dipertahankan, jadi dokumentasi di reactbits.dev tetap berlaku.

| Komponen | Dependensi asli | Pengganti di sini |
| --- | --- | --- |
| `SplitText` | `gsap` + ScrollTrigger + plugin SplitText | Web Animations API + IntersectionObserver |
| `GradientText` | `motion` (`useAnimationFrame`) | `requestAnimationFrame` |
| `AnimatedContent` | `gsap` + ScrollTrigger | Web Animations API + IntersectionObserver |
| `SpotlightCard` | — | sudah vanilla dari aslinya, disalin 1:1 |
| `TiltedCard` | `motion` (`useSpring`) | integrator pegas sendiri, konfigurasi sama |

Pola pemakaiannya seragam:

```js
import { SpotlightCard } from './reactbits/index.js';

const card = SpotlightCard(element, { spotlightColor: 'rgba(47,111,176,0.16)' });
card.destroy(); // lepas semua listener
```

### Penyimpangan yang disengaja

Semuanya ditandai komentar di berkas terkait:

- `GradientText` aslinya mengunci warna latar border ke `#120F17`. Di sini
  dipakai `var(--bg-elevated)` supaya tema terang tidak rusak. Ditambahkan
  juga varian `.inline` untuk memakai gradien pada satu kata di tengah kalimat.
- `TiltedCard` aslinya membungkus `<img>`. Di sini tilt dipasang ke kartu
  berisi teks, dan `scaleOnHover` diturunkan dari `1.1` ke `1.03` karena
  nilai aslinya membuat kartu saling tindih di dalam grid.
- `SplitText` aslinya hanya menunggu `document.fonts.ready`. Di koneksi
  lambat itu membuat judul hero kosong beberapa detik, jadi ditambahkan
  batas waktu 800 ms.
- `onceInView()` di `utils.js` memasang pemeriksaan viewport manual sebagai
  cadangan IntersectionObserver. Sebagian browser tidak mengirim callback
  observer selama tab belum pernah ditampilkan, dan tanpa cadangan itu isi
  halaman bisa tertinggal pada `opacity 0`.

---

## Menyunting isi

Sebagian besar perubahan cukup dilakukan di `index.html`.

**Menambah kartu keahlian, proyek, atau sertifikat** — salin satu blok kartu
yang sudah ada. Atribut `data-*` yang menyalakan komponen:

| Atribut | Efek |
| --- | --- |
| `data-animated-content` | kartu meluncur masuk saat di-scroll |
| `data-ac-delay="0.08"` | jeda animasi masuk, dalam detik |
| `data-spotlight` | sorot mengikuti kursor (warna toska) |
| `data-spotlight="accent"` | sorot mengikuti kursor (warna ungu) |
| `data-tilt` | kartu miring 3D saat hover |
| `data-caption="Teks"` | tooltip yang mengikuti kursor |
| `data-level="72"` | persentase bar keahlian |

**Mengisi sertifikat** — tiap kartu di section `#sertifikat` punya tiga bagian.
Kartunya sengaja ringkas: gambar, judul, dan bulan-tahun terbit.

| Class | Isi |
| --- | --- |
| `.cert-thumb` | tombol pratinjau; `data-full` menunjuk berkas gambar, `data-title` jadi keterangan di lightbox |
| `.cert-title` | nama sertifikat |
| `.cert-date` | bulan dan tahun terbit |

Kartu diurutkan manual dari tahun terbaru ke terlama; menambah kartu baru
berarti menaruhnya di posisi yang sesuai urutan tahun, bukan di akhir daftar.

Gambarnya disimpan di `assets/sertifikat/`. Sebelum ditaruh di sana, ubah
ukurannya dulu sampai sisi panjang maksimal 1400 piksel dan simpan sebagai
JPEG kualitas sekitar 80. Berkas asli dari penerbit sering berukuran
beberapa megabita dan akan membuat halaman berat.

Mengklik pratinjau membuka `js/lightbox.js`, yang memakai elemen `<dialog>`
bawaan browser. Penutupan dengan Esc, jebakan fokus, dan pengembalian fokus
ke tombol pemicu ditangani browser, bukan kode sendiri.

Tautan verifikasi bersifat opsional. Kalau penerbitnya menyediakan halaman
verifikasi, tambahkan satu baris di dalam `<article>`:

```html
<a class="cert-link" href="https://...">Lihat kredensial &rarr;</a>
```

Menambah kartu cukup dengan menyalin satu blok `<article>`; tidak ada yang
perlu disentuh di berkas JavaScript.

**Mengubah warna** — semua nilai ada di `css/tokens.css`. Kalau warna aksen
diubah, samakan juga daftar warna di `PALETTES` pada `js/theme.js`, karena
gradien teks membaca dari sana.

**Mengubah judul hero** — tulis kalimat baru di `<h1 id="hero-heading">`,
lalu sesuaikan `GRADIENT_WORDS` di `js/main.js` (indeks kata dihitung dari
nol) supaya kata yang diberi gradien tetap pas.

---

## Yang masih perlu diisi

- Tautan detail di tiga kartu proyek masih `href="#"`.
- Isi proyek masih contoh; ganti dengan studi kasus asli.
- Belum ada tautan verifikasi di kartu sertifikat.
