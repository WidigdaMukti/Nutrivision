export const getTitleText = (currentSelectedDate: Date): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(currentSelectedDate);
  selected.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hari ini';
  if (diffDays === -1) return 'Kemarin';
  if (diffDays === 1) return 'Besok';
  
  return currentSelectedDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const isThisWeek = (selectedDate: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const startOfThisWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const diffToSunday = -dayOfWeek;
  startOfThisWeek.setDate(today.getDate() + diffToSunday);
  startOfThisWeek.setHours(0, 0, 0, 0);
  
  const endOfThisWeek = new Date(startOfThisWeek);
  endOfThisWeek.setDate(startOfThisWeek.getDate() + 6);
  endOfThisWeek.setHours(23, 59, 59, 999);
  
  return selectedDate >= startOfThisWeek && selectedDate <= endOfThisWeek;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatMonthYear = (date: Date): string => {
  return date.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric'
  });
};

export const getDaysInMonth = (currentMonth: Date): (Date | null)[] => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  const firstDayOfWeek = firstDay.getDay();
  const days = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push(date);
  }

  return days;
};