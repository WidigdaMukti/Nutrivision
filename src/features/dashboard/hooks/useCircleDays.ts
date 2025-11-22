import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { DayData, MakananByDate } from '../types';

export const useCircleDays = (selectedDate: Date) => {
  const [days, setDays] = useState<DayData[]>([]);
  const [makananByDate, setMakananByDate] = useState<MakananByDate>({});

  const loadMakananForWeek = async (weekStart: Date) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const { data: makanan } = await supabase
        .from('makan_user')
        .select('dibuat_pada')
        .eq('user_id', user.id)
        .gte('dibuat_pada', weekStart.toISOString())
        .lte('dibuat_pada', weekEnd.toISOString());

      const makananMap: MakananByDate = {};
      if (makanan) {
        makanan.forEach(item => {
          const dateKey = new Date(item.dibuat_pada).toDateString();
          makananMap[dateKey] = true;
        });
      }
      
      setMakananByDate(makananMap);
    } catch (error) {
      console.error('Error loading makanan for week:', error);
    }
  };

  const generateDays = (currentSelectedDate: Date, makananData: MakananByDate): DayData[] => {
    const dayLabels = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];
    const dayFullLabels = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startOfWeek = new Date(currentSelectedDate);
    startOfWeek.setHours(0, 0, 0, 0);
    
    const dayOfWeek = currentSelectedDate.getDay();
    const diffToSunday = -dayOfWeek;
    startOfWeek.setDate(currentSelectedDate.getDate() + diffToSunday);

    return dayLabels.map((label, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      date.setHours(0, 0, 0, 0);
      
      const dateKey = date.toDateString();
      
      const dateTimestamp = date.getTime();
      const todayTimestamp = today.getTime();
      
      let status: DayData['status'] = 'future';
      
      if (dateTimestamp === todayTimestamp) {
        status = 'today';
      } else if (dateTimestamp < todayTimestamp) {
        status = makananData[dateKey] ? 'done' : 'missed';
      } else {
        status = 'future';
      }
      
      return {
        label,
        fullLabel: dayFullLabels[index],
        date,
        status,
        isSelected: date.toDateString() === currentSelectedDate.toDateString(),
        dayNumber: date.getDate()
      };
    });
  };

  useEffect(() => {
    const generatedDays = generateDays(selectedDate, makananByDate);
    setDays(generatedDays);
  }, [selectedDate, makananByDate]);

  useEffect(() => {
    const startOfWeek = new Date(selectedDate);
    const dayOfWeek = selectedDate.getDay();
    const diffToSunday = -dayOfWeek;
    startOfWeek.setDate(selectedDate.getDate() + diffToSunday);
    startOfWeek.setHours(0, 0, 0, 0);
    
    loadMakananForWeek(startOfWeek);
  }, [selectedDate]);

  return {
    days,
    loadMakananForWeek
  };
};