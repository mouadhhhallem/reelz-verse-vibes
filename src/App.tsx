
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ViewModeProvider } from "./contexts/ViewModeContext";
import { BatchSelectionProvider } from "./contexts/BatchSelectionContext";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import ReelDetail from "./pages/ReelDetail";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Legal from "./pages/Legal";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ViewModeProvider>
        <BatchSelectionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="search" element={<Search />} />
                  <Route path="reel/:id" element={<ReelDetail />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="login" element={<Login />} />
                </Route>
                <Route path="legal" element={<Legal />} />
                <Route path="legal/:section" element={<Legal />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </BatchSelectionProvider>
      </ViewModeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
