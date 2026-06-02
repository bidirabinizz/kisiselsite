'use client';

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

interface ProjeKartiProps {
  proje: Proje;
  sozluk: any;
}

export default function ProjeKarti({ proje, sozluk }: ProjeKartiProps) {
  // Proje kategorisine göre uygun etiketi alıyoruz
  const kategoriEtiketi = proje.category === 'iot' ? sozluk.projects.filter_iot : sozluk.projects.filter_web;
  
  return (
    <div className="flat-kart flat-hover flex flex-col h-full overflow-hidden relative group">
      {/* Üst Kısım - Görsel / Banner */}
      {proje.image_url ? (
        <div className="relative w-full h-40 overflow-hidden border-b border-card-border/50">
          <img
            src={proje.image_url}
            alt={proje.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        /* Görsel Yoksa Modern Neon Desenli Gradyan */
        <div className="relative w-full h-36 bg-gradient-to-br from-accent/15 via-accent-secondary/5 to-accent/5 flex items-center justify-center border-b border-card-border/50 overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="absolute -right-8 -bottom-8 w-20 h-20 rounded-full bg-accent/15 blur-xl group-hover:opacity-80 transition-opacity" />
          <div className="absolute -left-8 -top-8 w-20 h-20 rounded-full bg-accent-secondary/15 blur-xl group-hover:opacity-80 transition-opacity" />
          <span className="text-3xl opacity-75 group-hover:scale-110 transition-transform duration-500" role="img" aria-label="proje-tipi">
            {proje.category === 'iot' ? '🔌' : '💻'}
          </span>
        </div>
      )}

      {/* Bilgi Başlığı & Durum Rozeti */}
      <div className="p-5 pb-3 flex items-center justify-between border-b border-card-border/30 bg-black/[0.01] dark:bg-white/[0.01]">
        <span className="text-[10px] font-semibold text-accent tracking-wider uppercase font-mono">
          {kategoriEtiketi}
        </span>
        
        {/* Durum Rozeti */}
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono border ${
          proje.status === 'completed'
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10'
            : proje.status === 'in_progress'
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10'
            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/10'
        }`}>
          {proje.status === 'completed'
            ? (sozluk.nav.home === 'Ana Sayfa' ? 'Tamamlandı' : 'Completed')
            : proje.status === 'in_progress'
            ? (sozluk.nav.home === 'Ana Sayfa' ? 'Geliştiriliyor' : 'In Progress')
            : (sozluk.nav.home === 'Ana Sayfa' ? 'Sadece Kod' : 'Code Only')}
        </span>
      </div>

      {/* İçerik Gövdesi */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-2 tracking-tight text-foreground group-hover:text-accent transition-colors duration-300">
          {proje.title}
        </h3>
        
        <p className="text-sm text-muted mb-4 line-clamp-3 leading-relaxed flex-grow">
          {proje.description}
        </p>

        {/* Teknolojik Etiketler */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {proje.tags.map((etiket) => (
            <span
              key={etiket}
              className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-accent/5 text-accent dark:bg-accent/10 dark:text-accent/80 border border-accent/10"
            >
              {etiket}
            </span>
          ))}
        </div>

        {/* Aksiyon Bağlantıları - Flat Çizgisel Butonlar */}
        <div className="flex items-center justify-between pt-4 border-t border-card-border mt-auto text-xs">
          <a
            href={proje.github_url || "https://github.com/bidirabinizz"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-muted hover:text-accent flex items-center gap-1.5 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 24 24"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span>{sozluk.projects.view_code}</span>
          </a>
          
          {proje.live_url ? (
            <a
              href={proje.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:opacity-85 flex items-center gap-1 transition-opacity"
            >
              <span>{sozluk.projects.view_live}</span>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
