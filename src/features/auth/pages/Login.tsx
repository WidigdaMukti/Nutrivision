// src/features/auth/pages/Login.tsx
import { useLogin } from "../hooks/useLogin";
import { LoginHeader } from "../components/LoginHeader";
import { ErrorAlert } from "../components/ErrorAlert";
import { EmailInput } from "../components/EmailInput";
import { PasswordInput } from "../components/PasswordInput";
import { ForgotPasswordLink } from "../components/ForgotPasswordLink";
import { LoginButton } from "../components/LoginButton";
import { RegisterLink } from "../components/RegisterLink";
import { useAuth } from "../AuthContext";

export default function Login() {
  const { isLoading: authLoading } = useAuth();
  const {
    form,
    errors,
    isLoading: loginLoading,
    showPassword,
    handleChange,
    handleLogin,
    handleKeyPress,
    togglePasswordVisibility,
  } = useLogin();

  // Combined loading state
  const isLoading = authLoading || loginLoading;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="space-y-8 w-full max-w-xl">
        <LoginHeader />

        {/* Form */}
        <div className="space-y-4">
          {/* Error Message */}
          {errors.general && <ErrorAlert message={errors.general} />}

          {/* Email Input */}
          <EmailInput
            value={form.email}
            error={errors.email}
            isLoading={isLoading}
            onChange={(value) => handleChange('email', value)}
            onKeyPress={handleKeyPress}
          />

          {/* Password Input */}
          <PasswordInput
            value={form.password}
            error={errors.password}
            isLoading={isLoading}
            showPassword={showPassword}
            onChange={(value) => handleChange('password', value)}
            onKeyPress={handleKeyPress}
            onToggleVisibility={togglePasswordVisibility}
          />

          <ForgotPasswordLink isLoading={isLoading} />

          <LoginButton isLoading={isLoading} onClick={handleLogin} />

          <RegisterLink />
        </div>
      </div>
    </div>
  );
}