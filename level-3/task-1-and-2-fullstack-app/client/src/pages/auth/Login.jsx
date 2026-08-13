import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields");

    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success("Authentication successful");
      navigate("/dashboard");
    } catch (err) {
      // Safely extract the standardized backend error message
      const message = err.response?.data?.error || "Authentication failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center relative overflow-hidden px-4">
      {/* Decorative Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand rounded-full filter blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md bg-surface border border-surface-muted rounded-2xl shadow-glass p-8 relative z-10 backdrop-filter backdrop-blur-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">
            Sign in to access your DevVolt workspace
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center text-gray-400 focus-within:text-brand transition-colors">
              <Mail className="absolute left-3 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-canvas border border-surface-muted rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-brand focus:border-brand transition-shadow"
                placeholder="developer@example.com"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <div className="relative flex items-center text-gray-400 focus-within:text-brand transition-colors">
              <Lock className="absolute left-3 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-canvas border border-surface-muted rounded-lg py-2.5 pl-10 pr-10 text-white placeholder-gray-500 focus:ring-1 focus:ring-brand focus:border-brand transition-shadow"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand hover:bg-brand-hover text-white font-medium py-2.5 rounded-lg flex items-center justify-center transition-all shadow-glow disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              <span className="flex items-center">
                Sign In <LogIn className="ml-2 w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          New to DevVolt?{" "}
          <Link
            to="/register"
            className="text-brand hover:text-brand-hover font-medium transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
