
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { ViewModeProvider } from "./contexts/ViewModeContext";
import { MoodThemeProvider } from "./components/ui/mood-theme-provider";
import { NotificationProvider } from "./contexts/NotificationContext";
import { BatchSelectionProvider } from "./contexts/BatchSelectionContext";
import { HologramProvider } from "./contexts/HologramContext";
import AppRoutes from "./routes";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <NotificationProvider>
            <ViewModeProvider>
              <HologramProvider>
                <MoodThemeProvider>
                  <BatchSelectionProvider>
                    <AppRoutes />
                    <Toaster />
                  </BatchSelectionProvider>
                </MoodThemeProvider>
              </HologramProvider>
            </ViewModeProvider>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
