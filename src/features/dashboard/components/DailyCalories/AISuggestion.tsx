import { useState, useCallback } from 'react';
import { Sparkles, X, Lightbulb } from 'lucide-react'; 
import { toast } from 'sonner';
import { 
    getMenuSuggestion, 
    getSavedMenuSuggestion, 
    saveOrUpdateMenuSuggestion,
    formatJsonToDisplayString
} from '@/lib/suggestion-client'; // Mengganti '../api/geminiSugestion' menjadi './api/geminiSugestion'

interface AISuggestionProps {
    userData: any; // Harus mengandung userData.user_id
    dailySummary: any;
    selectedDate: Date;
}

// Utility function untuk format tanggal ke format ISO YYYY-MM-DD
const formatDateToISO = (date: Date): string => date.toISOString().split('T')[0];


export const AISuggestion = ({ userData, dailySummary, selectedDate }: AISuggestionProps) => {
    const userId = userData?.user_id || userData?.id; 
    
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false); 
    const [suggestion, setSuggestion] = useState(''); 
    const [isRegenerating, setIsRegenerating] = useState(false); 

    const getAISuggestion = useCallback(async (forceApiCall = false) => {
        setIsLoading(true);
        setSuggestion('');
        setIsRegenerating(true);

        if (!userId) {
            toast.error("User ID tidak ditemukan. Harap login.");
            setIsLoading(false);
            setIsRegenerating(false);
            return;
        }

        // 1. Coba ambil dari Database (Cache Server Terakhir)
        if (!forceApiCall) {
            const serverSuggestionJsonString = await getSavedMenuSuggestion(userId);

            if (serverSuggestionJsonString) {
                console.log("✅ Loading menu suggestion from server cache.");
                
                const formattedSuggestion = formatJsonToDisplayString(serverSuggestionJsonString);
                
                setSuggestion(formattedSuggestion);
                setShowModal(true); 
                setIsLoading(false);
                setIsRegenerating(false);
                return;
            }
        }
        
        // 2. Panggil API Gemini (Jika forceApiCall=true atau tidak ada di DB)
        try {
            const tujuan = userData?.tujuan || 'Menjaga berat badan';
            const targetKalori = userData?.target_kalori_harian || 2000; 
            const todayDateString = formatDateToISO(selectedDate); 

            console.log("🎯 Calling Gemini API for suggestion...");

            const aiSuggestionJsonString = await getMenuSuggestion({
                tujuan,
                sisaKalori: targetKalori, 
                makananHariIni: dailySummary,
                selectedDate: selectedDate.toLocaleDateString('id-ID')
            });

            // Simpan JSON mentah ke Database
            await saveOrUpdateMenuSuggestion(userId, todayDateString, aiSuggestionJsonString); 
            
            // Format untuk tampilan UI
            const formattedSuggestion = formatJsonToDisplayString(aiSuggestionJsonString);
            
            setSuggestion(formattedSuggestion);
            setShowModal(true); 

        } catch (error: any) {
            console.error('❌ Error getting AI suggestion:', error);
            const errorMessage = error.message.includes('TIMEOUT') 
                ? 'Permintaan ke AI gagal: Timeout.' 
                : (error.message || 'Layanan AI sedang tidak tersedia.');
            
            toast.error(errorMessage);
            setShowModal(false); 
            
        } finally {
            setIsLoading(false);
            setIsRegenerating(false);
        }
    }, [userData, dailySummary, selectedDate, userId]);

    // Handle klik tombol utama (cek cache dulu)
    const handleButtonClick = () => {
        getAISuggestion(false);
    };

    // Handle Regenerate (paksa panggil API)
    const handleRegenerate = () => {
        getAISuggestion(true);
    };

    /* --- Fungsi Formatting UI --- */
    const formatSuggestion = (text: string) => {
        if (text.trim().startsWith('{')) {
            return <div className="text-red-600 font-medium">Format saran tidak sesuai atau layanan AI mengalami kesalahan respons.</div>;
        }

        return text.split('\n').map((line, lineIndex) => {
            
            // Menghilangkan baris yang tidak perlu (Tujuan dan Total Kalori Perkiraan)
            if (line.includes('Tujuan:')) {
                return null;
            }
            if (line.startsWith('Total Kalori Perkiraan:')) {
                return null;
            }
            
            if (line.includes('SARAN:')) {
                return <div key={lineIndex} className="font-bold text-gray-900 mt-2 mb-1">Menu Hari Ini:</div>;
            }
            if (line.startsWith('•')) {
                return (
                    <div key={lineIndex} className="flex items-start text-gray-700 ml-2 mb-1">
                        <span className="mr-2 text-teal-600">•</span>
                        <span>{line.substring(1).trim()}</span>
                    </div>
                );
            }
            
            // Logika untuk Tips (Tampilan Khusus dengan Ikon)
            if (line.startsWith('Tips:')) {
                const tipsText = line.substring(5).trim(); // Ambil teks setelah "Tips:"
                return (
                    <div key={lineIndex} className="bg-teal-50 border border-teal-300 rounded-xl p-3 mt-4">
                        <div className="flex items-center text-teal-800 font-semibold mb-1">
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Tips
                        </div>
                        <p className="text-teal-700 text-sm leading-relaxed">{tipsText}</p>
                    </div>
                );
            }
            
            if (line.trim() === '') {
                return <div key={lineIndex} className="h-2"></div>;
            }
            return <div key={lineIndex} className="text-gray-600">{line}</div>;
        });
    };
    /* ------------------------------------ */
    
    // Komponen Skeleton Loading
    const SkeletonLoading = () => (
        <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
    );

    return (
        <>
            {/* Tombol Saran Menu */}
            <div
                onClick={handleButtonClick}
                className="flex items-center justify-between w-full bg-teal-50 border border-teal-200 rounded-2xl px-4 py-3 mb-4 cursor-pointer hover:bg-teal-100 transition-colors active:scale-95"
            >
                <span className="text-gray-800 font-medium">
                    Saran menu hari ini
                </span>

                <div className={`w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center transition-all ${isLoading ? 'animate-pulse' : ''}`}>
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4 text-white" />
                    )}
                </div>
            </div>

            {/* Modal - HANYA tampil jika showModal true */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in-0">
                    <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-lg animate-in slide-in-from-bottom-10 duration-300">

                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Saran Menu AI</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 min-h-[180px] max-h-[60vh] overflow-y-auto shadow-inner">
                            {isRegenerating ? (
                                <SkeletonLoading />
                            ) : suggestion ? (
                                <div className="text-gray-700">
                                    {formatSuggestion(suggestion)}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-10">
                                    Saran menu tidak tersedia saat ini.
                                </div>
                            )}
                        </div>

                        {/* Button Regenerate */}
                        <button
                            onClick={handleRegenerate}
                            disabled={isRegenerating}
                            className="w-full mt-6 bg-teal-500 text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-medium hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isRegenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    Ganti Menu
                                    <Sparkles className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};