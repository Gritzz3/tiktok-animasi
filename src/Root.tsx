import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import {KarakterTeman, KarakterUtama} from './components/KarakterBlocky';

const FONT = 'Arial, Helvetica, sans-serif';

const Sel: React.FC<{
  nama: string;
  varian: string;
  children: React.ReactNode;
}> = ({nama, varian, children}) => (
  <div
    style={{
      width: 480,
      height: 780,
      background: '#1E293B',
      border: '4px solid #334155',
      borderRadius: 32,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '40px 0 36px',
      boxSizing: 'border-box',
    }}
  >
    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
    <div style={{textAlign: 'center', fontFamily: FONT}}>
      <div style={{color: '#FFFFFF', fontSize: 40, fontWeight: 800, letterSpacing: 1}}>{nama}</div>
      <div style={{color: '#94A3B8', fontSize: 28, marginTop: 8}}>{varian}</div>
    </div>
  </div>
);

export const CharacterSheet: React.FC = () => {
  const s = 1.0;
  return (
    <AbsoluteFill style={{background: '#0F172A', alignItems: 'center'}}>
      <div
        style={{
          marginTop: 70,
          color: '#FFFFFF',
          fontFamily: FONT,
          fontSize: 64,
          fontWeight: 900,
          letterSpacing: 4,
        }}
      >
        CHARACTER SHEET
      </div>
      <div style={{color: '#64748B', fontFamily: FONT, fontSize: 28, marginTop: 8, marginBottom: 40}}>
        Karakter blocky 3D · aset terkunci
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '480px 480px',
          gridTemplateRows: '780px 780px',
          gap: 40,
        }}
      >
        <Sel nama="KarakterUtama" varian="serius · pegangHP">
          <KarakterUtama ekspresi="serius" pegangHP={true} scale={s} />
        </Sel>
        <Sel nama="KarakterUtama" varian="ngomong · mulutTerbuka 0.8">
          <KarakterUtama ekspresi="ngomong" mulutTerbuka={0.8} scale={s} />
        </Sel>
        <Sel nama="KarakterTeman" varian="nyindir">
          <KarakterTeman ekspresi="nyindir" scale={s} />
        </Sel>
        <Sel nama="KarakterUtama" varian="panik · mulutTerbuka 1">
          <KarakterUtama ekspresi="panik" mulutTerbuka={1} scale={s} />
        </Sel>
      </div>
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CharacterSheet"
      component={CharacterSheet}
      durationInFrames={30}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
