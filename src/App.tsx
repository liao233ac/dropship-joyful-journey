import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Landing } from "./pages/Landing";
import { Pricing } from "./pages/Pricing";
import { Features } from "./pages/Features";
import { Integrations } from "./pages/Integrations";
import { IntegrationDetail } from "./pages/IntegrationDetail";
import { API } from "./pages/API";
import { Security } from "./pages/Security";
import { Contact } from "./pages/Contact";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Settings } from "./pages/Settings";
import { About } from "./pages/About";
import { Success } from "./pages/Success";
import { AuthPage } from '@/components/auth/AuthPage';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { DocumentsPage } from './pages/Documents';
import { ChatPage } from './pages/Chat';
import { TeamInvite } from './pages/TeamInvite';

// Layout Components
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const queryClient = new QueryClient();

const AppContent = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={user ? <Dashboard user={user} /> : <Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/team-invite" element={<TeamInvite />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/integration/:name" element={<IntegrationDetail />} />
          <Route path="/api" element={<API />} />
          <Route path="/security" element={<Security />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/auth" element={user ? <Dashboard user={user} /> : <AuthPage />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <AuthPage />} />
          <Route path="/documents" element={user ? <DocumentsPage user={user} /> : <AuthPage />} />
          <Route path="/chat" element={user ? <ChatPage user={user} /> : <AuthPage />} />
          <Route path="/settings" element={user ? <Settings user={user} /> : <AuthPage />} />
          <Route path="/success" element={<Success />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
