// src/App.tsx
import { AuthProvider } from "@/features/auth/AuthContext";
import AppRoutes from "@/routes/Index";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <div className="mx-auto max-w-[640px] min-h-screen bg-background shadow-lg borde relative">
        <AppRoutes />

        {/* Toaster Global */}
        <Toaster
          position="top-center"
          theme="light"
          richColors
          closeButton
          style={{ zIndex: 99999 }}
        />
      </div>
    </AuthProvider>
  );
}

export default App;