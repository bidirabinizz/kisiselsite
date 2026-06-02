'use client';

import { useState, useEffect } from 'react';

export default function YuklemeEkrani() {
  const [yuklenmeYuzdesi, setYuklenmeYuzdesi] = useState(0);
  const [gorunur, setGorunur] = useState(true);
  const [animasyonBaslat, setAnimasyonBaslat] = useState(false);

  useEffect(() => {
    // Sayfa mount edildiğinde ikon ve yazı animasyonlarını hafif gecikmeyle başlatıyoruz
    const animasyonZamanlayici = setTimeout(() => {
      setAnimasyonBaslat(true);
    }, 100);

    let progress = 0;
    const interval = setInterval(() => {
      // Belge tamamen yüklendiyse barı anında doldur
      if (document.readyState === 'complete') {
        progress = 100;
      } else {
        // Tarayıcı yüklenme hızına göre rastgele artışlar yapalım
        const artis = Math.floor(Math.random() * 15) + 5;
        progress = Math.min(progress + artis, 99);
      }

      setYuklenmeYuzdesi(progress);

      if (progress >= 100) {
        clearInterval(interval);
        // Bar %100 olduktan 400ms sonra fade-out başlatıyoruz
        setTimeout(() => {
          setGorunur(false);
        }, 400);
      }
    }, 120);

    // load event dinleyicisi ekleyerek tarayıcı tamamen bitirdiğinde tetikliyoruz
    const sayfaYuklendi = () => {
      progress = 100;
      setYuklenmeYuzdesi(100);
    };

    if (document.readyState === 'complete') {
      sayfaYuklendi();
    } else {
      window.addEventListener('load', sayfaYuklendi);
    }

    return () => {
      clearTimeout(animasyonZamanlayici);
      clearInterval(interval);
      window.removeEventListener('load', sayfaYuklendi);
    };
  }, []);

  if (!gorunur) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-in-out ${yuklenmeYuzdesi >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
    >
      <div className="flex flex-col items-center max-w-xs w-full px-6 text-center">
        {/* Bahadır Büyüktopaç Yazısı (Aşağıdan yukarı kayarak gelir) */}
        <h1
          className={`text-sm font-black uppercase tracking-[0.2em] text-foreground transition-all duration-700 ease-out transform ${animasyonBaslat
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-6'
            }`}
        >
          Bahadır Büyüktopaç
        </h1>

        {/* Flat Çizgisel Progress Bar */}
        <div className="w-full h-[2px] bg-card-border mt-6 mb-8 overflow-hidden rounded-full relative">
          <div
            className="h-full bg-accent transition-all duration-300 ease-out"
            style={{ width: `${yuklenmeYuzdesi}%` }}
          />
        </div>

        {/* Sosyal Medya İkonları (Sırayla aşağıdan yukarı gelir) */}
        <div className="flex items-center gap-6 justify-center">
          {/* GitHub */}
          <a
            href="https://github.com/bidirabinizz"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-muted hover:text-accent transition-all duration-700 delay-100 ease-out transform ${animasyonBaslat
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
              }`}
            aria-label="GitHub"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-muted hover:text-accent transition-all duration-700 delay-200 ease-out transform ${animasyonBaslat
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
              }`}
            aria-label="Instagram"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051c-.058 1.28-.072 1.688-.072 4.949s.014 3.67.072 4.951c.2 4.358 2.617 6.78 6.979 6.98 1.281.058 1.689.072 4.948.072 3.261 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.261-.014-3.669-.073-4.949-.2-4.357-2.617-6.784-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-muted hover:text-accent transition-all duration-700 delay-300 ease-out transform ${animasyonBaslat
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
              }`}
            aria-label="LinkedIn"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
