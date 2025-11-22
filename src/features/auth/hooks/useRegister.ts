import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { RegisterForm, RegisterErrors } from '../types';

export const useRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({ 
    nama: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: RegisterErrors = {};
    let valid = true;

    if (!form.nama.trim()) {
      newErrors.nama = "Nama tidak boleh kosong";
      valid = false;
    }
    if (!form.email.trim()) {
      newErrors.email = "Email tidak boleh kosong";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
      valid = false;
    }
    if (!form.password.trim()) {
      newErrors.password = "Katasandi tidak boleh kosong";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Minimal 6 karakter";
      valid = false;
    }
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Ulangi katasandi";
      valid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Katasandi tidak sama";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async (): Promise<void> => {
    if (!validate()) return;

    setIsLoading(true);
    setErrors({ general: '' });

    try {
      console.log("📝 Register attempt:", { email: form.email.trim(), nama: form.nama });

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.nama.trim(),
          }
        }
      });

      console.log("📨 Auth response:", { authData, authError });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setErrors({ general: "Email sudah terdaftar. Silakan login." });
        } else {
          setErrors({ general: `Error: ${authError.message}` });
        }
        return;
      }

      if (authData.user) {
        console.log("✅ User registered:", authData.user.id);
        
        if (authData.user.identities && authData.user.identities.length === 0) {
          setErrors({ general: "Email sudah terdaftar atau butuh konfirmasi." });
          return;
        }

        if (!authData.session) {
          toast.info("Silakan cek email Anda untuk verifikasi sebelum login.");
          navigate("/");
          return;
        }

        console.log("✅ User auto-logged in, redirecting to data-diri");
        navigate("/data-diri");
      }

    } catch (error: any) {
      console.error("💥 Register exception:", error);
      setErrors({ general: "Terjadi kesalahan sistem. Silakan coba lagi." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof RegisterForm, value: string): void => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '', general: '' }));
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword(prev => !prev);
  };

  return {
    form,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,
    handleChange,
    handleRegister,
    handleKeyPress,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  };
};