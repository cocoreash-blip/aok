import { useState, useEffect } from "react";
import { ContentProvider } from "./ContentContext.jsx";
import PublicSite from "./PublicSite.jsx";
import AdminPanel from "./AdminPanel.jsx";
import AdminLogin from "./AdminLogin.jsx";
import { supabase } from "./supabaseClient.js";

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

function useSession() {
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);
  return session;
}

export default function App() {
  const hash = useHashRoute();
  const session = useSession();
  const isAdmin = hash === "#admin";

  if (isAdmin) {
    if (session === undefined) return null;
    if (!session) return <AdminLogin />;
    return (
      <ContentProvider>
        <AdminPanel onExit={() => (window.location.hash = "")} />
      </ContentProvider>
    );
  }

  return (
    <ContentProvider>
      <PublicSite />
    </ContentProvider>
  );
}
