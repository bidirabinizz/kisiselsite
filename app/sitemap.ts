import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Alan adınızı Vercel'e eklediğiniz adrese göre burası güncellenir.
  // Çevre değişkeni yoksa varsayılan olarak sizin alan adınızı kullanır.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bahadirbuyuktopac.com';
  
  const diller = ['tr', 'en'];
  const rotalar = ['', '/projeler'];

  const sitemapRotalari: MetadataRoute.Sitemap = [];

  diller.forEach((dil) => {
    rotalar.forEach((rota) => {
      sitemapRotalari.push({
        url: `${siteUrl}/${dil}${rota}`,
        lastModified: new Date(),
        changeFrequency: rota === '' ? 'weekly' : 'monthly',
        priority: rota === '' ? 1.0 : 0.8,
      });
    });
  });

  return sitemapRotalari;
}
