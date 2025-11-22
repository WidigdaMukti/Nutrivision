export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface RegisterForm {
  nama: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterErrors {
  nama?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface DataDiriForm {
  tinggiBadan: string;
  beratBadan: string;
  umur: string;
  jenisKelamin: string;
  tujuan: string;
  aktivitas: string;
}

export interface DataDiriErrors {
  tinggiBadan?: string;
  beratBadan?: string;
  umur?: string;
  jenisKelamin?: string;
  tujuan?: string;
  aktivitas?: string;
}

// Constants
export const TUJUAN_MAPPING: { [key: string]: number } = {
  "Menurunkan berat badan": 1,
  "Menaikkan berat badan": 2,
  "Menjaga berat badan": 3
};

export const AKTIVITAS_MAPPING: { [key: string]: number } = {
  "Minim olahraga (kantor, jarang olahraga)": 1,
  "Olahraga ringan (1-3x/minggu)": 2,
  "Olahraga sedang (3-5x/minggu)": 3,
  "Olahraga berat (6-7x/minggu)": 4,
  "Sangat aktif (atlet, pekerja fisik)": 5
};

export const ACTIVITY_MULTIPLIERS: { [key: number]: number } = {
  1: 1.2,    // Minim olahraga
  2: 1.375,  // Olahraga ringan
  3: 1.55,   // Olahraga sedang
  4: 1.725,  // Olahraga berat
  5: 1.9     // Sangat aktif
};