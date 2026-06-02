import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const diller = ['tr', 'en'];
const varsayilanDil = 'en';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pathname içinde dil kodu var mı bakıyoruz
  const yolDilIceriyorMu = diller.some(
    (dil) => pathname.startsWith(`/${dil}/`) || pathname === `/${dil}`
  );

  if (yolDilIceriyorMu) return;

  // Hangi dili seçeceğimizi belirliyoruz
  let secilenDil = varsayilanDil;

  // 1. Önce çerezde kayıtlı tercih var mı diye bak
  const dilCerezi = req.cookies.get('NEXT_LOCALE')?.value;
  if (dilCerezi && diller.includes(dilCerezi)) {
    secilenDil = dilCerezi;
  } else {
    // 2. Vercel IP ülke koduna bak (Türkiye ise doğrudan TR)
    const ulkeKodu = req.headers.get('x-vercel-ip-country');
    if (ulkeKodu && ulkeKodu.toUpperCase() === 'TR') {
      secilenDil = 'tr';
    } else {
      // 3. Tarayıcı dil ayarlarına (Accept-Language) bak
      const tarayiciDilleri = req.headers.get('accept-language');
      if (tarayiciDilleri) {
        const dillerListesi = tarayiciDilleri
          .split(',')
          .map((d) => d.split(';')[0].trim().toLowerCase());

        for (const tekDil of dillerListesi) {
          if (tekDil.startsWith('tr')) {
            secilenDil = 'tr';
            break;
          }
          if (tekDil.startsWith('en')) {
            secilenDil = 'en';
            break;
          }
        }
      }
    }
  }

  // Kullanıcıyı uygun dil yoluna yönlendiriyoruz
  const yeniUrl = req.nextUrl.clone();
  yeniUrl.pathname = `/${secilenDil}${pathname}`;

  const res = NextResponse.redirect(yeniUrl);

  // Çerezi kaydedelim ki tercih hatırlansın
  res.cookies.set('NEXT_LOCALE', secilenDil, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 yıl
  });

  return res;
}

export const config = {
  matcher: [
    // Gereksiz statik dosyaları ve api isteklerini yönlendirme dışında bırakıyoruz
    '/((?!_next|api|favicon.ico|.*\\..*).*)',
  ],
};
