import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { sozlukGetir, dilKontrolEt } from '../../dictionaries';
import { projeGetir, projeleriGetir } from '../../../actions/projectActions';

interface ProjectDetailPageProps {
  params: Promise<{ lang: string; id: string }>;
}

// SEO ve Arama Motorları İçin Dinamik Metadata Üretimi
export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { lang, id } = await params;
  const dogrulanmisDil = lang === 'tr' ? 'tr' : 'en';

  const proje = await projeGetir(id);
  if (!proje || !proje.visible) {
    return {
      title: 'Proje Bulunamadı | Project Not Found',
    };
  }

  const baslik = dogrulanmisDil === 'tr' ? proje.title_tr : proje.title_en;
  const aciklama = dogrulanmisDil === 'tr' ? proje.description_tr : proje.description_en;

  return {
    title: `${baslik} | Bahadır Büyüktopaç`,
    description: aciklama.slice(0, 160),
    keywords: [baslik, proje.category, ...proje.tags, 'Bahadır Büyüktopaç', 'yazılımcı'],
  };
}

// Next.js static generation optimization
export async function generateStaticParams() {
  const projeler = await projeleriGetir(false);
  const paramsList: { lang: string; id: string }[] = [];

  for (const proje of projeler) {
    if (proje.id) {
      paramsList.push({ lang: 'tr', id: proje.id });
      paramsList.push({ lang: 'en', id: proje.id });
    }
  }

  return paramsList;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { lang, id } = await params;
  const dogrulanmisDil = lang === 'tr' ? 'tr' : 'en';

  if (!dilKontrolEt(dogrulanmisDil)) notFound();

  const sozluk = await sozlukGetir(dogrulanmisDil);
  const proje = await projeGetir(id);

  // Proje bulunamazsa veya görünür değilse 404 sayfasına yönlendir
  if (!proje || !proje.visible) {
    notFound();
  }

  const title = dogrulanmisDil === 'tr' ? proje.title_tr : proje.title_en;
  const description = dogrulanmisDil === 'tr' ? proje.description_tr : proje.description_en;
  const kategoriEtiketi = proje.category === 'iot' ? sozluk.projects.filter_iot : sozluk.projects.filter_web;

  // Açıklama alanındaki satır atlamalarını korumak için paragraflara bölüyoruz
  const paragraflar = description.split('\n').filter((p) => p.trim() !== '');

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-6">
      {/* Geri Dön Butonu */}
      <div>
        <Link
          href={`/${dogrulanmisDil}/projeler`}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-accent transition-colors font-mono uppercase tracking-wider group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          {dogrulanmisDil === 'tr' ? 'Çalışmalara Geri Dön' : 'Back to Works'}
        </Link>
      </div>

      {/* Proje Başlık & Durum Bölümü */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-card-border pb-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-accent tracking-wider uppercase font-mono">
            {kategoriEtiketi}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
            {title}
          </h1>
        </div>

        {/* Durum Rozeti */}
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
            proje.status === 'completed'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10'
              : proje.status === 'in_progress'
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10'
              : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/10'
          }`}>
            {proje.status === 'completed'
              ? (dogrulanmisDil === 'tr' ? 'Tamamlandı' : 'Completed')
              : proje.status === 'in_progress'
              ? (dogrulanmisDil === 'tr' ? 'Geliştiriliyor' : 'In Progress')
              : (dogrulanmisDil === 'tr' ? 'Sadece Kod' : 'Code Only')}
          </span>
        </div>
      </div>

      {/* Proje Banner Görseli */}
      <div className="flat-kart overflow-hidden border border-card-border/80 shadow-2xl relative select-none">
        {proje.image_url ? (
          <div className="relative w-full h-[300px] md:h-[450px]">
            <img
              src={proje.image_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          /* Görsel Yoksa Modern Neon Desenli Büyük Banner */
          <div className="relative w-full h-[250px] md:h-[350px] bg-gradient-to-br from-accent/15 via-accent-secondary/5 to-accent/5 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-20" />
            <div className="absolute -right-16 -bottom-16 w-40 h-40 rounded-full bg-accent/25 blur-3xl" />
            <div className="absolute -left-16 -top-16 w-40 h-40 rounded-full bg-accent-secondary/25 blur-3xl" />
            <span className="text-6xl opacity-75" role="img" aria-label="proje-tipi">
              {proje.category === 'iot' ? '🔌' : '💻'}
            </span>
          </div>
        )}
      </div>

      {/* Teknolojik Etiketler */}
      <div className="flex flex-wrap gap-2">
        {proje.tags.map((etiket) => (
          <span
            key={etiket}
            className="text-xs font-mono px-3 py-1 rounded-md bg-accent/5 text-accent dark:bg-accent/10 dark:text-accent/80 border border-accent/10"
          >
            {etiket}
          </span>
        ))}
      </div>

      {/* Proje İçeriği ve Açıklama */}
      <div className="flex flex-col gap-6 text-base md:text-lg text-muted leading-relaxed max-w-none">
        {paragraflar.map((paragraf, index) => (
          <p key={index} className="whitespace-pre-line">
            {paragraf}
          </p>
        ))}
      </div>

      {/* Aksiyon Bağlantıları (Butonlar) */}
      <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-card-border mt-4">
        {proje.github_url && (
          <a
            href={proje.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl border border-card-border bg-card-bg text-foreground text-sm font-semibold hover:border-accent/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            {sozluk.projects.view_code}
          </a>
        )}

        {proje.live_url && (
          <a
            href={proje.live_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-secondary hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 flex items-center gap-2 active:scale-[0.98]"
          >
            {sozluk.projects.view_live}
            <svg
              className="w-4 h-4"
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
        )}
      </div>
    </div>
  );
}
