# Aturan Konsistensi Karakter (WAJIB)

Setiap pembuatan scene atau episode video ke depan WAJIB mengimpor `<KarakterUtama />` dan `<KarakterTeman />` dari `src/components/KarakterBlocky.tsx`. DILARANG keras menggambar ulang bentuk kepala, proporsi badan kotak, rambut, atau palet warna karakter secara manual. Untuk mengubah ekspresi atau gerakan mulut, gunakan hanya props yang tersedia.

## Props yang tersedia

- `ekspresi`: `'serius' | 'ngomong' | 'nyindir' | 'panik'`
- `mulutTerbuka`: `number` (0 sampai 1)
- `pegangHP`: `boolean` (khusus `KarakterUtama`)
- `scale`: `number` (default `1`)

`mulutTerbuka` hanya berpengaruh pada ekspresi `ngomong` (lip-sync) dan `panik`.

## Catatan versi 3D

- Karakter sekarang **3D sungguhan** (Three.js lewat `@remotion/three`): kotak membulat, outline hitam tebal, pencahayaan dan sudut pandang 3/4 yang tetap.
- Setiap `<KarakterUtama />` / `<KarakterTeman />` merender kanvas 3D sendiri berukuran `400 x 520 px` dikali `scale`, berlatar transparan. Letakkan di scene seperti elemen biasa.
- Warna terkunci di `src/components/palet.ts`. Jangan hardcode warna karakter di tempat lain.
- `src/components/KarakterBlocky2D.tsx` adalah versi SVG lama (legacy). DILARANG dipakai untuk scene baru.

## Render (WebGL)

- Composition yang memakai karakter 3D butuh WebGL. Di mesin tanpa GPU, render dengan `--gl=swangle`.
- Jika Chrome Headless Shell Remotion tidak bisa diunduh, tambahkan `--browser-executable=<path chrome>`.

## Referensi

- Preview resmi karakter: `out/character-sheet.png` (composition `CharacterSheet` di `src/Root.tsx`).
- Re-render preview: `npm run sheet`.
