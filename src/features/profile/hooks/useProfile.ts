import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { ProfileData } from '../types';

// ✅ SIMPLE CACHE - tambah di atas component
let profileCache: { userId: string; data: ProfileData; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

export const useProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<ProfileData>({
    nama: "",
    email: "",
    tinggiBadan: "",
    beratBadan: "",
    usia: "",
    jenisKelamin: "",
    tujuan: "",
    aktivitas: "",
  });
  const [originalData, setOriginalData] = useState<ProfileData>({ ...data });
  const [changed, setChanged] = useState<Record<string, boolean>>({});

  const loadUserData = async () => {
    try {
      setIsLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Silakan login terlebih dahulu");
        navigate("/");
        return;
      }

      setUserId(user.id);

      // ✅ CEK CACHE DULU - TAMBAH 4 BARIS INI SAJA
      const isCacheValid = profileCache && 
                          profileCache.userId === user.id && 
                          (Date.now() - profileCache.timestamp) < CACHE_DURATION;

      if (isCacheValid && profileCache) {
        console.log("✅ Using cached profile data");
        setData(profileCache.data);
        setOriginalData(profileCache.data);
        setIsLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profile_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log("🔍 DEBUG PROFILE DATA:", profileData);

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error loading profile:", profileError);
        toast.error("Gagal memuat data profil");
        return;
      }

      const userMetadata = user.user_metadata;

      const userData: ProfileData = {
        nama: userMetadata?.full_name || "",
        email: user.email || "",
        tinggiBadan: profileData?.tinggi_badan?.toString() || "",
        beratBadan: profileData?.berat_badan?.toString() || "",
        usia: profileData?.umur?.toString() || "",
        jenisKelamin: profileData?.jenis_kelamin || "",
        tujuan: profileData?.tujuan_id?.toString() || "",
        aktivitas: profileData?.aktivitas_id?.toString() || "",
      };

      console.log("🔍 FINAL USER DATA:", userData);

      // ✅ SIMPAN KE CACHE - 1 BARIS INI SAJA
      profileCache = { userId: user.id, data: userData, timestamp: Date.now() };

      setData(userData);
      setOriginalData(userData);

    } catch (error) {
      console.error("Error loading user data:", error);
      toast.error("Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // ✅ FUNCTION CLEAR CACHE - TAMBAH 1 FUNCTION INI SAJA
  const clearCache = () => {
    profileCache = null;
    console.log("🗑️ Profile cache cleared");
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setChanged((prev) => ({ ...prev, [field]: true }));
  };

  const handleNumericChange = (field: keyof ProfileData, value: string) => {
    handleChange(field, value.replace(/[^0-9]/g, ""));
  };

  const hasChanges = (section: string) => {
    const sectionFields: Record<string, (keyof ProfileData)[]> = {
      nama: ['nama'],
      email: ['email'],
      dataDiri: ['tinggiBadan', 'beratBadan', 'usia', 'jenisKelamin', 'tujuan', 'aktivitas'],
      katasandi: []
    };

    return sectionFields[section]?.some(field => changed[field]) || false;
  };

  return {
    isLoading,
    isSaving,
    userId,
    data,
    originalData,
    changed,
    setIsSaving,
    setChanged,
    setOriginalData,
    handleChange,
    handleNumericChange,
    hasChanges,
    loadUserData,
    clearCache // ✅ TAMBAH INI SAJA DI RETURN
  };
};