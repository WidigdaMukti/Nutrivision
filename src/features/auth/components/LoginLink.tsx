import { Link } from "react-router-dom";

export const LoginLink = () => (
  <div className="text-center text-base text-gray-600">
    Sudah memiliki akun?{" "}
    <Link
      to="/"
      className="text-teal-500 hover:text-teal-600 font-medium"
    >
      Masuk
    </Link>
  </div>
);