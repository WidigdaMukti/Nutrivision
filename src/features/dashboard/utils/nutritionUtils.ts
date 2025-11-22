export const getTujuanBadgeColor = (tujuan: string): string => {
  switch (tujuan) {
    case 'Menurunkan berat badan':
      return 'bg-red-100 text-red-700';
    case 'Menaikkan berat badan':
      return 'bg-blue-100 text-blue-700';
    case 'Menjaga berat badan':
      return 'bg-teal-100 text-teal-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const formatKalori = (kalori: number): string => {
  return kalori.toLocaleString() + ' kkal';
};