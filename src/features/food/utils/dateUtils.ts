import type { DateInfo } from '../components/types';

export const getFormattedDate = (dateString: string): DateInfo => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const formattedDate = date.toLocaleDateString('id-ID', options);

  if (date.toDateString() === today.toDateString()) {
    return { date: formattedDate, label: "Hari ini" };
  } else if (date.toDateString() === yesterday.toDateString()) {
    return { date: formattedDate, label: "Kemarin" };
  } else {
    return { date: formattedDate, label: "" };
  }
};