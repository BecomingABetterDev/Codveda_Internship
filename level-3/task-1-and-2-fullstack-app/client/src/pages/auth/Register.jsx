import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Check,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password Security Metrics
  const passwordCriteria = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Contains a number", valid: /\d/.test(password) },
    { label: "Contains an uppercase letter", valid: /[A-Z]/.test(password) },
    {
      label: "Contains a special character",
      valid: /[@$!%*?&]/.test(password),
    },
  ];

  const isPasswordStrong = passwordCriteria.every((c) => c.valid);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      return toast.error("Please complete all required fields");
    }

    if (!isPasswordStrong) {
      return toast.error("Please fulfill all password security requirements");
    }

    if (!passwordsMatch) {
      return toast.error("Passwords do not match");
    }

    setIsSubmitting(true);
    try {
      await register(username, email, password);
      toast.success("Account created successfully");
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.error || "Registration failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Ambient Glow background element */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand rounded-full filter blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-md bg-surface border border-surface-muted rounded-2xl shadow-glass p-8 relative z-10 backdrop-filter backdrop-blur-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm">
            Join DevVolt to elevate your workflow
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Username Field */}
          <div>
            <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
              Username
            </label>
            <div className="relative flex items-center text-gray-400 focus-within:text-brand transition-colors">
              <User className="absolute left-3 w-5 h-5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-canvas border border-surface-muted rounded-lg py-2.5 pl-10 pr-4 text-slate-900 dark:text-white text-sm placeholder-gray-500 focus:ring-1 focus:ring-brand focus:border-brand transition-all"
                placeholder="johndoe"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative flex items-center text-gray-400 focus-within:text-brand transition-colors">
              <Mail className="absolute left-3 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-canvas border border-surface-muted rounded-lg py-2.5 pl-10 pr-4 text-slate-900 dark:text-white text-sm placeholder-gray-500 focus:ring-1 focus:ring-brand focus:border-brand transition-all"
                placeholder="developer@example.com"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative flex items-center text-gray-400 focus-within:text-brand transition-colors">
              <Lock className="absolute left-3 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-canvas border border-surface-muted rounded-lg py-2.5 pl-10 pr-10 text-slate-900 dark:text-white text-sm placeholder-gray-500 focus:ring-1 focus:ring-brand focus:border-brand transition-all"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-slate-700 transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Strength Checklist */}
          {password.length > 0 && (
            <div className="p-3 bg-canvas border border-surface-muted rounded-lg space-y-1.5">
              <p className="text-xs font-semibold text-gray-400 mb-1">
                Security Standards:
              </p>
              {passwordCriteria.map((criterion, idx) => (
                <div
                  key={idx}
                  className="flex items-center text-xs space-x-2"
                >
                  {criterion.valid ? (
                    <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                  )}
                  <span
                    className={
                      criterion.valid ? "text-emerald-700 " : "text-gray-500"
                    }
                  >
                    {criterion.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative flex items-center text-gray-400 focus-within:text-brand transition-colors">
              <Lock className="absolute left-3 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-canvas border border-surface-muted rounded-lg py-2.5 pl-10 pr-4 text-slate-900 dark:text-white text-sm placeholder-gray-500 focus:ring-1 focus:ring-brand focus:border-brand transition-all"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
            {confirmPassword.length > 0 && (
              <p
                className={`text-xs mt-1 ${
                  passwordsMatch ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !isPasswordStrong || !passwordsMatch}
            className="w-full mt-2 bg-brand hover:bg-brand-hover text-slate-900 dark:text-white font-medium py-2.5 rounded-lg flex items-center justify-center transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center text-sm">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-900 dark:text-white"
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
                Creating Workspace...
              </span>
            ) : (
              <span className="flex items-center text-sm">
                Get Started <UserPlus className="ml-2 w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand hover:text-brand-hover font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
