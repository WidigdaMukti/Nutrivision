interface DataDiriHeaderProps {
  isNewUser: boolean;
}

export const DataDiriHeader = ({ isNewUser }: DataDiriHeaderProps) => (
  <div className="space-y-2">
    <h1 className="text-3xl font-bold text-gray-900">Data Diri</h1>
    <p className="text-gray-500 text-base">
      {isNewUser 
        ? "Lengkapi data diri untuk menyelesaikan pendaftaran" 
        : "Lengkapi data di bawah ini untuk menyesuaikan rencana nutrisi harianmu"
      }
    </p>
  </div>
);