'use server';

import { cookies } from 'next/headers';
import { supabase } from '../../lib/supabase';
import { revalidatePath } from 'next/cache';

export interface Proje {
  id?: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  category: 'web' | 'iot';
  tags: string[];
  github_url: string;
  live_url: string;
  visible: boolean;
  status: 'completed' | 'in_progress' | 'code_only';
  image_url: string;
  created_at?: string;
}

export async function adminGiris(sifre: string) {
  const adminSifre = process.env.ADMIN_PASSWORD;
  if (sifre === adminSifre) {
    const cerezKutusu = await cookies();
    cerezKutusu.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 gün geçerli
      path: '/',
    });
    return { success: true };
  }
  return { success: false, error: 'Hatalı şifre' };
}

export async function adminCikis() {
  const cerezKutusu = await cookies();
  cerezKutusu.delete('admin_session');
  return { success: true };
}

export async function adminGirisKontrol() {
  const cerezKutusu = await cookies();
  return cerezKutusu.get('admin_session')?.value === 'authenticated';
}

export async function projeleriGetir(hepsi: boolean = false): Promise<Proje[]> {
  try {
    let sorgu = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!hepsi) {
      sorgu = sorgu.eq('visible', true);
    }

    const { data, error } = await sorgu;
    if (error) {
      console.error('Projeleri çekerken veritabanı hatası:', error);
      return [];
    }
    return (data as Proje[]) || [];
  } catch (err) {
    console.error('Projeleri çekerken beklenmedik hata:', err);
    return [];
  }
}

export async function projeEkle(proje: Omit<Proje, 'id' | 'created_at'>) {
  const yetkiliMi = await adminGirisKontrol();
  if (!yetkiliMi) {
    return { success: false, error: 'Yetkisiz erişim. Lütfen giriş yapın.' };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([proje])
      .select();

    if (error) {
      console.error('Proje ekleme veritabanı hatası:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/[lang]', 'layout');
    revalidatePath('/[lang]/projeler');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function projeGuncelle(id: string, proje: Partial<Proje>) {
  const yetkiliMi = await adminGirisKontrol();
  if (!yetkiliMi) {
    return { success: false, error: 'Yetkisiz erişim. Lütfen giriş yapın.' };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .update(proje)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Proje güncelleme veritabanı hatası:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/[lang]', 'layout');
    revalidatePath('/[lang]/projeler');
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function projeSil(id: string) {
  const yetkiliMi = await adminGirisKontrol();
  if (!yetkiliMi) {
    return { success: false, error: 'Yetkisiz erişim. Lütfen giriş yapın.' };
  }

  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Proje silme veritabanı hatası:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');
    revalidatePath('/[lang]', 'layout');
    revalidatePath('/[lang]/projeler');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function projeGetir(id: string): Promise<Proje | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Proje detayını çekerken veritabanı hatası:', error);
      return null;
    }
    return data as Proje;
  } catch (err) {
    console.error('Proje detayını çekerken beklenmedik hata:', err);
    return null;
  }
}

