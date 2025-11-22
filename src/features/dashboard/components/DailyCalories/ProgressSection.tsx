import { Progress } from '@/components/ui/progress';

interface ProgressSectionProps {
  progress: number;
  konsumsiKalori: number;
  targetKalori: number;
}

export const ProgressSection = ({ progress, konsumsiKalori, targetKalori }: ProgressSectionProps) => (
  <div className="border border-gray-200 rounded-2xl p-4 mb-4">
    {/* Progress Bar */}
    <div className="flex items-center gap-2 mb-4">
      <Progress
        value={progress}
        className="h-3 bg-gray-100 [&>div]:bg-teal-500 transition-all duration-300"
      />
      <span className="text-reguler font-medium text-gray-700">
        {Math.round(progress)}%
      </span>
    </div>

    {/* Consumption vs Target */}
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center">
        <span className="text-sm text-gray-600 mb-1">Dikonsumsi</span>
        <span className="text-lg font-semibold text-gray-900">
          {konsumsiKalori.toLocaleString()} kkal
        </span>
      </div>

      <div className="bg-gray-50 rounded-xl p-3 flex flex-col items-center justify-center">
        <span className="text-sm text-gray-600 mb-1">Target</span>
        <span className="text-lg font-semibold text-gray-900">
          {targetKalori.toLocaleString()} kkal
        </span>
      </div>
    </div>
  </div>
);