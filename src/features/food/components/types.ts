export interface FoodItem {
  id: string;
  nama_makanan: string;
  jumlah: number;
  nutrisi: {
    kalori: number;
    karbo: number;
    lemak: number;
    protein: number;
  };
  satuan_makan: {
    nama: string;
  }[];
  dibuat_pada: string;
  urutan: number;
  kategori_id: number;
  user_id: string;
}

export interface FoodGroup {
  items: FoodItem[];
  totalNutrisi: {
    kalori: number;
    karbo: number;
    lemak: number;
    protein: number;
  };
}

export interface DateInfo {
  date: string;
  label: string;
}