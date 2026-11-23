import React, {useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {BackSide} from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {PALET, type Ekspresi} from './palet';

/**
 * ============================================================
 *  KARAKTER BLOCKY 3D — ASET PERMANEN (JANGAN DIGAMBAR ULANG)
 * ============================================================
 *  Semua scene/episode WAJIB memakai <KarakterUtama /> dan
 *  <KarakterTeman /> dari file ini. Ubah ekspresi/mulut hanya
 *  lewat props. Lihat CLAUDE.md untuk aturan lengkap.
 *
 *  Setiap komponen merender kanvas 3D sendiri berukuran
 *  400x520 px x scale, dengan latar transparan.
 */

export type {Ekspresi};
export {PALET};

export interface KarakterProps {
  /** Ekspresi wajah. */
  ekspresi?: Ekspresi;
  /** Bukaan mulut 0..1. Dipakai oleh `ngomong` (lip-sync) dan `panik`. */
  mulutTerbuka?: number;
  /** Skala keseluruhan karakter (default 1). Ukuran dasar 400x520 px. */
  scale?: number;
}

export interface KarakterUtamaProps extends KarakterProps {
  /** Tangan memegang smartphone merah menyala menghadap kamera. */
  pegangHP?: boolean;
}

type V3 = [number, number, number];
type Tema = typeof PALET.utama | typeof PALET.teman;

const OUT = 0.1; // ketebalan outline hitam (unit dunia)
const OUT_KECIL = 0.04; // outline untuk detail wajah
const clamp01 = (n: number) => Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));

// ---------- Primitif: kotak membulat + outline hitam tebal ----------
const Kotak: React.FC<{
  size: V3;
  pos?: V3;
  rot?: V3;
  color: string;
  radius?: number;
  outline?: number;
  emissive?: string;
}> = ({size, pos = [0, 0, 0], rot = [0, 0, 0], color, radius = 0.16, outline = OUT, emissive}) => {
  const [w, h, d] = size;
  const r = Math.max(0.005, Math.min(radius, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001));
  const geo = useMemo(() => new RoundedBoxGeometry(w, h, d, 4, r), [w, h, d, r]);
  const geoOut = useMemo(
    () => new RoundedBoxGeometry(w + 2 * outline, h + 2 * outline, d + 2 * outline, 4, r + outline),
    [w, h, d, r, outline],
  );
  return (
    <group position={pos} rotation={rot}>
      <mesh geometry={geo}>
        <meshLambertMaterial color={color} emissive={emissive ?? '#000000'} />
      </mesh>
      {outline > 0 && (
        <mesh geometry={geoOut}>
          <meshBasicMaterial color={PALET.outline} side={BackSide} />
        </mesh>
      )}
    </group>
  );
};

// ---------- Wajah ----------
const FZ = 1.06; // bidang depan wajah (kepala depth 2.0 -> permukaan z=1.0)
const MATA_Y = 3.5;
const MATA_X = 0.55;
const MULUT_ATAS = 2.95;

const Mata: React.FC<{x: number; ekspresi: Ekspresi}> = ({x, ekspresi}) => {
  if (ekspresi === 'panik') {
    // Mata kotak melotot besar, pupil titik kecil
    return (
      <group position={[x, MATA_Y, FZ]}>
        <Kotak size={[0.78, 0.82, 0.1]} color={PALET.putih} radius={0.1} outline={OUT_KECIL} />
        <mesh position={[0, 0, 0.08]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color={PALET.outline} />
        </mesh>
      </group>
    );
  }
  if (ekspresi === 'nyindir') {
    // Setengah tertutup, datar, malas
    return (
      <group position={[x, MATA_Y - 0.05, FZ]}>
        <Kotak size={[0.62, 0.26, 0.1]} color={PALET.putih} radius={0.05} outline={OUT_KECIL} />
        <Kotak size={[0.2, 0.15, 0.04]} pos={[0, -0.02, 0.07]} color={PALET.outline} radius={0.02} outline={0} />
        <Kotak size={[0.74, 0.1, 0.12]} pos={[0, 0.15, 0.03]} color={PALET.outline} radius={0.03} outline={0} />
      </group>
    );
  }
  const h = ekspresi === 'ngomong' ? 0.56 : 0.46;
  return (
    <group position={[x, MATA_Y, FZ]}>
      <Kotak size={[0.6, h, 0.1]} color={PALET.putih} radius={0.07} outline={OUT_KECIL} />
      <Kotak size={[0.22, 0.22, 0.04]} pos={[0, 0, 0.07]} color={PALET.outline} radius={0.02} outline={0} />
    </group>
  );
};

const Alis: React.FC<{x: number; y: number; rotZ: number}> = ({x, y, rotZ}) => (
  <Kotak size={[0.8, 0.17, 0.12]} pos={[x, y, FZ + 0.02]} rot={[0, 0, rotZ]} color={PALET.outline} radius={0.05} outline={0} />
);

const AlisWajah: React.FC<{ekspresi: Ekspresi}> = ({ekspresi}) => {
  switch (ekspresi) {
    case 'serius': // turun tegas ke tengah
      return (
        <>
          <Alis x={-MATA_X} y={3.98} rotZ={-0.32} />
          <Alis x={MATA_X} y={3.98} rotZ={0.32} />
        </>
      );
    case 'ngomong': // sedikit terangkat
      return (
        <>
          <Alis x={-MATA_X} y={4.08} rotZ={0.08} />
          <Alis x={MATA_X} y={4.08} rotZ={-0.08} />
        </>
      );
    case 'nyindir': // satu alis naik, satu datar
      return (
        <>
          <Alis x={-MATA_X} y={4.12} rotZ={0.14} />
          <Alis x={MATA_X} y={3.88} rotZ={0} />
        </>
      );
    case 'panik': // cemas, naik ke tengah
      return (
        <>
          <Alis x={-MATA_X} y={4.08} rotZ={0.3} />
          <Alis x={MATA_X} y={4.08} rotZ={-0.3} />
        </>
      );
  }
};

const Mulut: React.FC<{ekspresi: Ekspresi; buka: number}> = ({ekspresi, buka}) => {
  if (ekspresi === 'serius') {
    return <Kotak size={[0.7, 0.11, 0.1]} pos={[0, MULUT_ATAS - 0.1, FZ]} color={PALET.outline} radius={0.04} outline={0} />;
  }
  if (ekspresi === 'nyindir') {
    return (
      <group position={[0, MULUT_ATAS - 0.12, FZ]}>
        <Kotak size={[0.5, 0.11, 0.1]} pos={[-0.05, -0.04, 0]} rot={[0, 0, 0.14]} color={PALET.outline} radius={0.04} outline={0} />
        <Kotak size={[0.2, 0.11, 0.1]} pos={[0.26, 0.04, 0]} rot={[0, 0, 0.7]} color={PALET.outline} radius={0.04} outline={0} />
      </group>
    );
  }
  if (ekspresi === 'ngomong') {
    const w = 0.78;
    const h = 0.16 + buka * 0.46;
    return (
      <group position={[0, MULUT_ATAS - h / 2, FZ]}>
        <Kotak size={[w, h, 0.1]} color={PALET.mulutDalam} radius={0.07} outline={OUT_KECIL + 0.02} />
        {h > 0.45 && <Kotak size={[w - 0.22, 0.1, 0.04]} pos={[0, -h / 2 + 0.14, 0.07]} color={PALET.lidah} radius={0.03} outline={0} />}
      </group>
    );
  }
  // panik: teriak lebar + gigi atas putih
  const efektif = 0.55 + 0.45 * buka;
  const w = 1.1;
  const h = 0.4 + 0.34 * efektif;
  return (
    <group position={[0, MULUT_ATAS - h / 2, FZ]}>
      <Kotak size={[w, h, 0.1]} color={PALET.mulutDalam} radius={0.1} outline={OUT_KECIL + 0.02} />
      <Kotak size={[w - 0.16, 0.2, 0.04]} pos={[0, h / 2 - 0.15, 0.07]} color={PALET.putih} radius={0.03} outline={0} />
      {h > 0.55 && <Kotak size={[w - 0.5, 0.12, 0.04]} pos={[0, -h / 2 + 0.16, 0.07]} color={PALET.lidah} radius={0.03} outline={0} />}
    </group>
  );
};

const Tetes: React.FC<{pos: V3; s: number}> = ({pos, s}) => (
  <group position={pos} scale={[s, s * 1.4, s * 0.7]}>
    <mesh>
      <sphereGeometry args={[0.2, 20, 20]} />
      <meshBasicMaterial color={PALET.keringat} />
    </mesh>
    <mesh scale={1.25}>
      <sphereGeometry args={[0.2, 20, 20]} />
      <meshBasicMaterial color={PALET.outline} side={BackSide} />
    </mesh>
  </group>
);

// ---------- Rambut (blok-blok) ----------
type Blok = [number, number, number, number, number, number, number?]; // x,y,z,w,h,d,rotZ

const RAMBUT_UTAMA: Blok[] = [
  [0, 4.95, 0, 2.4, 0.9, 2.3], // atas
  [0, 4.0, -0.9, 2.4, 1.6, 0.6], // belakang
  [-1.15, 4.3, 0, 0.26, 0.95, 1.9], // sisi kiri
  [1.15, 4.3, 0, 0.26, 0.95, 1.9], // sisi kanan
  [-0.75, 4.5, 1.02, 0.78, 0.5, 0.3], // poni
  [0.05, 4.55, 1.06, 0.72, 0.6, 0.3],
  [0.8, 4.5, 1.02, 0.72, 0.5, 0.3],
];

const RAMBUT_TEMAN: Blok[] = [
  [0, 4.95, 0, 2.4, 0.9, 2.3],
  [0, 4.0, -0.9, 2.4, 1.6, 0.6],
  [-1.15, 4.3, 0, 0.26, 0.95, 1.9],
  [1.15, 4.3, 0, 0.26, 0.95, 1.9],
  // jambul acak
  [-0.9, 5.4, 0.2, 0.5, 0.55, 0.5, 0.25],
  [-0.3, 5.5, 0, 0.5, 0.7, 0.5, -0.1],
  [0.4, 5.45, 0.3, 0.5, 0.65, 0.5, 0.15],
  [1.0, 5.3, 0, 0.5, 0.5, 0.5, -0.3],
  [0, 5.3, -0.7, 0.6, 0.6, 0.6, 0],
  // poni berantakan
  [-0.9, 4.5, 1.02, 0.6, 0.5, 0.3, 0.2],
  [-0.1, 4.45, 1.06, 0.5, 0.65, 0.3, -0.15],
  [0.7, 4.5, 1.02, 0.7, 0.5, 0.3, 0.1],
  [1.0, 4.35, 0.85, 0.4, 0.6, 0.3, -0.2],
];

// ---------- Model karakter ----------
const Model: React.FC<{
  tema: Tema;
  rambut: Blok[];
  ekspresi: Ekspresi;
  buka: number;
  headset?: boolean;
  pegangHP?: boolean;
}> = ({tema, rambut, ekspresi, buka, headset, pegangHP}) => (
  <group>
    {/* Lengan + tangan */}
    <Kotak size={[0.62, 1.8, 0.74]} pos={[-1.78, 0.9, 0]} color={tema.hoodie} />
    <Kotak size={[0.62, 1.8, 0.74]} pos={[1.78, 0.9, 0]} color={tema.hoodie} />
    <Kotak size={[0.62, 0.5, 0.74]} pos={[-1.78, -0.1, 0]} color={tema.kulit} radius={0.2} />
    <Kotak size={[0.62, 0.5, 0.74]} pos={[1.78, -0.1, 0]} color={tema.kulit} radius={0.2} />

    {/* Badan: hoodie kotak */}
    <Kotak size={[2.9, 2.3, 1.7]} pos={[0, 0.9, 0]} color={tema.hoodie} />
    {/* Kantong */}
    <Kotak size={[1.7, 0.6, 0.12]} pos={[0, 0.25, 0.88]} color={tema.hoodieShade} radius={0.1} outline={OUT_KECIL} />
    {/* Tali hoodie putih */}
    <Kotak size={[0.16, 0.85, 0.1]} pos={[-0.35, 1.5, 0.9]} color={PALET.putih} radius={0.05} outline={OUT_KECIL} />
    <Kotak size={[0.16, 0.85, 0.1]} pos={[0.35, 1.5, 0.9]} color={PALET.putih} radius={0.05} outline={OUT_KECIL} />

    {/* Kepala kotak */}
    <Kotak size={[2.3, 2.7, 2.0]} pos={[0, 3.45, 0]} color={tema.kulit} />

    {/* Rambut */}
    {rambut.map(([x, y, z, w, h, d, rz], i) => (
      <Kotak key={i} size={[w, h, d]} pos={[x, y, z]} rot={[0, 0, rz ?? 0]} color={tema.rambut} radius={0.14} />
    ))}

    {/* Wajah */}
    <Mata x={-MATA_X} ekspresi={ekspresi} />
    <Mata x={MATA_X} ekspresi={ekspresi} />
    <AlisWajah ekspresi={ekspresi} />
    <Mulut ekspresi={ekspresi} buka={buka} />
    {ekspresi === 'panik' && (
      <>
        <Tetes pos={[1.28, 3.7, 0.7]} s={1} />
        <Tetes pos={[-1.4, 3.3, 0.95]} s={0.7} />
      </>
    )}

    {/* Headset gaming menggantung di leher */}
    {headset && (
      <group>
        <group position={[0, 2.0, 0.93]} rotation={[0, 0, Math.PI]}>
          <mesh position={[0, 0, -0.02]}>
            <torusGeometry args={[1.5, 0.2, 12, 40, Math.PI]} />
            <meshBasicMaterial color={PALET.outline} />
          </mesh>
          <mesh>
            <torusGeometry args={[1.5, 0.11, 12, 40, Math.PI]} />
            <meshLambertMaterial color={PALET.utama.headset} />
          </mesh>
        </group>
        <Kotak size={[0.5, 0.85, 0.7]} pos={[-1.5, 1.95, 0.9]} color={PALET.utama.headset} radius={0.15} />
        <Kotak size={[0.5, 0.85, 0.7]} pos={[1.5, 1.95, 0.9]} color={PALET.utama.headsetShade} radius={0.15} />
      </group>
    )}

    {/* Smartphone merah menyala menghadap kamera */}
    {pegangHP && (
      <group position={[1.3, 0.95, 1.25]} rotation={[0, 0.35, 0.05]}>
        <pointLight color={PALET.hp} intensity={6} distance={4} position={[0, 0.2, 0.8]} />
        <Kotak size={[1.0, 1.65, 0.16]} color={PALET.hp} radius={0.14} emissive="#7F1D1D" />
        <Kotak size={[0.78, 1.3, 0.04]} pos={[0, 0.02, 0.1]} color={PALET.hpLayar} radius={0.08} outline={0} emissive="#FCA5A5" />
        <Kotak size={[0.28, 0.06, 0.04]} pos={[0, 0.74, 0.1]} color={PALET.outline} radius={0.02} outline={0} />
        {/* tangan menggenggam */}
        <Kotak size={[0.95, 0.6, 0.5]} pos={[0.02, -0.7, 0.05]} color={tema.kulit} radius={0.2} />
        <Kotak size={[0.28, 0.6, 0.3]} pos={[-0.55, -0.25, 0.1]} color={tema.kulit} radius={0.12} />
      </group>
    )}
  </group>
);

// ---------- Kanvas 3D ----------
const Kanvas: React.FC<{
  tema: Tema;
  rambut: Blok[];
  ekspresi: Ekspresi;
  mulutTerbuka: number;
  scale: number;
  headset?: boolean;
  pegangHP?: boolean;
}> = ({tema, rambut, ekspresi, mulutTerbuka, scale, headset, pegangHP}) => (
  <ThreeCanvas
    width={400 * scale}
    height={520 * scale}
    flat
    camera={{position: [0, 0, 13.5], fov: 30, near: 0.1, far: 100}}
  >
    {/* intensitas x PI karena three.js modern memakai pencahayaan fisik (warna depan ≈ palet asli) */}
    <ambientLight intensity={0.52 * Math.PI} />
    <directionalLight position={[4, 5, 7]} intensity={0.68 * Math.PI} />
    <directionalLight position={[-6, 2, 4]} intensity={0.14 * Math.PI} />
    {/* sudut 3/4 tetap agar volume 3D terlihat, konsisten di semua scene */}
    <group position={[0, -2.6, 0]} rotation={[0.05, -0.35, 0]}>
      <Model tema={tema} rambut={rambut} ekspresi={ekspresi} buka={clamp01(mulutTerbuka)} headset={headset} pegangHP={pegangHP} />
    </group>
  </ThreeCanvas>
);

// ---------- Komponen publik ----------
export const KarakterUtama: React.FC<KarakterUtamaProps> = ({
  ekspresi = 'serius',
  mulutTerbuka = 0,
  pegangHP = false,
  scale = 1,
}) => (
  <Kanvas
    tema={PALET.utama}
    rambut={RAMBUT_UTAMA}
    ekspresi={ekspresi}
    mulutTerbuka={mulutTerbuka}
    scale={scale}
    headset
    pegangHP={pegangHP}
  />
);

export const KarakterTeman: React.FC<KarakterProps> = ({ekspresi = 'serius', mulutTerbuka = 0, scale = 1}) => (
  <Kanvas tema={PALET.teman} rambut={RAMBUT_TEMAN} ekspresi={ekspresi} mulutTerbuka={mulutTerbuka} scale={scale} />
);
