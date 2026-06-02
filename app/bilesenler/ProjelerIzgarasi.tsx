'use client';

import { useState } from 'react';
import ProjeKarti from './ProjeKarti';

interface Proje {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  github_url?: string;
  live_url?: string;
  status: 'completed' | 'in_progress' | 'code_only';
  image_url?: string;
}

interface ProjelerIzgarasiProps {
  projeler: Proje[];
  sozluk: any;
}

export default function ProjelerIzgarasi({ projeler, sozluk }: ProjelerIzgarasiProps) {
  const [aktifFiltre, setAktifFiltre] = useState<'all' | 'web' | 'iot'>('all');

  const filtrelenmisProjeler = projeler.filter((proje) => {
    if (aktifFiltre === 'all') return true;
    return proje.category === aktifFiltre;
  });

  const kategoriler = [
    { id: 'all', etiket: sozluk.projects.filter_all },
    { id: 'web', etiket: sozluk.projects.filter_web },
    { id: 'iot', etiket: sozluk.projects.filter_iot },
  ] as const;

  return (
    <div className="flex flex-col gap-8">
      {/* Filtreleme Butonları - Flat Çizgisel Menü */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {kategoriler.map((kat) => (
          <button
            key={kat.id}
            onClick={() => setAktifFiltre(kat.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer border ${
              aktifFiltre === kat.id
                ? 'bg-accent border-accent text-white shadow-sm scale-102'
                : 'border-card-border bg-card-bg text-foreground/80 hover:border-accent hover:text-accent'
            }`}
          >
            {kat.etiket}
          </button>
        ))}
      </div>

      {/* Proje Sayısı Bilgisi */}
      <p className="text-[10px] text-muted font-bold text-center uppercase tracking-widest border-b border-card-border pb-4 max-w-xs mx-auto w-full">
        {filtrelenmisProjeler.length} {sozluk.nav.projects.toLowerCase()}
      </p>

      {/* Projeler Izgarası */}
      {filtrelenmisProjeler.length === 0 ? (
        <p className="text-sm text-muted text-center py-12 border border-dashed border-card-border rounded-2xl max-w-lg mx-auto w-full">
          {aktifFiltre === 'all' 
            ? (sozluk.nav.home === 'Ana Sayfa' ? 'Henüz proje eklenmedi.' : 'No projects added yet.')
            : (sozluk.nav.home === 'Ana Sayfa' ? 'Bu kategoride proje bulunmamaktadır.' : 'No projects found in this category.')}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrelenmisProjeler.map((proje) => (
            <div key={proje.id} className="animate-fade-in duration-200">
              <ProjeKarti proje={proje} sozluk={sozluk} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
