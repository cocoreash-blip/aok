import { useState } from "react";
import { supabase } from "./supabaseClient.js";

export default function AdminLogin() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const isSignIn = mode === "signin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setNotice(null);

    const credentials = { email: email.trim(), password };
    const { data, error: authError } = isSignIn
      ? await supabase.auth.signInWithPassword(credentials)
      : await supabase.auth.signUp(credentials);

    setSubmitting(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    if (!isSignIn && !data.session) {
      setNotice("Account created. Sign in with your email and password.");
      setMode("signin");
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] font-body flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-[#111315] border border-white/10 rounded-lg p-8">
        <h1 className="font-heading font-700 text-white text-xl uppercase tracking-wide mb-1">
          Admin Panel
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          {isSignIn ? "Sign in to edit your website." : "Create an account to get started."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={isSignIn ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {notice && <p className="text-sm text-green-400">{notice}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {submitting
              ? "Please wait..."
              : isSignIn
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(isSignIn ? "signup" : "signin");
            setError(null);
            setNotice(null);
          }}
          className="mt-6 w-full text-sm text-gray-400 hover:text-white transition-colors"
        >
          {isSignIn ? "Need an account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
