export interface ProfileData {
  nama: string;
  email: string;
  tinggiBadan: string;
  beratBadan: string;
  usia: string;
  jenisKelamin: string;
  tujuan: string;
  aktivitas: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const AKTIVITAS_MAPPING: { [key: number]: string } = {
  1: "Minim olahraga (kantor, jarang olahraga)",
  2: "Olahraga ringan (1-3x/minggu)",
  3: "Olahraga sedang (3-5x/minggu)",
  4: "Olahraga berat (6-7x/minggu)",
  5: "Sangat aktif (atlet, pekerja fisik)"
};