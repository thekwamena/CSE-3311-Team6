import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, GraduationCap, AlertCircle, User, Upload, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";

export default function AuthScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [authError, setAuthError] = useState("");

  const validateEmail = (value) => {
    const normalizedEmail = value.trim().toLowerCase();

    if (!value) {
      setEmailError("");
      return false;
    }

    if (!normalizedEmail.endsWith("@mavs.uta.edu")) {
      setEmailError("Must use UTA email (@mavs.uta.edu)");
      return false;
    }

    setEmailError("");
    return true;
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAuthError("Image size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAuthError("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const uploadedImage = typeof reader.result === "string" ? reader.result : null;

      if (!uploadedImage) {
        setAuthError("Please upload a valid image file");
        return;
      }

      setProfilePicture(uploadedImage);
      setAuthError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local, then restart npm run dev.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!validateEmail(normalizedEmail) || !password) {
      setAuthError("Please provide a valid email and password.");
      return;
    }

    if (activeTab === "signup") {
      if (!fullName.trim()) {
        setAuthError("Please enter your full name");
        return;
      }
      if (!profilePicture) {
        setAuthError("Please upload a profile picture");
        return;
      }
    }

    setIsLoading(true);
    setAuthError("");

    try {
      if (activeTab === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              profile_picture: profilePicture,
            },
          },
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          toast.success("Account created. Check your UTA email to confirm your account.");
          setIsLoading(false);
          return;
        }

        login({
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name || fullName.trim(),
          profilePicture: data.user.user_metadata?.profile_picture || profilePicture,
        });
        toast.success("Account created.");
        navigate("/browse");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        throw error;
      }

      login({
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name || data.user.email?.split("@")[0],
        profilePicture: data.user.user_metadata?.profile_picture || null,
      });
      toast.success("Welcome back.");
      navigate("/browse");
    } catch (error) {
      setAuthError(error.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const emailIsValid = email.trim().toLowerCase().endsWith("@mavs.uta.edu") && !emailError;
  const isFormValid =
    emailIsValid &&
    password &&
    (activeTab === "login" || (activeTab === "signup" && fullName.trim() && profilePicture));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#EEF2FF] px-4 py-8 sm:py-12">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white/90 shadow-2xl shadow-[#1D4ED8]/10 backdrop-blur lg:grid-cols-[1.15fr,1fr]">
        <div className="relative hidden overflow-hidden bg-[#1E3A8A] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -left-12 -top-12 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-14 -right-12 h-60 w-60 rounded-full bg-[#60A5FA]/30 blur-2xl" />

          <div className="relative z-10">
            <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/20">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold leading-tight">MaverickMarket</h1>
            <p className="mt-4 max-w-sm text-sm text-white/85">
              The trusted UTA marketplace for verified student-to-student buying and selling.
            </p>
          </div>

          <div className="relative z-10 space-y-3 text-sm">
            <p className="inline-flex items-center gap-2 text-white/90">
              <ShieldCheck className="h-4 w-4" /> Verified with your `@mavs.uta.edu` email
            </p>
            <p className="inline-flex items-center gap-2 text-white/90">
              <Sparkles className="h-4 w-4" /> Clean listings and safer campus meetups
            </p>
          </div>
        </div>

        <div className="w-full p-6 sm:p-10">
          <div className="mb-6 lg:hidden">
            <h1 className="text-2xl font-bold text-[#0F172A]">MaverickMarket</h1>
            <p className="mt-1 text-sm text-[#64748B]">Sign in to access the UTA-only marketplace.</p>
          </div>

          <div className="mb-7 flex rounded-xl bg-[#F1F5F9] p-1.5">
            <button
              onClick={() => {
                setActiveTab("login");
                setAuthError("");
              }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                activeTab === "login" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                setAuthError("");
              }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
                activeTab === "signup" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B] hover:text-[#1E293B]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 rounded-xl border border-[#FCA5A5] bg-[#FEF2F2] p-3"
            >
              <AlertCircle className="h-4 w-4 text-[#DC2626]" />
              <p className="text-sm text-[#991B1B]">{authError}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            {activeTab === "signup" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#334155]">Full name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-[#CBD5E1] bg-white py-3 pl-10 pr-4 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE]"
                    placeholder="John Maverick"
                  />
                </div>
              </div>
            )}

            {activeTab === "signup" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-[#334155]">Profile picture</label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#60A5FA] bg-[#F8FAFC] p-3 text-sm font-medium text-[#1D4ED8] transition hover:bg-[#EFF6FF]">
                  <Upload className="h-4 w-4" />
                  {profilePicture ? "Change photo" : "Upload photo"}
                  <input type="file" accept="image/*" onChange={handleProfilePictureUpload} className="hidden" />
                </label>
                {profilePicture && (
                  <div className="mt-3 inline-flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-2 pr-4">
                    <img src={profilePicture} alt="Profile preview" className="h-14 w-14 rounded-lg object-cover" />
                    <p className="text-xs text-[#475569]">Profile image ready</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#334155]">UTA Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                  setAuthError("");
                }}
                placeholder="yourname@mavs.uta.edu"
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:ring-2 ${
                  emailError
                    ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#FECACA]"
                    : "border-[#CBD5E1] focus:border-[#2563EB] focus:ring-[#BFDBFE]"
                }`}
              />
              {emailError && <p className="mt-1 text-xs text-[#DC2626]">{emailError}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#334155]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full rounded-xl border border-[#CBD5E1] bg-white py-3 pl-4 pr-10 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] transition hover:text-[#334155]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className="mt-2 w-full rounded-xl bg-[#1D4ED8] py-3 text-sm font-semibold text-white transition hover:bg-[#1E40AF] disabled:cursor-not-allowed disabled:bg-[#CBD5E1]"
            >
              {isLoading ? (activeTab === "signup" ? "Creating account..." : "Signing in...") : activeTab === "signup" ? "Create Account" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


