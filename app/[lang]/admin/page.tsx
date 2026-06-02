'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  adminGiris,
  adminCikis,
  adminGirisKontrol,
  projeleriGetir,
  projeEkle,
  projeGuncelle,
  projeSil,
  Proje,
} from '../../actions/projectActions';

export default function AdminPage() {
  const router = useRouter();
  const [sifre, setSifre] = useState('');
  const [girisYapildi, setGirisYapildi] = useState<boolean | null>(null);
  const [projeler, setProjeler] = useState<Proje[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const [mesaj, setMesaj] = useState('');

  // Modal Durumları
  const [modalAcik, setModalAcik] = useState(false);
  const [seciliProje, setSeciliProje] = useState<Proje | null>(null);

  // Form Durumları
  const [formVerisi, setFormVerisi] = useState<Omit<Proje, 'id' | 'created_at'>>({
    title_tr: '',
    title_en: '',
    description_tr: '',
    description_en: '',
    category: 'web',
    tags: [],
    github_url: '',
    live_url: '',
    visible: true,
    status: 'completed',
    image_url: '',
  });
  const [etiketGirdisi, setEtiketGirdisi] = useState('');

  // Giriş durumunu kontrol et
  useEffect(() => {
    adminGirisKontrol().then((yetkili) => {
      setGirisYapildi(yetkili);
      if (yetkili) {
        veriYukle();
      }
    });
  }, []);

  const veriYukle = async () => {
    setYukleniyor(true);
    const data = await projeleriGetir(true);
    setProjeler(data);
    setYukleniyor(false);
  };

  const handleGiris = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');
    const res = await adminGiris(sifre);
    if (res.success) {
      setGirisYapildi(true);
      veriYukle();
    } else {
      setHata(res.error || 'Şifre hatalı');
    }
  };

  const handleCikis = async () => {
    await adminCikis();
    setGirisYapildi(false);
    setProjeler([]);
  };

  const handleModalAc = (proje: Proje | null = null) => {
    if (proje) {
      setSeciliProje(proje);
      setFormVerisi({
        title_tr: proje.title_tr,
        title_en: proje.title_en,
        description_tr: proje.description_tr,
        description_en: proje.description_en,
        category: proje.category,
        tags: proje.tags,
        github_url: proje.github_url || '',
        live_url: proje.live_url || '',
        visible: proje.visible,
        status: proje.status || 'completed',
        image_url: proje.image_url || '',
      });
      setEtiketGirdisi(proje.tags.join(', '));
    } else {
      setSeciliProje(null);
      setFormVerisi({
        title_tr: '',
        title_en: '',
        description_tr: '',
        description_en: '',
        category: 'web',
        tags: [],
        github_url: '',
        live_url: '',
        visible: true,
        status: 'completed',
        image_url: '',
      });
      setEtiketGirdisi('');
    }
    setModalAcik(true);
  };

  const handleKaydet = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');
    setMesaj('');

    // Etiketleri parse et
    const parsedTags = etiketGirdisi
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    const gonderilecekVeri = {
      ...formVerisi,
      tags: parsedTags,
    };

    setYukleniyor(true);
    let res;
    if (seciliProje?.id) {
      res = await projeGuncelle(seciliProje.id, gonderilecekVeri);
    } else {
      res = await projeEkle(gonderilecekVeri);
    }
    setYukleniyor(false);

    if (res.success) {
      setMesaj(seciliProje ? 'Proje başarıyla güncellendi!' : 'Proje başarıyla eklendi!');
      setModalAcik(false);
      veriYukle();
      // 3 saniye sonra mesajı kaldır
      setTimeout(() => setMesaj(''), 3000);
    } else {
      setHata(res.error || 'Kaydederken bir hata oluştu');
    }
  };

  const handleSil = async (id: string) => {
    if (!window.confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
    setHata('');
    setYukleniyor(true);
    const res = await projeSil(id);
    setYukleniyor(false);

    if (res.success) {
      setMesaj('Proje silindi.');
      veriYukle();
      setTimeout(() => setMesaj(''), 3000);
    } else {
      setHata(res.error || 'Silerken bir hata oluştu');
    }
  };

  const handleGörünürlükDegistir = async (proje: Proje) => {
    if (!proje.id) return;
    const yeniGörünürlük = !proje.visible;
    const res = await projeGuncelle(proje.id, { visible: yeniGörünürlük });
    if (res.success) {
      setProjeler(
        projeler.map((p) => (p.id === proje.id ? { ...p, visible: yeniGörünürlük } : p))
      );
    }
  };

  if (girisYapildi === null) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
      </div>
    );
  }

  // GİRİŞ EKRANI
  if (!girisYapildi) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="flat-kart p-8 shadow-2xl bg-card-bg/60 backdrop-blur-md">
          <div className="text-center mb-6">
            <span className="text-2xl">🔐</span>
            <h1 className="text-2xl font-extrabold tracking-tight mt-2 text-foreground">
              Yönetim Paneli Girişi
            </h1>
            <p className="text-xs text-muted mt-1 font-mono">// projeleri yönetmek için şifrenizi girin</p>
          </div>

          <form onSubmit={handleGiris} className="flex flex-col gap-4">
            <div>
              <label htmlFor="admin_sifre" className="block text-[10px] font-bold uppercase tracking-wider mb-1.5 text-muted font-mono">
                Admin Şifresi
              </label>
              <input
                type="password"
                id="admin_sifre"
                required
                value={sifre}
                onChange={(e) => setSifre(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none transition-all"
              />
            </div>

            {hata && (
              <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold text-center font-mono">
                {hata}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-secondary hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 cursor-pointer active:scale-[0.99]"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  // DASHBOARD EKRANI
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-card-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Proje Yönetim Paneli
          </h1>
          <p className="text-xs text-muted font-mono mt-1">
            // veri tabanındaki projeleri ekleyin, güncelleyin veya gizleyin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleModalAc()}
            className="px-4 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-secondary hover:shadow-md hover:shadow-accent/20 transition-all duration-200 cursor-pointer"
          >
            + Yeni Proje Ekle
          </button>
          <button
            onClick={handleCikis}
            className="px-4 py-2.5 rounded-xl border border-card-border bg-card-bg text-foreground text-xs font-semibold hover:border-rose-500/50 hover:text-rose-500 transition-all duration-200 cursor-pointer"
          >
            Çıkış Yap
          </button>
        </div>
      </div>

      {/* Mesaj & Hata */}
      {mesaj && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold text-center animate-fade-in">
          {mesaj}
        </div>
      )}
      {hata && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold text-center font-mono animate-fade-in">
          {hata}
        </div>
      )}

      {/* Projeler Listesi */}
      <div className="flat-kart overflow-hidden bg-card-bg/30 backdrop-blur-md">
        {yukleniyor && projeler.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted font-mono">Projeler yükleniyor...</div>
        ) : projeler.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted">
            Henüz eklenmiş proje yok. "+ Yeni Proje Ekle" butonuna basarak ilk projenizi ekleyebilirsiniz.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-card-border bg-black/[0.02] dark:bg-white/[0.02] text-muted uppercase font-mono tracking-wider">
                  <th className="p-4 font-bold">Proje Adı (TR)</th>
                  <th className="p-4 font-bold">Kategori</th>
                  <th className="p-4 font-bold">Proje Durumu</th>
                  <th className="p-4 font-bold">Teknolojiler</th>
                  <th className="p-4 font-bold text-center">Yayın</th>
                  <th className="p-4 font-bold text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {projeler.map((proje) => (
                  <tr key={proje.id} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 font-medium text-foreground">
                      <div className="flex items-center gap-3">
                        {proje.image_url ? (
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-card-border bg-card-bg flex-shrink-0 relative">
                            <img src={proje.image_url} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-accent/20 to-accent-secondary/20 border border-card-border flex items-center justify-center flex-shrink-0 text-xs font-bold text-accent">
                            {proje.category === 'iot' ? '🔌' : '💻'}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold">{proje.title_tr}</div>
                          <div className="text-[10px] text-muted italic font-mono mt-0.5">{proje.title_en}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                        proje.category === 'iot' 
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10' 
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10'
                      }`}>
                        {proje.category === 'iot' ? '🔌 IoT' : '💻 Web'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                        proje.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10'
                          : proje.status === 'in_progress'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10'
                      }`}>
                        {proje.status === 'completed' ? 'Tamamlandı' : proje.status === 'in_progress' ? 'Geliştiriliyor' : 'Sadece Kod'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {proje.tags.map((t) => (
                          <span key={t} className="text-[9px] font-mono px-1 rounded bg-black/5 dark:bg-white/5 text-muted border border-card-border">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleGörünürlükDegistir(proje)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all duration-200 ${
                          proje.visible
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {proje.visible ? 'Yayında' : 'Gizli'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleModalAc(proje)}
                          className="px-2.5 py-1 rounded border border-card-border bg-card-bg text-foreground hover:border-accent hover:text-accent font-semibold transition-colors cursor-pointer"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => proje.id && handleSil(proje.id)}
                          className="px-2.5 py-1 rounded border border-card-border bg-card-bg text-rose-500 hover:bg-rose-500/10 hover:border-rose-500 transition-colors cursor-pointer"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      {modalAcik && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="flat-kart w-full max-w-2xl bg-card-bg shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-card-border pb-4 mb-6">
              <h2 className="text-xl font-extrabold text-foreground">
                {seciliProje ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
              </h2>
              <button
                onClick={() => setModalAcik(false)}
                className="text-muted hover:text-foreground text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleKaydet} className="flex flex-col gap-5">
              {/* Türkçe & İngilizce Başlıklar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-muted font-mono">Proje Adı (Türkçe)</label>
                  <input
                    type="text"
                    required
                    value={formVerisi.title_tr}
                    onChange={(e) => setFormVerisi({ ...formVerisi, title_tr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-muted font-mono">Project Title (English)</label>
                  <input
                    type="text"
                    required
                    value={formVerisi.title_en}
                    onChange={(e) => setFormVerisi({ ...formVerisi, title_en: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Kategori & Etiketler */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-muted font-mono">Kategori</label>
                  <select
                    value={formVerisi.category}
                    onChange={(e) => setFormVerisi({ ...formVerisi, category: e.target.value as 'web' | 'iot' })}
                    className="w-full px-3 py-2 rounded-xl border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none"
                  >
                    <option value="web">Web Uygulaması</option>
                    <option value="iot">IoT & Donanım</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-muted font-mono">Proje Durumu</label>
                  <select
                    value={formVerisi.status}
                    onChange={(e) => setFormVerisi({ ...formVerisi, status: e.target.value as 'completed' | 'in_progress' | 'code_only' })}
                    className="w-full px-3 py-2 rounded-xl border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none"
                  >
                    <option value="completed">Tamamlandı</option>
                    <option value="in_progress">Geliştiriliyor / Devam Ediyor</option>
                    <option value="code_only">Sadece Kod / Açık Kaynak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-muted font-mono">Teknolojiler (Virgülle Ayırın)</label>
                  <input
                    type="text"
                    value={etiketGirdisi}
                    onChange={(e) => setEtiketGirdisi(e.target.value)}
                    placeholder="Next.js, ESP32, MQTT..."
                    className="w-full px-3 py-2 rounded-xl border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Türkçe Açıklama */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-muted font-mono">Açıklama (Türkçe)</label>
                <textarea
                  rows={3}
                  required
                  value={formVerisi.description_tr}
                  onChange={(e) => setFormVerisi({ ...formVerisi, description_tr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none resize-none"
                />
              </div>

              {/* İngilizce Açıklama */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-muted font-mono">Description (English)</label>
                <textarea
                  rows={3}
                  required
                  value={formVerisi.description_en}
                  onChange={(e) => setFormVerisi({ ...formVerisi, description_en: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none resize-none"
                />
              </div>

              {/* Görsel & Linkler */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-muted font-mono">Görsel URL</label>
                  <input
                    type="url"
                    value={formVerisi.image_url}
                    onChange={(e) => setFormVerisi({ ...formVerisi, image_url: e.target.value })}
                    placeholder="https://.../proje.jpg"
                    className="w-full px-3 py-2 rounded-xl border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-muted font-mono">Github URL</label>
                  <input
                    type="url"
                    value={formVerisi.github_url}
                    onChange={(e) => setFormVerisi({ ...formVerisi, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-muted font-mono">Live Demo / Canlı Link</label>
                  <input
                    type="url"
                    value={formVerisi.live_url}
                    onChange={(e) => setFormVerisi({ ...formVerisi, live_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              {/* Görünürlük Switch */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="visible_check"
                  checked={formVerisi.visible}
                  onChange={(e) => setFormVerisi({ ...formVerisi, visible: e.target.checked })}
                  className="w-4 h-4 rounded text-accent focus:ring-accent"
                />
                <label htmlFor="visible_check" className="text-xs font-semibold text-foreground select-none cursor-pointer">
                  Projeyi doğrudan yayına al (Sitede görünecek)
                </label>
              </div>

              {/* Aksiyonlar */}
              <div className="flex items-center justify-end gap-3 border-t border-card-border pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setModalAcik(false)}
                  className="px-5 py-2.5 rounded-xl border border-card-border bg-card-bg text-foreground text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={yukleniyor}
                  className="px-5 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-secondary hover:shadow-md hover:shadow-accent/20 transition-all cursor-pointer"
                >
                  {yukleniyor ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
