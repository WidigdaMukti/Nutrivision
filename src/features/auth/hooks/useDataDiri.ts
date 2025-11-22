import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { DataDiriForm, DataDiriErrors } from '../types';
import { TUJUAN_MAPPING, AKTIVITAS_MAPPING, ACTIVITY_MULTIPLIERS } from '../types';

export const useDataDiri = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<DataDiriForm>({
    tinggiBadan: "",
    beratBadan: "",
    umur: "",
    jenisKelamin: "",
    tujuan: "",
    aktivitas: "Minim olahraga",
  });
  const [errors, setErrors] = useState<DataDiriErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        const { data: existingProfile } = await supabase
          .from('profile_users')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (!existingProfile) {
          setIsNewUser(true);
        } else {
          setForm({
            tinggiBadan: existingProfile.tinggi_badan?.toString() || "",
            beratBadan: existingProfile.berat_badan?.toString() || "",
            umur: existingProfile.umur?.toString() || "",
            jenisKelamin: existingProfile.jenis_kelamin || "",
            tujuan: Object.keys(TUJUAN_MAPPING).find(
              key => TUJUAN_MAPPING[key] === existingProfile.tujuan_id
            ) || "",
            aktivitas: Object.keys(AKTIVITAS_MAPPING).find(
              key => AKTIVITAS_MAPPING[key] === existingProfile.aktivitas_id
            ) || "Minim olahraga",
          });
        }
      } else {
        toast.error("Silakan login terlebih dahulu");
        navigate("/");
      }
    };

    getCurrentUser();
  }, [navigate]);

  const validate = (): boolean => {
    const newErrors: DataDiriErrors = {};
    
    if (!form.tinggiBadan.trim()) {
      newErrors.tinggiBadan = "Tinggi badan wajib diisi";
    } else if (parseInt(form.tinggiBadan) < 100 || parseInt(form.tinggiBadan) > 250) {
      newErrors.tinggiBadan = "Tinggi badan harus antara 100-250 cm";
    }
    
    if (!form.beratBadan.trim()) {
      newErrors.beratBadan = "Berat badan wajib diisi";
    } else if (parseInt(form.beratBadan) < 30 || parseInt(form.beratBadan) > 200) {
      newErrors.beratBadan = "Berat badan harus antara 30-200 kg";
    }
    
    if (!form.umur.trim()) {
      newErrors.umur = "Usia wajib diisi";
    } else if (parseInt(form.umur) < 10 || parseInt(form.umur) > 100) {
      newErrors.umur = "Usia harus antara 10-100 tahun";
    }
    
    if (!form.jenisKelamin.trim()) {
      newErrors.jenisKelamin = "Jenis kelamin wajib diisi";
    }
    
    if (!form.tujuan.trim()) {
      newErrors.tujuan = "Tujuan penggunaan wajib diisi";
    }

    if (!form.aktivitas.trim()) {
      newErrors.aktivitas = "Level aktivitas wajib diisi";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTargetKalori = (): number => {
    const tinggiBadan = parseFloat(form.tinggiBadan);
    const beratBadan = parseFloat(form.beratBadan);
    const umur = parseInt(form.umur);

    let bmr: number;
    
    if (form.jenisKelamin === 'pria') {
      bmr = (10 * beratBadan) + (6.25 * tinggiBadan) - (5 * umur) + 5;
    } else {
      bmr = (10 * beratBadan) + (6.25 * tinggiBadan) - (5 * umur) - 161;
    }

    const aktivitasId = AKTIVITAS_MAPPING[form.aktivitas];
    const activityMultiplier = ACTIVITY_MULTIPLIERS[aktivitasId] || 1.2;
    
    let targetKalori = bmr * activityMultiplier;

    if (form.tujuan === "Menurunkan berat badan") {
      targetKalori -= 500;
    } else if (form.tujuan === "Menaikkan berat badan") {
      targetKalori += 500;
    }

    return Math.round(targetKalori);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validate()) return;

    if (!userId) {
      toast.error("User tidak ditemukan. Silakan login ulang.");
      return;
    }

    setIsLoading(true);

    try {
      const tinggiBadanNum = parseFloat(form.tinggiBadan);
      const beratBadanNum = parseFloat(form.beratBadan);
      const umurNum = parseInt(form.umur);
      const tujuanId = TUJUAN_MAPPING[form.tujuan];
      const aktivitasId = AKTIVITAS_MAPPING[form.aktivitas];
      const targetKalori = calculateTargetKalori();

      const { error } = await supabase
        .from('profile_users')
        .upsert({
          user_id: userId,
          tinggi_badan: tinggiBadanNum,
          berat_badan: beratBadanNum,
          umur: umurNum,
          jenis_kelamin: form.jenisKelamin,
          tujuan_id: tujuanId,
          aktivitas_id: aktivitasId,
          target_kalori_harian: targetKalori,
          diperbarui_pada: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      if (isNewUser) {
        toast.success("🎉 Pendaftaran berhasil! Selamat datang di NutriVision.");
      } else {
        toast.success("Data diri berhasil diperbarui!");
      }
      
      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (error: any) {
      console.error("Error saving profile data:", error);
      toast.error("Gagal menyimpan data diri. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof DataDiriForm, value: string): void => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleNumericChange = (field: keyof DataDiriForm, value: string): void => {
    const onlyNums = value.replace(/[^0-9]/g, "");
    handleChange(field, onlyNums);
  };

  return {
    form,
    errors,
    isLoading,
    isNewUser,
    handleChange,
    handleNumericChange,
    handleSubmit,
  };
};