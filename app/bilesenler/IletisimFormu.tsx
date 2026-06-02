'use client';

import { useState } from 'react';

interface IletisimFormuProps {
  sozluk: any;
}

export default function IletisimFormu({ sozluk }: IletisimFormuProps) {
  const [formVerisi, setFormVerisi] = useState({ isim: '', eposta: '', mesaj: '' });
  const [durum, setDurum] = useState<'beklemede' | 'gonderiliyor' | 'basarili' | 'hata'>('beklemede');

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVerisi.isim || !formVerisi.eposta || !formVerisi.mesaj) return;

    setDurum('gonderiliyor');

    // Sunucuya gönderme simülasyonu
    setTimeout(() => {
      setDurum('basarili');
      setFormVerisi({ isim: '', eposta: '', mesaj: '' });
      
      // 5 saniye sonra bildirim ekranını temizle
      setTimeout(() => {
        setDurum('beklemede');
      }, 5000);
    }, 1500);
  };

  return (
    <form onSubmit={gonder} className="flat-kart p-6 md:p-8 flex flex-col gap-5 w-full max-w-lg mx-auto bg-black/[0.01] dark:bg-white/[0.01]">
      <div>
        <label htmlFor="isim" className="block text-xs font-bold mb-2 uppercase tracking-wider text-foreground/80">
          {sozluk.contact.name}
        </label>
        <input
          type="text"
          id="isim"
          required
          value={formVerisi.isim}
          onChange={(e) => setFormVerisi({ ...formVerisi, isim: e.target.value })}
          disabled={durum === 'gonderiliyor'}
          className="w-full px-4 py-3 rounded-lg border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none transition-all disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="eposta" className="block text-xs font-bold mb-2 uppercase tracking-wider text-foreground/80">
          {sozluk.contact.email}
        </label>
        <input
          type="email"
          id="eposta"
          required
          value={formVerisi.eposta}
          onChange={(e) => setFormVerisi({ ...formVerisi, eposta: e.target.value })}
          disabled={durum === 'gonderiliyor'}
          className="w-full px-4 py-3 rounded-lg border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none transition-all disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="mesaj" className="block text-xs font-bold mb-2 uppercase tracking-wider text-foreground/80">
          {sozluk.contact.message}
        </label>
        <textarea
          id="mesaj"
          rows={4}
          required
          value={formVerisi.mesaj}
          onChange={(e) => setFormVerisi({ ...formVerisi, mesaj: e.target.value })}
          disabled={durum === 'gonderiliyor'}
          className="w-full px-4 py-3 rounded-lg border border-card-border bg-background text-sm text-foreground focus:border-accent focus:outline-none transition-all disabled:opacity-50 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={durum === 'gonderiliyor'}
        className="w-full py-3 rounded-lg bg-accent text-white text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
      >
        {durum === 'gonderiliyor' ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{sozluk.contact.sending}</span>
          </>
        ) : (
          <span>{sozluk.contact.send}</span>
        )}
      </button>

      {/* Mesaj Durum Bildirimleri */}
      {durum === 'basarili' && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold text-center animate-fade-in">
          {sozluk.contact.success}
        </div>
      )}
      {durum === 'hata' && (
        <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold text-center animate-fade-in">
          {sozluk.contact.error}
        </div>
      )}
    </form>
  );
}
