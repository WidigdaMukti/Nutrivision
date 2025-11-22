import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, LogOut, User, Mail, VenusAndMars } from "lucide-react";

import { useProfile } from './hooks/useProfile';
import { profileService } from './services/profileService';
import { getTujuanLabel, getAktivitasLabel } from './utils';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SaveButton } from './components/SaveButton';
import { supabase } from "@/lib/supabase";

export default function Profil() {
  const navigate = useNavigate();
  const {
    isLoading,
    isSaving,
    userId,
    data,
    changed,
    setIsSaving,
    setChanged,
    setOriginalData,
    handleChange,
    handleNumericChange,
    hasChanges,
    clearCache
  } = useProfile();

  console.log('🎯 Profile Component:', {
    isLoading,
    isSaving,
    hasUserId: !!userId,
    data
  });

  if (isLoading && !data.nama) {
    console.log('🔄 Profile: Showing loading spinner');
    return <LoadingSpinner />;
  }

  console.log('✅ Profile: Rendering content');

  const handleSaveNama = async () => {
    if (!changed.nama) return; // ✅ HAPUS userId check

    setIsSaving(true);
    try {
      await profileService.updateName(data.nama); // ✅ HAPUS userId parameter
      clearCache();
      setOriginalData(prev => ({ ...prev, nama: data.nama }));
      setChanged(prev => ({ ...prev, nama: false }));
      toast.success("Nama berhasil diperbarui!");

    } catch (error: any) {
      console.error("Error updating name:", error);
      toast.error("Gagal memperbarui nama");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!userId || !changed.email) return;

    setIsSaving(true);
    try {
      await profileService.updateEmail(data.email);
      toast.success("Email berhasil diperbarui! Silakan verifikasi email baru Anda.");
      setChanged(prev => ({ ...prev, email: false }));
      clearCache();

    } catch (error: any) {
      console.error("Error updating email:", error);
      toast.error("Gagal memperbarui email");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDataDiri = async () => {
    if (!userId || !hasChanges('dataDiri')) return;

    setIsSaving(true);
    try {
      const targetKaloriBaru = await profileService.updateProfileData(userId, data, changed);

      setOriginalData(prev => ({ ...prev, ...data }));
      // ✅ PERBAIKI SETCHANGED - HARUS INCLUDE SEMUA FIELD
      setChanged(prev => ({
        ...prev, // ✅ PERTAHANKAN NAMA & EMAIL STATE
        tinggiBadan: false,
        beratBadan: false,
        usia: false,
        jenisKelamin: false,
        tujuan: false,
        aktivitas: false
      }));

      clearCache();

      if (targetKaloriBaru !== null) {
        toast.success(`Data diri berhasil diperbarui! Target kalori baru: ${targetKaloriBaru} kkal/hari`);
      } else {
        toast.success("Data diri berhasil diperbarui!");
      }

    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Gagal memperbarui data diri");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (!currentPassword) {
      toast.error("Harap masukkan katasandi sekarang");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Katasandi baru tidak cocok");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Katasandi minimal 6 karakter");
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        toast.error("Sesi telah berakhir, silakan login ulang");
        return;
      }

      await profileService.verifyPassword(user.email, currentPassword);
      await profileService.updatePassword(newPassword);

      toast.success("Katasandi berhasil diperbarui!");

      const passwordInputs = document.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>;
      passwordInputs.forEach(input => input.value = '');

    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error("Gagal memperbarui katasandi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error logging out:", error);
        toast.error("Gagal logout");
        return;
      }

      toast.success("Berhasil logout!");
      setTimeout(() => navigate("/"), 1000);
    } catch (error: any) {
      console.error("Error logging out:", error);
      toast.error("Gagal logout");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
          <h1 className="text-lg font-bold text-gray-900">Profil</h1>
        </button>
        <button onClick={handleLogout} disabled={isSaving}>
          <LogOut className="w-6 h-6 text-red-500" />
        </button>
      </div>

      {/* Body */}
      <div className="px-4 py-5 space-y-5">
        {/* Nama Section */}
        <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Nama</h2>
          </div>
          <Input
            placeholder="Nama Lengkap"
            value={data.nama}
            onChange={(e) => handleChange("nama", e.target.value)}
            style={{ height: "48px", minHeight: "48px" }}
            className="text-base rounded-xl border-gray-300 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-teal-500"
            disabled={isSaving}
          />
          <SaveButton
            isSaving={isSaving}
            hasChanges={changed.nama}
            onClick={handleSaveNama}
          />
        </div>

        {/* Email Section */}
        <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Email</h2>
          </div>
          <Input
            placeholder="Email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            style={{ height: "48px", minHeight: "48px" }}
            className="text-base rounded-xl border-gray-300 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-teal-500"
            disabled={isSaving}
          />
          <SaveButton
            isSaving={isSaving}
            hasChanges={changed.email}
            onClick={handleSaveEmail}
          />
        </div>

        {/* Data Diri Section */}
        <DataDiriSection
          data={data}
          isSaving={isSaving}
          hasChanges={hasChanges('dataDiri')}
          onNumericChange={handleNumericChange}
          onSelectChange={handleChange}
          onSave={handleSaveDataDiri}
        />

        {/* Katasandi Section */}
        <KatasandiSection
          isSaving={isSaving}
          onSave={handleSavePassword}
        />
      </div>
    </div>
  );
}

// Sub-components untuk bagian-bagian yang lebih kecil
const DataDiriSection = ({
  data,
  isSaving,
  hasChanges,
  onNumericChange,
  onSelectChange,
  onSave
}: any) => (
  <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
    <div className="flex items-center gap-2">
      <VenusAndMars className="w-5 h-5 text-gray-600" />
      <h2 className="text-lg font-semibold text-gray-900">Data Diri</h2>
    </div>

    <div className="space-y-3">
      <Input
        placeholder="Tinggi Badan (cm)"
        inputMode="numeric"
        value={data.tinggiBadan}
        onChange={(e) => onNumericChange("tinggiBadan", e.target.value)}
        style={{ height: "48px", minHeight: "48px" }}
        className="text-base rounded-xl border-gray-300 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-teal-500"
        disabled={isSaving}
      />

      <Input
        placeholder="Berat Badan (kg)"
        inputMode="numeric"
        value={data.beratBadan}
        onChange={(e) => onNumericChange("beratBadan", e.target.value)}
        style={{ height: "48px", minHeight: "48px" }}
        className="text-base rounded-xl border-gray-300 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-teal-500"
        disabled={isSaving}
      />

      <Input
        placeholder="Usia"
        inputMode="numeric"
        value={data.usia}
        onChange={(e) => onNumericChange("usia", e.target.value)}
        style={{ height: "48px", minHeight: "48px" }}
        className="text-base rounded-xl border-gray-300 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-teal-500"
        disabled={isSaving}
      />

      <Select
        value={data.jenisKelamin}
        onValueChange={(v) => onSelectChange("jenisKelamin", v)}
        disabled={isSaving}
      >
        <SelectTrigger className="w-full rounded-xl border bg-white px-3 text-base focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none border-gray-300 h-12">
          <SelectValue placeholder="Jenis Kelamin" />
        </SelectTrigger>
        <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-md text-base">
          <SelectItem value="pria" className="py-3 text-base">Pria</SelectItem>
          <SelectItem value="wanita" className="py-3 text-base">Wanita</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={data.tujuan}
        onValueChange={(v) => onSelectChange("tujuan", v)}
        disabled={isSaving}
      >
        <SelectTrigger className="w-full rounded-xl border bg-white px-3 text-base focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none border-gray-300 h-12">
          <SelectValue placeholder={getTujuanLabel(data.tujuan)} />
        </SelectTrigger>
        <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-md text-base">
          <SelectItem value="1" className="py-3 text-base">Menurunkan berat badan</SelectItem>
          <SelectItem value="2" className="py-3 text-base">Menaikkan berat badan</SelectItem>
          <SelectItem value="3" className="py-3 text-base">Menjaga berat badan</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={data.aktivitas}
        onValueChange={(v) => onSelectChange("aktivitas", v)}
        disabled={isSaving}
      >
        <SelectTrigger className="w-full rounded-xl border bg-white px-3 text-base focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-none border-gray-300 h-12">
          <SelectValue placeholder={getAktivitasLabel(data.aktivitas)} />
        </SelectTrigger>
        <SelectContent className="bg-white rounded-xl border border-gray-200 shadow-md text-base">
          <SelectItem value="1" className="py-3 text-base">Minim olahraga (kantor, jarang olahraga)</SelectItem>
          <SelectItem value="2" className="py-3 text-base">Olahraga ringan (1-3x/minggu)</SelectItem>
          <SelectItem value="3" className="py-3 text-base">Olahraga sedang (3-5x/minggu)</SelectItem>
          <SelectItem value="4" className="py-3 text-base">Olahraga berat (6-7x/minggu)</SelectItem>
          <SelectItem value="5" className="py-3 text-base">Sangat aktif (atlet, pekerja fisik)</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <SaveButton
      isSaving={isSaving}
      hasChanges={hasChanges}
      onClick={onSave}
      label="Simpan Data Diri"
    />
  </div>
);

const KatasandiSection = ({ isSaving, onSave }: any) => (
  <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
    <h2 className="text-lg font-semibold text-gray-900">Katasandi</h2>

    <Input
      placeholder="Katasandi Sekarang"
      type="password"
      style={{ height: "48px", minHeight: "48px" }}
      className="text-base rounded-xl border-gray-300 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-teal-500"
      disabled={isSaving}
    />
    <Input
      placeholder="Katasandi Baru"
      type="password"
      style={{ height: "48px", minHeight: "48px" }}
      className="text-base rounded-xl border-gray-300 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-teal-500"
      disabled={isSaving}
    />
    <Input
      placeholder="Ulangi Katasandi Baru"
      type="password"
      style={{ height: "48px", minHeight: "48px" }}
      className="text-base rounded-xl border-gray-300 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-teal-500"
      disabled={isSaving}
    />

    <Button
      variant="outline"
      onClick={() => {
        const currentPassword = (document.querySelector('input[placeholder="Katasandi Sekarang"]') as HTMLInputElement)?.value;
        const newPassword = (document.querySelector('input[placeholder="Katasandi Baru"]') as HTMLInputElement)?.value;
        const confirmPassword = (document.querySelector('input[placeholder="Ulangi Katasandi Baru"]') as HTMLInputElement)?.value;
        onSave(currentPassword, newPassword, confirmPassword);
      }}
      disabled={isSaving}
      className="w-full h-12 text-base font-semibold rounded-xl border-teal-500 text-teal-500 hover:bg-teal-50 disabled:opacity-50"
    >
      {isSaving ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Menyimpan...
        </div>
      ) : (
        "Simpan Katasandi Baru"
      )}
    </Button>
  </div>
);