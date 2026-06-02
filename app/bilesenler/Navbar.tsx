'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavbarProps {
  dil: 'tr' | 'en';
  sozluk: any;
}

export default function Navbar({ dil, sozluk }: NavbarProps) {
  const [menuAcik, setMenuAcik] = useState(false);
  const [tema, setTema] = useState<'dark' | 'light'>('dark');
  const [kaydirildi, setKaydirildi] = useState(false);
  const yolIsmi = usePathname();
  const yonlendirici = useRouter();

  // Bileşen yüklendiğinde temayı yerel depolamadan alıyoruz
  useEffect(() => {
    const kayitliTema = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const varsayilanTema = kayitliTema || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    setTema(varsayilanTema);
    if (varsayilanTema === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Sayfa kaydırıldığında navbarın arka planını değiştirmek için dinliyoruz
  useEffect(() => {
    const kaydirmaKontrol = () => {
      setKaydirildi(window.scrollY > 20);
    };
    window.addEventListener('scroll', kaydirmaKontrol);
    return () => window.removeEventListener('scroll', kaydirmaKontrol);
  }, []);

  const temaDegistir = () => {
    const yeniTema = tema === 'dark' ? 'light' : 'dark';
    setTema(yeniTema);
    localStorage.setItem('theme', yeniTema);
    
    if (yeniTema === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const dilDegistir = () => {
    const hedefDil = dil === 'tr' ? 'en' : 'tr';
    
    // Dil tercihini çereze yazalım
    document.cookie = `NEXT_LOCALE=${hedefDil};path=/;max-age=${60 * 60 * 24 * 365}`;
    
    // URL'deki dil kodunu güncelliyoruz
    const parcalar = yolIsmi.split('/');
    if (parcalar[1] === 'tr' || parcalar[1] === 'en') {
      parcalar[1] = hedefDil;
    } else {
      parcalar.unshift('', hedefDil);
    }
    
    const yeniYol = parcalar.join('/') || `/${hedefDil}`;
    yonlendirici.push(yeniYol);
  };

  // Aktif link kontrolü yapan basit yardımcı fonksiyon
  const linkAktifMi = (yol: string) => {
    const dilsizYol = yolIsmi.replace(/^\/(tr|en)/, '') || '/';
    if (yol === '/') {
      return dilsizYol === '/';
    }
    return dilsizYol.startsWith(yol);
  };

  const menuler = [
    { baslik: sozluk.nav.home, yol: '/' },
    { baslik: sozluk.nav.projects, yol: '/projeler' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        kaydirildi
          ? 'glass py-3 shadow-md'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo / İsim */}
        <Link href={`/${dil}`} className="text-xl font-extrabold tracking-tight glow-hover flex items-center gap-2 font-title">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-black shadow-lg">
            B
          </span>
          <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
            Bahadır B.
          </span>
        </Link>

        {/* Masaüstü Menü */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {menuler.map((menu) => (
              <Link
                key={menu.yol}
                href={`/${dil}${menu.yol === '/' ? '' : menu.yol}`}
                className={`text-sm font-medium transition-colors hover:text-accent relative py-1 ${
                  linkAktifMi(menu.yol)
                    ? 'text-accent font-semibold'
                    : 'text-foreground/80'
                }`}
              >
                {menu.baslik}
                {linkAktifMi(menu.yol) && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 pl-4 border-l border-foreground/10">
            {/* Dil Değiştirici */}
            <button
              onClick={dilDegistir}
              className="px-3 py-1.5 rounded-lg text-xs font-bold glass flex items-center gap-1.5 transition-all duration-200 hover:scale-105 cursor-pointer"
              aria-label="Dili değiştir"
            >
              <span>🌐</span>
              <span>{dil === 'tr' ? 'EN' : 'TR'}</span>
            </button>

            {/* Tema Değiştirici */}
            <button
              onClick={temaDegistir}
              className="p-2 rounded-lg glass transition-all duration-200 hover:scale-115 text-sm cursor-pointer"
              aria-label="Temayı değiştir"
            >
              {tema === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Mobil Menü Butonu */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Mobil Tema Butonu */}
          <button
            onClick={temaDegistir}
            className="p-2 rounded-lg glass text-sm"
            aria-label="Temayı değiştir"
          >
            {tema === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Mobil Dil Butonu */}
          <button
            onClick={dilDegistir}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold glass"
          >
            {dil === 'tr' ? 'EN' : 'TR'}
          </button>

          <button
            onClick={() => setMenuAcik(!menuAcik)}
            className="p-2 rounded-lg glass transition-all focus:outline-none"
            aria-label="Mobil menüyü aç/kapat"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuAcik ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobil Menü Paneli */}
      {menuAcik && (
        <div className="md:hidden absolute top-full left-0 w-full glass border-b border-foreground/10 px-6 py-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
          {menuler.map((menu) => (
            <Link
              key={menu.yol}
              href={`/${dil}${menu.yol === '/' ? '' : menu.yol}`}
              onClick={() => setMenuAcik(false)}
              className={`text-base font-semibold py-2 transition-colors ${
                linkAktifMi(menu.yol) ? 'text-accent' : 'text-foreground/80'
              }`}
            >
              {menu.baslik}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
