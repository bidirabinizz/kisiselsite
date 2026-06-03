'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOPLAM_KARE = 189; // Toplam kare sayısı

const kareYolu = (index: number) =>
  `/sequence/hero/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;

interface SequenceHeroProps {
  dil: string;
  sozluk: any;
}

export default function SequenceHero({ dil, sozluk }: SequenceHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);

  const resimlerRef = useRef<HTMLImageElement[]>([]);
  const aktifKare = useRef({ index: 1 });
  const [yuklendi, setYuklendi] = useState(false);

  // Görseli canvas'a cover modunda çizen fonksiyon
  const kareyiCiz = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    
    // Aktif kare indeksini güvenli sınırlar arasında sınırlıyoruz (1 ile TOPLAM_KARE)
    let index = Math.floor(aktifKare.current.index);
    if (index < 1) index = 1;
    if (index > TOPLAM_KARE) index = TOPLAM_KARE;

    const resim = resimlerRef.current[index - 1];

    if (!canvas || !context || !resim || !resim.complete) return;

    const dpr = window.devicePixelRatio || 1;
    const rectWidth = canvas.clientWidth;
    const rectHeight = canvas.clientHeight;

    // Boyutlar 0 ise (örneğin sayfa yüklenirken veya gizlenirken) çizim yapmıyoruz
    if (rectWidth === 0 || rectHeight === 0) return;

    // Canvas'ın gerçek piksel boyutunu dpr (retina/yüksek çözünürlük) ile çarparak ayarlıyoruz.
    // CSS'teki "w-full h-full" sınıf kuralının ezilmemesi için canvas.style.width/height değerlerini inline olarak değiştirmiyoruz.
    // Bu sayede tarayıcı yakınlaştırmasında (zoom) veya pencere boyutu değişimlerinde canvas responsive kalır.
    canvas.width = rectWidth * dpr;
    canvas.height = rectHeight * dpr;

    // Çizim koordinat sistemini dpr oranında ölçekliyoruz
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Görüntünün netleşmesi için tarayıcının yumuşatma filtresini kapatıp piksel kalitesini iyileştiriyoruz
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';

    // Konteyner oranına göre görsel ölçeklendirme
    const canvasRatio = rectWidth / rectHeight;

    // Görselin canvas'ı her zaman tamamen kaplamasını (cover) sağlayan ölçek çarpanı
    const scale = Math.max(rectWidth / resim.width, rectHeight / resim.height);

    // Görseli yatay ve dikey olarak tam ortalamak için ofset hesaplaması
    const x = rectWidth / 2 - (resim.width * scale) / 2;
    // Mobil/Dikey ekranlarda yüzünüzün (görselin üst/orta kısmı) tam görünmesi için dikey hizalamayı yukarıya kaydırıyoruz
    const y = canvasRatio < 1 
      ? (rectHeight / 2 - (resim.height * scale) / 2) - (rectHeight * 0.08) 
      : rectHeight / 2 - (resim.height * scale) / 2;

    context.clearRect(0, 0, rectWidth, rectHeight);
    context.drawImage(resim, x, y, resim.width * scale, resim.height * scale);
  };

  // Karelerin önbelleğe yüklenmesi
  useEffect(() => {
    let yuklenenSayisi = 0;
    const geciciResimler: HTMLImageElement[] = [];

    for (let i = 1; i <= TOPLAM_KARE; i++) {
      const img = new window.Image();
      img.src = kareYolu(i);
      img.onload = () => {
        yuklenenSayisi += 1;

        if (i === 1) {
          kareyiCiz();
        }

        if (yuklenenSayisi === TOPLAM_KARE) {
          resimlerRef.current = geciciResimler;
          setYuklendi(true);
          kareyiCiz();
        }
      };
      geciciResimler.push(img);
    }
    resimlerRef.current = geciciResimler;
  }, []);

  // GSAP ve ScrollTrigger Animasyonu (Pinleme Olmadan)
  useLayoutEffect(() => {
    if (!yuklendi || !sectionRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;

    // Canvas boyut değişimlerini (mobil görünüm geçişleri, resize, zoom vb.) anlık ve hassas şekilde yakalayan gözlemci
    const resizeObserver = new ResizeObserver(() => {
      kareyiCiz();
    });
    resizeObserver.observe(canvas);

    const ctx = gsap.context(() => {
      // Başlangıç değerleri
      gsap.set(heroContentRef.current, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      });

      // Scroll Trigger Zaman Tüneli
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top+=96',  // Navbar yüksekliği altından başlar
          end: 'bottom top',     // Hero bölümü ekrandan çıkana kadar sürer
          scrub: 0.5,            // Kaydırma hassasiyeti
          pin: false,            // PİNLEME YOK
          invalidateOnRefresh: true,
          onRefresh: kareyiCiz,  // Sayfa yakınlaştırıldığında/boyutlandırıldığında veya yenilendiğinde canvas'ı tekrar çiz
        },
      });

      // 1. Resim karesinin kaydırılması
      tl.to(
        aktifKare.current,
        {
          index: TOPLAM_KARE,
          snap: 'index',
          ease: 'none',
          onUpdate: kareyiCiz,
          duration: 1.5,
        },
        0
      );

      // 2. Hero metinlerinin kaybolması (Aşağı kaydırdıkça)
      tl.to(
        heroContentRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.95,
          filter: 'blur(10px)',
          ease: 'power1.inOut',
          duration: 1.0,
        },
        0
      );

      setTimeout(() => ScrollTrigger.refresh(), 200);
    }, sectionRef);

    return () => {
      resizeObserver.disconnect();
      ctx.revert();
    };
  }, [yuklendi]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[75vh] min-h-[500px] w-full overflow-hidden bg-black text-white rounded-3xl border border-card-border/80 shadow-2xl"
    >
      {/* Video karelerinin çizildiği tuval */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full object-cover" />

      {/* Karartma Katmanı */}
      <div className="absolute inset-0 bg-black/55 z-10" />

      {/* Yükleme Durumu */}
      {!yuklendi && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black text-accent font-mono text-xs tracking-wider">
          // {dil === 'tr' ? 'Yükleniyor...' : 'Loading...'}
        </div>
      )}

      {/* İçerik Katmanı - Sabit Hizalama */}
      <div className="absolute inset-0 z-20 flex items-center px-6 md:px-12">
        <div
          ref={heroContentRef}
          className="flex flex-col items-start max-w-2xl w-full"
        >
          <span className="text-xs font-semibold text-accent tracking-widest uppercase font-mono mb-4">
            // {sozluk.hero.role}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white mb-6">
            {sozluk.hero.greeting} {dil === 'tr' ? 'Bahadır Büyüktopaç' : 'Bahadir Buyuktopac'}
          </h1>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-8">
            {sozluk.hero.description}
          </p>

          {/* Butonlar */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/${dil}/projeler`}
              className="px-6 py-3 rounded-xl bg-accent text-white text-sm font-semibold transition-all duration-300 hover:bg-accent-secondary hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98] cursor-pointer"
            >
              {sozluk.hero.cta_projects}
            </Link>
            <a
              href="/bahadircv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl border border-white/20 bg-white/5 text-white text-sm font-semibold hover:border-accent/50 hover:bg-white/10 transition-all duration-300 active:scale-[0.98]"
            >
              {sozluk.hero.cta_contact}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
