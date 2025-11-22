export interface DayData {
  label: string;
  fullLabel: string;
  date: Date;
  status: 'done' | 'today' | 'missed' | 'future';
  isSelected: boolean;
  dayNumber: number;
}

export interface CircleDaysProps {
  onDateChange: (date: Date) => void;
  selectedDate: Date;
}

export interface MakananByDate {
  [key: string]: boolean;
}

export interface DailyCaloriesProps {
  userData: any;
  dailySummary: any;
  selectedDate: Date;
}

export interface NutritionData {
  karbo: number;
  lemak: number;
  protein: number;
  kalori: number;
}

export interface UserTarget {
  targetKalori: number;
  tujuan: string;
}

// ... existing types ...

export interface MealSectionProps {
  selectedDate: Date;
}

export interface GroupedFoods {
  [urutan: number]: {
    items: any[];
    totalNutrisi: NutritionData;
  };
}

export interface MakananByKategori {
  [key: number]: GroupedFoods;
}

export interface KategoriMakanan {
  id: number;
  nama: string;
}

export interface NavbarDashboardProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export interface CalendarState {
  showCalendar: boolean;
  tempSelectedDate: Date;
  currentMonth: Date;
}

export interface UserData {
  id?: string;
  user_id?: string;
  tinggi_badan?: number;
  berat_badan?: number;
  umur?: number;
  jenis_kelamin?: string;
  tujuan_id?: number;
  aktivitas_id?: number;
  target_kalori_harian?: number;
  tujuan: string;
  target_kalori: number;
  diperbarui_pada?: string;
}

export interface DailySummary {
  totalKalori: number;
  totalKarbo: number;
  totalLemak: number;
  totalProtein: number;
}