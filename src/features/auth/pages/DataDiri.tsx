import { useDataDiri } from "../hooks/useDataDiri";
import { DataDiriHeader } from "../components/DataDiriHeader";
import { NumericInput } from "../components/NumericInput";
import { GenderSelect } from "../components/GenderSelect";
import { TujuanSelect } from "../components/TujuanSelect";
import { AktivitasSelect } from "../components/AktivitasSelect";
import { DataDiriButton } from "../components/DataDiriButton";

export default function DataDiri() {
  const {
    form,
    errors,
    isLoading,
    isNewUser,
    handleChange,
    handleNumericChange,
    handleSubmit,
  } = useDataDiri();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="space-y-8 w-full max-w-xl">
        <DataDiriHeader isNewUser={isNewUser} />

        {/* Form */}
        <div className="space-y-4">
          {/* Tinggi Badan */}
          <NumericInput
            label="Tinggi Badan"
            placeholder="Tinggi Badan (cm)"
            value={form.tinggiBadan}
            error={errors.tinggiBadan}
            isLoading={isLoading}
            onChange={(value) => handleNumericChange("tinggiBadan", value)}
          />

          {/* Berat Badan */}
          <NumericInput
            label="Berat Badan"
            placeholder="Berat Badan (kg)"
            value={form.beratBadan}
            error={errors.beratBadan}
            isLoading={isLoading}
            onChange={(value) => handleNumericChange("beratBadan", value)}
          />

          {/* Usia & Jenis Kelamin */}
          <div className="grid grid-cols-2 gap-3">
            <NumericInput
              label="Usia"
              placeholder="Usia"
              value={form.umur}
              error={errors.umur}
              isLoading={isLoading}
              onChange={(value) => handleNumericChange("umur", value)}
            />

            <GenderSelect
              value={form.jenisKelamin}
              error={errors.jenisKelamin}
              isLoading={isLoading}
              onChange={(value) => handleChange("jenisKelamin", value)}
            />
          </div>

          {/* Tujuan Penggunaan */}
          <TujuanSelect
            value={form.tujuan}
            error={errors.tujuan}
            isLoading={isLoading}
            onChange={(value) => handleChange("tujuan", value)}
          />

          {/* Level Aktivitas */}
          <AktivitasSelect
            value={form.aktivitas}
            error={errors.aktivitas}
            isLoading={isLoading}
            onChange={(value) => handleChange("aktivitas", value)}
          />

          <DataDiriButton
            isLoading={isLoading}
            isNewUser={isNewUser}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}