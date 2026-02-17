import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, GraduationCap, Check, AlertCircle, User, Upload } from "lucide-react";
import { toast } from "sonner";

export default function AuthScreen() {
  const navigate = useNavigate();
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
    if (!value) {
      setEmailError("");
      return false;
    }
    if (!value.endsWith("@mavs.uta.edu")) {
      setEmailError("Must use UTA email (@mavs.uta.edu)");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setAuthError("");
    validateEmail(value);
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setAuthError("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setAuthError("Please upload a valid image file");
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
        setAuthError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignIn = async () => {
    if (!validateEmail(email) || !password) {
      return;
    }

    // Additional validation for sign up
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

    // Simulate API call
    setTimeout(() => {
      if (password === "wrong") {
        setAuthError("Authentication failed. Please check your credentials.");
        setIsLoading(false);
      } else {
        // Success - store user data in localStorage
        if (activeTab === "signup") {
          localStorage.setItem(
            "userProfile",
            JSON.stringify({
              email,
              fullName,
              profilePicture,
            })
          );
          toast.success("Account created successfully!");
        }
        navigate("/browse");
      }
    }, 1000);
  };

  const emailIsValid = email.endsWith("@mavs.uta.edu") && !emailError;

  // Check if form is valid
  const isFormValid =
    emailIsValid &&
    password &&
    (activeTab === "login" ||
      (activeTab === "signup" && fullName.trim() && profilePicture));

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-4">
      {/* iPhone Frame */}
      <div className="w-[393px] h-[852px] bg-white rounded-[60px] shadow-2xl overflow-hidden relative border-[14px] border-black">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl z-50" />

        {/* Content */}
        <div className="h-full flex flex-col items-center justify-center px-8 bg-[#F4F6F9] overflow-y-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center pt-12"
          >
            <div className="w-20 h-20 bg-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-[28px] font-bold text-[#111827] mb-2">
              MaverickMarket
            </h1>
            <p className="text-[13px] text-[#6B7280]">
              Exclusive marketplace for UTA students
            </p>
          </motion.div>

          {/* Segmented Control */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full mb-8"
          >
            <div className="bg-white rounded-[12px] p-1 flex shadow-sm">
              <button
                onClick={() => {
                  setActiveTab("login");
                  setAuthError("");
                }}
                className={`flex-1 py-2.5 rounded-[10px] text-[16px] font-semibold transition-all duration-200 ${
                  activeTab === "login"
                    ? "bg-[#2563EB] text-white shadow-md"
                    : "text-[#6B7280]"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setActiveTab("signup");
                  setAuthError("");
                }}
                className={`flex-1 py-2.5 rounded-[10px] text-[16px] font-semibold transition-all duration-200 ${
                  activeTab === "signup"
                    ? "bg-[#2563EB] text-white shadow-md"
                    : "text-[#6B7280]"
                }`}
              >
                Sign Up
              </button>
            </div>
          </motion.div>

          {/* Error Banner */}
          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mb-4 bg-[#FEE2E2] border border-[#EF4444] rounded-[12px] p-3 flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
              <p className="text-[13px] text-[#991B1B]">{authError}</p>
            </motion.div>
          )}

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full space-y-4"
          >
            {/* Full Name Field - Sign Up Only */}
            {activeTab === "signup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-[13px] font-medium text-[#6B7280] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setAuthError("");
                    }}
                    placeholder="John Maverick"
                    className="w-full px-4 py-3 pl-10 bg-white rounded-[12px] border-2 border-[#E5E7EB] text-[16px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563EB] transition-all"
                  />
                  <User className="w-5 h-5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </motion.div>
            )}

            {/* Profile Picture Upload - Sign Up Only */}
            {activeTab === "signup" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <label className="block text-[13px] font-medium text-[#6B7280] mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  {/* Image Preview */}
                  <div className="w-16 h-16 rounded-full bg-[#E5E7EB] flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-[#E5E7EB]">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-[#9CA3AF]" />
                    )}
                  </div>

                  {/* Upload Button */}
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-[12px] border-2 border-dashed border-[#2563EB] hover:border-[#1E40AF] hover:bg-[#EFF6FF] transition-all">
                      <Upload className="w-5 h-5 text-[#2563EB]" />
                      <span className="text-[14px] font-medium text-[#2563EB]">
                        {profilePicture ? "Change Photo" : "Upload Photo"}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-[11px] text-[#9CA3AF] mt-2 ml-1">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-[13px] font-medium text-[#6B7280] mb-2">
                UTA Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="yourname@mavs.uta.edu"
                  className={`w-full px-4 py-3 bg-white rounded-[12px] border-2 text-[16px] text-[#111827] placeholder:text-[#9CA3AF] transition-all ${
                    emailError
                      ? "border-[#EF4444] animate-shake"
                      : emailIsValid
                      ? "border-[#10B981]"
                      : "border-[#E5E7EB]"
                  } focus:outline-none focus:border-[#2563EB]`}
                />
                {emailIsValid && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <Check className="w-5 h-5 text-[#10B981]" />
                  </motion.div>
                )}
              </div>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[13px] text-[#EF4444] mt-1 ml-1"
                >
                  {emailError}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[13px] font-medium text-[#6B7280] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAuthError("");
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleSignIn()}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-white rounded-[12px] border-2 border-[#E5E7EB] text-[16px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563EB] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In/Sign Up Button */}
            <motion.button
              onClick={handleSignIn}
              disabled={!isFormValid || isLoading}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3.5 rounded-[12px] font-semibold text-[16px] transition-all shadow-md ${
                isFormValid && !isLoading
                  ? "bg-[#2563EB] text-white hover:bg-[#1E40AF] active:shadow-lg"
                  : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>
                    {activeTab === "signup" ? "Creating account..." : "Signing in..."}
                  </span>
                </div>
              ) : activeTab === "signup" ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.div>

          {/* Privacy Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-[11px] text-[#9CA3AF] text-center px-4"
          >
            By {activeTab === "signup" ? "creating an account" : "signing in"}, you
            agree to our Terms of Service and Privacy Policy. Valid UTA emails only.
          </motion.p>

          {/* Demo Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-4 mb-8 bg-white/50 backdrop-blur-sm border border-[#E5E7EB] rounded-[12px] p-3 text-center"
          >
            <p className="text-[11px] text-[#6B7280] font-medium mb-1">
              Demo Instructions
            </p>
            <p className="text-[10px] text-[#9CA3AF]">
              {activeTab === "signup"
                ? "Complete all fields to create an account"
                : "Use any @mavs.uta.edu email + any password to continue"}
            </p>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}