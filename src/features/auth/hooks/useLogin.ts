// hooks/useLogin.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { LoginForm, LoginErrors } from '../types';

export const useLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check existing session on component mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async (): Promise<void> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        return;
      }

      if (session?.user) {
        console.log('User already logged in, redirecting to dashboard...');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const validate = (): boolean => {
    const newErrors: LoginErrors = {};
    
    if (!form.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!form.password.trim()) {
      newErrors.password = 'Katasandi wajib diisi';
    } else if (form.password.length < 6) {
      newErrors.password = 'Katasandi minimal 6 karakter';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'Email atau katasandi salah' });
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ general: 'Email belum dikonfirmasi. Silakan cek email Anda.' });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      if (data.user && data.session) {
        console.log('Login berhasil:', data.user);
        
        // Session akan otomatis tersimpan di Supabase
        // Supabase handle persistence secara otomatis
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof LoginForm, value: string): void => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '', general: '' }));
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(prev => !prev);
  };

  return {
    form,
    errors,
    isLoading,
    showPassword,
    handleChange,
    handleLogin,
    handleKeyPress,
    togglePasswordVisibility,
  };
};