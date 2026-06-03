import { notFound } from 'next/navigation';
import { sozlukGetir, dilKontrolEt } from './dictionaries';
import ProjeKarti from '../bilesenler/ProjeKarti';
import IletisimFormu from '../bilesenler/IletisimFormu';
import SequenceHero from '../bilesenler/SequenceHero';
import Image from 'next/image';
import Link from 'next/link';
import { projeleriGetir } from '../actions/projectActions';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const dogrulanmisDil = lang === 'tr' ? 'tr' : 'en';

  if (!dilKontrolEt(dogrulanmisDil)) notFound();

  const sozluk = await sozlukGetir(dogrulanmisDil);

  // Yetenekler
  const onYuzTeknolojileri = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5/CSS3', 'Redux'];
  const arkaYuzTeknolojileri = ['Node.js', 'Express', 'NestJS', 'Go', 'Fastify', 'GraphQL'];
  const iotTeknolojileri = ['ESP32 / ESP8266', 'C/C++', 'MQTT', 'FreeRTOS', 'Raspberry Pi', 'Arduino'];
  const araclarVeVeritabanlari = ['PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Git', 'Vercel / AWS'];

  // Veritabanından projeleri çekiyoruz
  const dbProjeler = await projeleriGetir(false);
  const secilmisProjeler = dbProjeler.slice(0, 2).map((p) => ({
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

  const jsonLd = dogrulanmisDil === 'tr' ? {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Bahadır Büyüktopaç',
    jobTitle: 'Full-Stack Geliştirici & IoT Mühendisi',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Uzunköprü',
      addressRegion: 'Edirne',
      addressCountry: 'TR'
    },
    description: 'Uzunköprü ve Edirne bölgesinde profesyonel web tasarım, yazılım geliştirme, full-stack geliştirme ve IoT çözümleri sunan serbest (freelance) yazılımcı Bahadır Büyüktopaç.',
    url: 'https://bahadirbuyuktopac.com',
    sameAs: [
      'https://github.com/bahadirbuyuktopac',
      'https://linkedin.com'
    ]
  } : {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Bahadir Buyuktopac',
    jobTitle: 'Full-Stack Developer & IoT Engineer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Edirne',
      addressCountry: 'TR'
    },
    description: 'Personal portfolio of Bahadır Büyüktopaç, Full-stack developer and IoT engineer.',
    url: 'https://bahadirbuyuktopac.com'
  };

  return (
    <div className="flex flex-col gap-20 py-6">
      {/* Arama Motorları İçin Yapılandırılmış Veri (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* Görünmez SEO İçerikleri (Sadece Arama Motorları ve Ekran Okuyucular İçin - Ziyaretçi Görmez) */}
      <div className="sr-only">
        <h2>Uzunköprü Yazılımcı - Bahadır Büyüktopaç</h2>
        <p>Uzunköprü web yazılım, web tasarım, mobil yazılım entegrasyonu, gömülü sistemler ve endüstriyel IIoT projeleri geliştirme.</p>
        <p>Edirne Uzunköprü bölgesinde freelance yazılımcı arayanlar için temiz kod, yüksek performanslı web çözümleri sunuyorum.</p>
      </div>

      {/* 1. GİRİŞ (HERO) BÖLÜMÜ */}
      <SequenceHero dil={dogrulanmisDil} sozluk={sozluk} />

      {/* 2. HAKKIMDA BÖLÜMÜ */}
      <section id="hakkimda" className="flat-kart p-8 md:p-10 bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="max-w-3xl mx-auto flex flex-col gap-5">
          <span className="text-xs font-semibold text-accent tracking-wider uppercase font-mono">
            {sozluk.about.subtitle}
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {sozluk.about.title}
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            {sozluk.about.p1}
          </p>
          <p className="text-sm text-muted leading-relaxed">
            {sozluk.about.p2}
          </p>
        </div>
      </section>

      {/* 3. YETENEKLER BÖLÜMÜ */}
      <section id="yetenekler" className="flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <span className="text-xs font-semibold text-accent tracking-wider uppercase font-mono">
            {sozluk.skills.subtitle}
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {sozluk.skills.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Frontend */}
          <div className="flat-kart p-5 hover:border-accent transition-colors duration-150 bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="text-xl mb-3">🎨</div>
            <h3 className="font-bold text-sm text-foreground mb-3">{sozluk.skills.frontend}</h3>
            <div className="flex flex-wrap gap-1.5">
              {onYuzTeknolojileri.map((tek) => (
                <span key={tek} className="text-[10px] px-2 py-0.5 rounded bg-background border border-card-border text-foreground/80 font-mono">
                  {tek}
                </span>
              ))}
            </div>
          </div>

          {/* Backend */}
          <div className="flat-kart p-5 hover:border-accent transition-colors duration-150 bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="text-xl mb-3">⚙️</div>
            <h3 className="font-bold text-sm text-foreground mb-3">{sozluk.skills.backend}</h3>
            <div className="flex flex-wrap gap-1.5">
              {arkaYuzTeknolojileri.map((tek) => (
                <span key={tek} className="text-[10px] px-2 py-0.5 rounded bg-background border border-card-border text-foreground/80 font-mono">
                  {tek}
                </span>
              ))}
            </div>
          </div>

          {/* IoT */}
          <div className="flat-kart p-5 hover:border-accent transition-colors duration-150 bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="text-xl mb-3">📟</div>
            <h3 className="font-bold text-sm text-foreground mb-3">{sozluk.skills.iot}</h3>
            <div className="flex flex-wrap gap-1.5">
              {iotTeknolojileri.map((tek) => (
                <span key={tek} className="text-[10px] px-2 py-0.5 rounded bg-background border border-card-border text-foreground/80 font-mono">
                  {tek}
                </span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="flat-kart p-5 hover:border-accent transition-colors duration-150 bg-black/[0.01] dark:bg-white/[0.01]">
            <div className="text-xl mb-3">🛠️</div>
            <h3 className="font-bold text-sm text-foreground mb-3">{sozluk.skills.tools}</h3>
            <div className="flex flex-wrap gap-1.5">
              {araclarVeVeritabanlari.map((tek) => (
                <span key={tek} className="text-[10px] px-2 py-0.5 rounded bg-background border border-card-border text-foreground/80 font-mono">
                  {tek}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. ÖNE ÇIKAN PROJELER */}
      <section id="projeler" className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2 text-left">
            <span className="text-xs font-semibold text-accent tracking-wider uppercase font-mono">
              {sozluk.projects.subtitle}
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {sozluk.projects.title}
            </h2>
          </div>
          <Link
            href={`/${dogrulanmisDil}/projeler`}
            className="px-4 py-2 rounded-lg border border-card-border bg-card-bg text-xs font-bold text-accent flex items-center gap-1.5 hover:border-accent transition-colors"
          >
            <span>{sozluk.projects.filter_all}</span>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {secilmisProjeler.length === 0 ? (
          <p className="text-sm text-muted text-center py-12 border border-dashed border-card-border rounded-2xl">
            {dogrulanmisDil === 'tr' ? 'Henüz proje eklenmedi.' : 'No projects added yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secilmisProjeler.map((proje: any) => (
              <ProjeKarti key={proje.id} proje={proje} sozluk={sozluk} />
            ))}
          </div>
        )}
      </section>

      {/* 5. İLETİŞİM BÖLÜMÜ */}
      <section id="iletisim" className="flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <span className="text-xs font-semibold text-accent tracking-wider uppercase font-mono">
            {sozluk.contact.subtitle}
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {sozluk.contact.title}
          </h2>
        </div>

        <IletisimFormu sozluk={sozluk} />
      </section>
    </div>
  );
}
