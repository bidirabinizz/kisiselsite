import 'server-only';

const sozlukler = {
  en: () => import('./dictionaries/en.json').then((modul) => modul.default),
  tr: () => import('./dictionaries/tr.json').then((modul) => modul.default),
};

export type DilTipi = keyof typeof sozlukler;

export const dilKontrolEt = (dil: string): dil is DilTipi =>
  dil in sozlukler;

export const sozlukGetir = async (dil: DilTipi) => {
  if (!dilKontrolEt(dil)) {
    return sozlukler['en']();
  }
  return sozlukler[dil]();
};
