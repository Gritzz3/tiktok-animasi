import React, {useId} from 'react';
import {PALET, type Ekspresi} from './palet';

export {PALET};
export type {Ekspresi};

/**
 * ============================================================
 *  LEGACY 2.5D (SVG) — JANGAN DIPAKAI UNTUK SCENE BARU. Pakai KarakterBlocky.tsx (3D)
 * ============================================================
 *  Semua scene/episode WAJIB memakai <KarakterUtama /> dan
 *  <KarakterTeman />. Ubah ekspresi/mulut hanya lewat props.
 *  Lihat CLAUDE.md untuk aturan lengkap.
 */


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


const SW = 8; // ketebalan outline utama
const RX = 22; // sudut membulat blocky
const VB_W = 400;
const VB_H = 520;

const clamp01 = (n: number) => Math.min(1, Math.max(0, Number.isFinite(n) ? n : 0));

type Tema = {
  kulit: string;
  kulitShade: string;
  rambut: string;
  rambutShade: string;
  hoodie: string;
  hoodieShade: string;
};

// ---------- Posisi wajah (terkunci) ----------
const KIRI_X = 150;
const KANAN_X = 250;
const MATA_Y = 208;
const TENGAH_X = 200;

// ---------- Mata & alis ----------
const Alis: React.FC<{x1: number; y1: number; x2: number; y2: number}> = ({x1, y1, x2, y2}) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={PALET.outline} strokeWidth={12} strokeLinecap="square" />
);

const Mata: React.FC<{cx: number; ekspresi: Ekspresi}> = ({cx, ekspresi}) => {
  const cy = MATA_Y;
  if (ekspresi === 'panik') {
    // Mata kotak melotot besar, pupil titik kecil
    return (
      <g>
        <rect x={cx - 27} y={cy - 28} width={54} height={56} rx={10} fill={PALET.putih} stroke={PALET.outline} strokeWidth={SW} />
        <circle cx={cx} cy={cy} r={5.5} fill={PALET.outline} />
      </g>
    );
  }
  if (ekspresi === 'nyindir') {
    // Setengah tertutup, datar, malas
    return (
      <g>
        <rect x={cx - 19} y={cy - 4} width={38} height={18} rx={4} fill={PALET.putih} stroke={PALET.outline} strokeWidth={6} />
        <rect x={cx - 6} y={cy + 1} width={12} height={10} fill={PALET.outline} />
        <line x1={cx - 24} y1={cy - 5} x2={cx + 24} y2={cy - 5} stroke={PALET.outline} strokeWidth={10} strokeLinecap="square" />
      </g>
    );
  }
  const h = ekspresi === 'ngomong' ? 34 : 28;
  return (
    <g>
      <rect x={cx - 19} y={cy - h / 2} width={38} height={h} rx={6} fill={PALET.putih} stroke={PALET.outline} strokeWidth={6} />
      <rect x={cx - 7} y={cy - 7} width={14} height={14} fill={PALET.outline} />
    </g>
  );
};

const AlisWajah: React.FC<{ekspresi: Ekspresi}> = ({ekspresi}) => {
  switch (ekspresi) {
    case 'serius': // turun tegas ke tengah
      return (
        <g>
          <Alis x1={122} y1={166} x2={174} y2={182} />
          <Alis x1={278} y1={166} x2={226} y2={182} />
        </g>
      );
    case 'ngomong': // sedikit terangkat, ekspresif
      return (
        <g>
          <Alis x1={124} y1={172} x2={174} y2={166} />
          <Alis x1={276} y1={172} x2={226} y2={166} />
        </g>
      );
    case 'nyindir': // satu alis naik, satu datar
      return (
        <g>
          <Alis x1={124} y1={168} x2={174} y2={160} />
          <Alis x1={226} y1={178} x2={276} y2={178} />
        </g>
      );
    case 'panik': // alis cemas naik ke tengah
      return (
        <g>
          <Alis x1={122} y1={176} x2={174} y2={164} />
          <Alis x1={278} y1={176} x2={226} y2={164} />
        </g>
      );
  }
};

// ---------- Mulut ----------
const Mulut: React.FC<{ekspresi: Ekspresi; buka: number}> = ({ekspresi, buka}) => {
  if (ekspresi === 'serius') {
    return <line x1={172} y1={266} x2={228} y2={266} stroke={PALET.outline} strokeWidth={SW} strokeLinecap="round" />;
  }
  if (ekspresi === 'nyindir') {
    return (
      <path
        d="M176 268 L214 263 L225 254"
        fill="none"
        stroke={PALET.outline}
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    );
  }
  if (ekspresi === 'ngomong') {
    const w = 60;
    const h = 10 + buka * 38;
    const y = 250;
    return (
      <g>
        <rect x={TENGAH_X - w / 2} y={y} width={w} height={h} rx={8} fill={PALET.mulutDalam} stroke={PALET.outline} strokeWidth={SW} />
        {h > 34 && <rect x={TENGAH_X - w / 2 + 8} y={y + h - 15} width={w - 16} height={8} rx={4} fill={PALET.lidah} />}
      </g>
    );
  }
  // panik: teriak lebar + gigi atas putih
  const efektif = 0.55 + 0.45 * buka;
  const w = 84;
  const h = 26 + 22 * efektif;
  const y = 246;
  const x = TENGAH_X - w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill={PALET.mulutDalam} stroke={PALET.outline} strokeWidth={SW} />
      <rect x={x + 6} y={y + 5} width={w - 12} height={13} rx={3} fill={PALET.putih} />
      <line x1={TENGAH_X} y1={y + 5} x2={TENGAH_X} y2={y + 18} stroke={PALET.outline} strokeWidth={3} />
      {h > 40 && <rect x={x + 18} y={y + h - 14} width={w - 36} height={8} rx={4} fill={PALET.lidah} />}
    </g>
  );
};

// ---------- Keringat ----------
const Keringat: React.FC = () => (
  <g>
    <path
      d="M322 176 C306 200 306 220 322 222 C338 220 338 200 322 176 Z"
      fill={PALET.keringat}
      stroke={PALET.outline}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <path
      d="M72 214 C62 230 62 244 72 246 C82 244 82 230 72 214 Z"
      fill={PALET.keringat}
      stroke={PALET.outline}
      strokeWidth={5}
      strokeLinejoin="round"
    />
  </g>
);

// ---------- Rambut ----------
const RAMBUT_UTAMA =
  'M82 146 V74 Q82 50 106 50 H294 Q318 50 318 74 V146 H286 V124 H244 V150 H198 V126 H152 V148 H116 V130 H82 Z';
const RAMBUT_TEMAN =
  'M82 150 V78 L96 54 L122 68 L146 42 L172 64 L204 38 L232 64 L262 44 L284 68 L306 52 L318 82 V146 L292 128 L268 152 L236 126 L206 148 L172 126 L142 150 L112 128 Z';

// ---------- Basis karakter ----------
const KarakterBasis: React.FC<{
  tema: Tema;
  rambutPath: string;
  ekspresi: Ekspresi;
  mulutTerbuka: number;
  scale: number;
  headset?: boolean;
  pegangHP?: boolean;
}> = ({tema, rambutPath, ekspresi, mulutTerbuka, scale, headset, pegangHP}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const idHead = `head-${uid}`;
  const idBody = `body-${uid}`;
  const idHair = `hair-${uid}`;
  const idGlow = `glow-${uid}`;
  const buka = clamp01(mulutTerbuka);

  return (
    <svg
      width={VB_W * scale}
      height={VB_H * scale}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{overflow: 'visible', display: 'block'}}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={idHead}>
          <rect x={90} y={70} width={220} height={240} rx={RX} />
        </clipPath>
        <clipPath id={idBody}>
          <rect x={60} y={292} width={280} height={208} rx={RX} />
        </clipPath>
        <clipPath id={idHair}>
          <path d={rambutPath} />
        </clipPath>
        <filter id={idGlow} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* Lengan (di belakang badan) */}
      <rect x={24} y={322} width={54} height={152} rx={RX} fill={tema.hoodie} stroke={PALET.outline} strokeWidth={SW} />
      <rect x={322} y={322} width={54} height={152} rx={RX} fill={tema.hoodieShade} stroke={PALET.outline} strokeWidth={SW} />
      <rect x={26} y={452} width={50} height={46} rx={16} fill={tema.kulit} stroke={PALET.outline} strokeWidth={SW} />
      <rect x={324} y={452} width={50} height={46} rx={16} fill={tema.kulitShade} stroke={PALET.outline} strokeWidth={SW} />

      {/* Badan: hoodie kotak + shading sisi 2.5D */}
      <rect x={60} y={292} width={280} height={208} rx={RX} fill={tema.hoodie} />
      <g clipPath={`url(#${idBody})`}>
        <rect x={290} y={292} width={60} height={208} fill={tema.hoodieShade} />
        <rect x={60} y={470} width={280} height={40} fill={tema.hoodieShade} />
      </g>
      <rect x={60} y={292} width={280} height={208} rx={RX} fill="none" stroke={PALET.outline} strokeWidth={SW} />

      {/* Kantong hoodie */}
      <rect x={118} y={424} width={164} height={56} rx={14} fill={tema.hoodieShade} stroke={PALET.outline} strokeWidth={6} />

      {/* Tali hoodie putih */}
      <rect x={165} y={304} width={14} height={50} rx={6} fill={PALET.putih} stroke={PALET.outline} strokeWidth={5} />
      <rect x={221} y={304} width={14} height={50} rx={6} fill={PALET.putih} stroke={PALET.outline} strokeWidth={5} />

      {/* Kepala kotak + shading sisi 2.5D */}
      <rect x={90} y={70} width={220} height={240} rx={RX} fill={tema.kulit} />
      <g clipPath={`url(#${idHead})`}>
        <rect x={270} y={70} width={50} height={240} fill={tema.kulitShade} />
        <rect x={90} y={284} width={220} height={30} fill={tema.kulitShade} />
      </g>
      <rect x={90} y={70} width={220} height={240} rx={RX} fill="none" stroke={PALET.outline} strokeWidth={SW} />

      {/* Rambut + shading sisi */}
      <path d={rambutPath} fill={tema.rambut} />
      <g clipPath={`url(#${idHair})`}>
        <rect x={272} y={30} width={60} height={140} fill={tema.rambutShade} />
      </g>
      <path d={rambutPath} fill="none" stroke={PALET.outline} strokeWidth={SW} strokeLinejoin="round" />

      {/* Wajah */}
      <Mata cx={KIRI_X} ekspresi={ekspresi} />
      <Mata cx={KANAN_X} ekspresi={ekspresi} />
      <AlisWajah ekspresi={ekspresi} />
      <Mulut ekspresi={ekspresi} buka={buka} />
      {ekspresi === 'panik' && <Keringat />}

      {/* Headset gaming menggantung di leher */}
      {headset && (
        <g>
          <path
            d="M96 340 V362 Q96 400 134 400 H266 Q304 400 304 362 V340"
            fill="none"
            stroke={PALET.outline}
            strokeWidth={26}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M96 340 V362 Q96 400 134 400 H266 Q304 400 304 362 V340"
            fill="none"
            stroke={PALET.utama.headset}
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x={72} y={296} width={42} height={60} rx={14} fill={PALET.utama.headset} stroke={PALET.outline} strokeWidth={SW} />
          <rect x={286} y={296} width={42} height={60} rx={14} fill={PALET.utama.headsetShade} stroke={PALET.outline} strokeWidth={SW} />
          <rect x={80} y={308} width={14} height={34} rx={5} fill={PALET.utama.headsetShade} />
          {/* mic kecil */}
          <rect x={56} y={340} width={20} height={44} rx={8} fill={PALET.outline} />
          <rect x={52} y={376} width={20} height={14} rx={6} fill={PALET.utama.headset} stroke={PALET.outline} strokeWidth={5} />
        </g>
      )}

      {/* Smartphone merah menyala menghadap kamera */}
      {pegangHP && (
        <g>
          <rect x={288} y={332} width={92} height={146} rx={16} fill={PALET.hp} filter={`url(#${idGlow})`} opacity={0.75} />
          <rect x={288} y={332} width={92} height={146} rx={16} fill={PALET.hp} stroke={PALET.outline} strokeWidth={SW} />
          <rect x={300} y={346} width={68} height={104} rx={8} fill={PALET.hpLayar} />
          <rect x={300} y={346} width={68} height={30} rx={8} fill={PALET.putih} opacity={0.55} />
          <rect x={324} y={337} width={20} height={5} rx={2.5} fill={PALET.outline} />
          {/* tangan menggenggam */}
          <rect x={294} y={434} width={80} height={48} rx={18} fill={tema.kulit} stroke={PALET.outline} strokeWidth={SW} />
          <rect x={282} y={392} width={24} height={46} rx={11} fill={tema.kulit} stroke={PALET.outline} strokeWidth={SW} />
        </g>
      )}
    </svg>
  );
};

// ---------- Komponen publik ----------
export const KarakterUtama: React.FC<KarakterUtamaProps> = ({
  ekspresi = 'serius',
  mulutTerbuka = 0,
  pegangHP = false,
  scale = 1,
}) => (
  <KarakterBasis
    tema={PALET.utama}
    rambutPath={RAMBUT_UTAMA}
    ekspresi={ekspresi}
    mulutTerbuka={mulutTerbuka}
    scale={scale}
    headset
    pegangHP={pegangHP}
  />
);

export const KarakterTeman: React.FC<KarakterProps> = ({ekspresi = 'serius', mulutTerbuka = 0, scale = 1}) => (
  <KarakterBasis
    tema={PALET.teman}
    rambutPath={RAMBUT_TEMAN}
    ekspresi={ekspresi}
    mulutTerbuka={mulutTerbuka}
    scale={scale}
  />
);
