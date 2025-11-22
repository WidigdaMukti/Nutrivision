import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CalendarDays } from 'lucide-react';

interface MainNavbarProps {
  userInitials: string;
  userName: string;
  onCalendarOpen: () => void;
}

export const MainNavbar = ({ userInitials, userName, onCalendarOpen }: MainNavbarProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Avatar kiri - klik ke /profile */}
      <button
        onClick={() => navigate('/profile')}
        className="focus:outline-none"
        title={userName ? `Profil ${userName}` : 'Profil'}
      >
        <Avatar className="h-10 w-10 cursor-pointer transition-transform hover:scale-105">
          <AvatarFallback className="bg-gray-100 text-gray-800 font-semibold">
            {userInitials}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* Tombol kalender kanan */}
      <button
        onClick={onCalendarOpen}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        <CalendarDays className="h-5 w-5 text-gray-700" />
      </button>
    </div>
  );
};