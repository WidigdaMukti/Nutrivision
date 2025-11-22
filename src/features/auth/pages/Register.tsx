import { useRegister } from "../hooks/useRegister";
import { RegisterHeader } from "../components/RegisterHeader";
import { ErrorAlert } from "../components/ErrorAlert";
import { NameInput } from "../components/NameInput";
import { EmailInput } from "../components/EmailInput";
import { PasswordInput } from "../components/PasswordInput";
import { ConfirmPasswordInput } from "../components/ConfirmPasswordInput";
import { RegisterButton } from "../components/RegisterButton";
import { LoginLink } from "../components/LoginLink";

export default function Register() {
  const {
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
  } = useRegister();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="space-y-8 w-full max-w-xl">
        <RegisterHeader />

        {/* Form */}
        <div className="space-y-4">
          {/* Error Message */}
          {errors.general && <ErrorAlert message={errors.general} />}

          {/* Nama Input */}
          <NameInput
            value={form.nama}
            error={errors.nama}
            isLoading={isLoading}
            onChange={(value) => handleChange('nama', value)}
            onKeyPress={handleKeyPress}
          />

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

          {/* Confirm Password Input */}
          <ConfirmPasswordInput
            value={form.confirmPassword}
            error={errors.confirmPassword}
            isLoading={isLoading}
            showPassword={showConfirmPassword}
            onChange={(value) => handleChange('confirmPassword', value)}
            onKeyPress={handleKeyPress}
            onToggleVisibility={toggleConfirmPasswordVisibility}
          />

          <RegisterButton isLoading={isLoading} onClick={handleRegister} />

          <LoginLink />
        </div>
      </div>
    </div>
  );
}