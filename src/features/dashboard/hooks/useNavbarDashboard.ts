import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { NavbarDashboardProps, CalendarState } from '../types';

export const useNavbarDashboard = ({ selectedDate }: NavbarDashboardProps) => {
  const [userInitials, setUserInitials] = useState('NV');
  const [userName, setUserName] = useState('');
  const [calendarState, setCalendarState] = useState<CalendarState>({
    showCalendar: false,
    tempSelectedDate: new Date(),
    currentMonth: new Date()
  });

  const getInitials = (name: string): string => {
    if (!name) return 'NV';
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    } else {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
  };

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        setUserName(name);
        const initials = getInitials(name);
        setUserInitials(initials);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const openCalendar = () => {
    setCalendarState({
      showCalendar: true,
      tempSelectedDate: selectedDate,
      currentMonth: selectedDate
    });
  };

  const closeCalendar = () => {
    setCalendarState(prev => ({
      ...prev,
      showCalendar: false
    }));
  };

  const setTempSelectedDate = (date: Date) => {
    setCalendarState(prev => ({
      ...prev,
      tempSelectedDate: date
    }));
  };

  const setCurrentMonth = (date: Date) => {
    setCalendarState(prev => ({
      ...prev,
      currentMonth: date
    }));
  };

  const handlePreviousMonth = () => {
    const newMonth = new Date(calendarState.currentMonth);
    newMonth.setMonth(calendarState.currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(calendarState.currentMonth);
    newMonth.setMonth(calendarState.currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    setCalendarState(prev => ({
      ...prev,
      tempSelectedDate: selectedDate,
      currentMonth: selectedDate
    }));
  }, [selectedDate]);

  return {
    userInitials,
    userName,
    calendarState,
    openCalendar,
    closeCalendar,
    setTempSelectedDate,
    setCurrentMonth,
    handlePreviousMonth,
    handleNextMonth
  };
};