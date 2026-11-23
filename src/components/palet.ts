export type Ekspresi = 'serius' | 'ngomong' | 'nyindir' | 'panik';

/** Palet warna terkunci. Satu sumber untuk versi 3D dan legacy 2D. Jangan diubah per-scene. */
export const PALET = {
  outline: '#0F172A',
  putih: '#FFFFFF',
  utama: {
    kulit: '#FED7AA',
    kulitShade: '#FDBA74',
    rambut: '#451A03',
    rambutShade: '#2A0F02',
    hoodie: '#1E3A8A',
    hoodieShade: '#172554',
    headset: '#2563EB',
    headsetShade: '#1D4ED8',
  },
  teman: {
    kulit: '#FDE68A',
    kulitShade: '#FDBA74',
    rambut: '#0F172A',
    rambutShade: '#1E293B',
    hoodie: '#334155',
    hoodieShade: '#1E293B',
  },
  hp: '#EF4444',
  hpLayar: '#FECACA',
  keringat: '#38BDF8',
  mulutDalam: '#7F1D1D',
  lidah: '#F87171',
} as const;
