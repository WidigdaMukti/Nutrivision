import { useNavbarDashboard } from '../hooks/useNavbarDashboard';
import { MainNavbar } from './NavbarDashboard/MainNavbar';
import { CalendarModal } from './NavbarDashboard/CalendarModal';
import type { NavbarDashboardProps } from '../types';

export default function NavbarDashboard({ onDateSelect, selectedDate }: NavbarDashboardProps) {
  const {
    userInitials,
    userName,
    calendarState,
    openCalendar,
    closeCalendar,
    setTempSelectedDate,
    handlePreviousMonth,
    handleNextMonth
  } = useNavbarDashboard({ onDateSelect, selectedDate });

  const handleConfirm = () => {
    onDateSelect(calendarState.tempSelectedDate);
    closeCalendar();
  };

  const handleToday = () => {
    const today = new Date();
    setTempSelectedDate(today);
    onDateSelect(today);
    closeCalendar();
  };

  const handleCancel = () => {
    setTempSelectedDate(selectedDate);
    closeCalendar();
  };

  return (
    <>
      <MainNavbar
        userInitials={userInitials}
        userName={userName}
        onCalendarOpen={openCalendar}
      />

      {calendarState.showCalendar && (
        <CalendarModal
          calendarState={calendarState}
          onCancel={handleCancel}
          onToday={handleToday}
          onDateSelect={setTempSelectedDate}
          onConfirm={handleConfirm}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
        />
      )}
    </>
  );
}