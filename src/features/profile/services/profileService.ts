import { supabase } from "@/lib/supabase";
import type { ProfileData } from '../types';
import { calculateTargetKalori } from '../utils';

export const profileService = {
  async updateName(nama: string) { // ✅ HAPUS userId parameter
    const { error } = await supabase.auth.updateUser({
      data: { full_name: nama }
    });
    if (error) throw error;
  },

  async updateEmail(email: string) {
    const { error } = await supabase.auth.updateUser({
      email: email
    });
    if (error) throw error;
  },

  async updateProfileData(userId: string, data: ProfileData, changedFields: Record<string, boolean>) {
    const tinggiBadanNum = data.tinggiBadan ? parseFloat(data.tinggiBadan) : null;
    const beratBadanNum = data.beratBadan ? parseFloat(data.beratBadan) : null;
    const umurNum = data.usia ? parseInt(data.usia) : null;
    const tujuanId = data.tujuan ? parseInt(data.tujuan) : null;
    const aktivitasId = data.aktivitas ? parseInt(data.aktivitas) : null;

    let targetKaloriBaru = null;

    const dataYangMempengaruhiKalori = ['tinggiBadan', 'beratBadan', 'usia', 'jenisKelamin', 'tujuan', 'aktivitas'];
    const adaPerubahanKalori = dataYangMempengaruhiKalori.some(field => changedFields[field]);

    if (adaPerubahanKalori && tinggiBadanNum && beratBadanNum && umurNum && data.jenisKelamin && data.tujuan && data.aktivitas) {
      targetKaloriBaru = calculateTargetKalori(
        tinggiBadanNum,
        beratBadanNum,
        umurNum,
        data.jenisKelamin,
        data.tujuan,
        data.aktivitas
      );
      console.log("🎯 Target kalori baru:", targetKaloriBaru);
    }

    const updateData: any = {
      user_id: userId,
      tinggi_badan: tinggiBadanNum,
      berat_badan: beratBadanNum,
      umur: umurNum,
      jenis_kelamin: data.jenisKelamin,
      tujuan_id: tujuanId,
      aktivitas_id: aktivitasId,
      diperbarui_pada: new Date().toISOString(),
    };

    if (targetKaloriBaru !== null) {
      updateData.target_kalori_harian = targetKaloriBaru;
    }

    const { error } = await supabase
      .from('profile_users')
      .upsert(updateData, {
        onConflict: 'user_id'
      });

    if (error) throw error;

    return targetKaloriBaru;
  },

  async verifyPassword(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    if (error) throw error;
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) throw error;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};