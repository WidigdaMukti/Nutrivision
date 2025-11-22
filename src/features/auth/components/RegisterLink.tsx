import { Link } from "react-router-dom";

export const RegisterLink = () => (
  <div className="text-center text-base text-gray-600">
    Belum memiliki Akun?{' '}
    <Link
      to="/register"
      className="text-teal-500 hover:text-teal-600 font-medium"
    >
      Daftar
    </Link>
  </div>
);