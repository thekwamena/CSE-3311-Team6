import { useNavigate } from "react-router";
import { ArrowLeft, LogOut, User, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#F4F6F9] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <button
          onClick={() => navigate("/profile")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#2563EB]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </button>

        <h1 className="mb-5 text-2xl font-bold text-[#111827]">
          Account settings
        </h1>

        <div className="space-y-3">
          <div className="rounded-xl border border-[#E5E7EB] p-4">
            <p className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-[#111827]">
              <User className="h-4 w-4" /> Full name
            </p>
            <p className="text-sm text-[#6B7280]">
              {user?.fullName || "UTA Student"}
            </p>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] p-4">
            <p className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-[#111827]">
              <Mail className="h-4 w-4" /> Email
            </p>
            <p className="text-sm text-[#6B7280]">{user?.email}</p>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] p-4">
            <p className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-[#111827]">
              <ShieldCheck className="h-4 w-4" /> Verification
            </p>
            <p className="text-sm text-[#6B7280]">
              Your UTA domain email is verified.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#FECACA] px-4 py-2.5 text-sm font-semibold text-[#DC2626] hover:bg-[#FEF2F2]"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}