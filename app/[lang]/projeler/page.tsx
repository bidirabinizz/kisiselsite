import { notFound } from 'next/navigation';
import { sozlukGetir, dilKontrolEt } from '../dictionaries';
import ProjelerIzgarasi from '../../bilesenler/ProjelerIzgarasi';
import { projeleriGetir } from '../../actions/projectActions';

interface ProjectsPageProps {
  params: Promise<{ lang: string }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { lang } = await params;
  const dogrulanmisDil = lang === 'tr' ? 'tr' : 'en';

  if (!dilKontrolEt(dogrulanmisDil)) notFound();

  const sozluk = await sozlukGetir(dogrulanmisDil);

  // Veritabanından projeleri çekiyoruz
  const dbProjeler = await projeleriGetir(false);
  const projelerKaynagi = dbProjeler.map((p) => ({
    id: p.id!,
    title: dogrulanmisDil === 'tr' ? p.title_tr : p.title_en,
    description: dogrulanmisDil === 'tr' ? p.description_tr : p.description_en,
    category: p.category,
    tags: p.tags,
    github_url: p.github_url,
    live_url: p.live_url,
    status: p.status,
    image_url: p.image_url,
  }));

  return (
    <div className="flex flex-col gap-10 py-6">
      {/* Sayfa Başlığı */}
      <div className="text-center flex flex-col gap-2">
        <span className="text-xs font-semibold text-accent tracking-wider uppercase font-mono">
          {sozluk.projects.subtitle}
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
          {sozluk.projects.title}
        </h1>
      </div>

      {/* Projeler Izgarası */}
      <ProjelerIzgarasi projeler={projelerKaynagi} sozluk={sozluk} />
    </div>
  );
}
