import { AKTIVITAS_MAPPING } from './types';

export const getTujuanLabel = (tujuanValue: string): string => {
  switch (tujuanValue) {
    case "1": return "Menurunkan berat badan";
    case "2": return "Menaikkan berat badan";
    case "3": return "Menjaga berat badan";
    default: return "Pilih Tujuan";
  }
};

export const getAktivitasLabel = (aktivitasValue: string): string => {
  const aktivitasId = parseInt(aktivitasValue);
  return AKTIVITAS_MAPPING[aktivitasId] || "Pilih Level Aktivitas";
};

export const calculateTargetKalori = (
  tinggiBadan: number,
  beratBadan: number,
  umur: number,
  jenisKelamin: string,
  tujuan: string,
  aktivitas: string
): number => {
  let bmr: number;

  if (jenisKelamin === 'pria') {
    bmr = (10 * beratBadan) + (6.25 * tinggiBadan) - (5 * umur) + 5;
  } else {
    bmr = (10 * beratBadan) + (6.25 * tinggiBadan) - (5 * umur) - 161;
  }

  const aktivitasId = parseInt(aktivitas);
  const activityMultipliers: { [key: number]: number } = {
    1: 1.2,
    2: 1.375,
    3: 1.55,
    4: 1.725,
    5: 1.9
  };

  const activityMultiplier = activityMultipliers[aktivitasId] || 1.2;
  let targetKalori = bmr * activityMultiplier;

  if (tujuan === "1") {
    targetKalori -= 500;
  } else if (tujuan === "2") {
    targetKalori += 500;
  }

  return Math.round(targetKalori);
};