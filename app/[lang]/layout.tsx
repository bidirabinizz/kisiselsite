import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '../globals.css';
import { sozlukGetir } from './dictionaries';
import Navbar from '../bilesenler/Navbar';
import Footer from '../bilesenler/Footer';
import YuklemeEkrani from '../bilesenler/YuklemeEkrani';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'tr' }];
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { lang } = await params;
  const dogrulanmisDil = lang === 'tr' ? 'tr' : 'en';

  if (dogrulanmisDil === 'tr') {
    return {
      title: 'Bahadır Büyüktopaç | Yazılımcı & IoT Mühendisi',
      description: 'Uzunköprü ve Edirne bölgesinde profesyonel Web Yazılımcı, Mobil Yazılımcı ve Bilgisayar Programlama hizmetleri sunan Bahadır Büyüktopaç\'ın kişisel portföyü.',
      keywords: ['Bahadır Büyüktopaç', 'Uzunköprü Yazılımcı', 'Mobil Yazılımcı', 'Web Yazılımcı', 'Bilgisayar Programlama', 'Uzunköprü web tasarım', 'Uzunköprü yazılım', 'Edirne yazılımcı', 'IoT'],
    };
  }

  return {
    title: 'Bahadir Buyuktopac | Full-Stack Developer & IoT Engineer',
    description: 'Personal portfolio of Bahadır Büyüktopaç, specializing in high-performance web development and IoT embedded software.',
    keywords: ['Full-stack developer', 'IoT engineer', 'Next.js developer', 'TypeScript', 'Edirne developer'],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const { lang } = await params;
  const dogrulanmisDil = lang === 'tr' ? 'tr' : 'en';
  const sozluk = await sozlukGetir(dogrulanmisDil);

  return (
    <html
      lang={dogrulanmisDil}
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Sayfa ilk yüklendiğinde temanın titremesini önleyen küçük script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const kayitliTema = localStorage.getItem('theme');
                  const sistemTercihi = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const varsayilanTema = kayitliTema || (sistemTercihi ? 'dark' : 'light');
                  if (varsayilanTema === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error(e);
                }
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground grid-bg relative transition-colors duration-200">
        <YuklemeEkrani />
        <Navbar dil={dogrulanmisDil} sozluk={sozluk} />
        
        <main className="flex-grow pt-24 pb-12 z-10 max-w-6xl mx-auto px-6 w-full">
          {children}
        </main>
        
        <Footer dil={dogrulanmisDil} />
      </body>
    </html>
  );
}
