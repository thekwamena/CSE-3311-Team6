import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, LogOut, User, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { upsertProfile } from "../data/profileStore";
import { supabase } from "../lib/supabaseClient";

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { user, logout, updateUserProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    setFullName(user?.fullName || "");
  }, [user?.fullName]);

  const handleSaveName = async () => {
    const nextFullName = fullName.trim();

    if (!user?.id) {
      toast.error("You must be signed in to update your name.");
      return;
    }

    if (!nextFullName) {
      toast.error("Please enter your full name.");
      return;
    }

    if (nextFullName === user.fullName) {
      toast.info("Your name is already up to date.");
      return;
    }

    setIsSavingName(true);

    try {
      const profileRow = await upsertProfile({
        id: user.id,
        email: user.email,
        fullName: nextFullName,
      });

      if (supabase) {
        try {
          await supabase.auth.updateUser({
            data: {
              full_name: nextFullName,
            },
          });
        } catch {
          // Keep the app and profiles table updated even if auth metadata lags behind.
        }
      }

      updateUserProfile({
        ...user,
        fullName: profileRow?.full_name || nextFullName,
      });

      toast.success("Name updated.");
    } catch (error) {
      toast.error(error.message || "Could not update your name.");
    } finally {
      setIsSavingName(false);
    }
  };

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
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your full name"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE]"
              />
              <button
                onClick={handleSaveName}
                disabled={isSavingName}
                className="rounded-xl bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E40AF] disabled:cursor-not-allowed disabled:bg-[#CBD5E1]"
              >
                {isSavingName ? "Saving..." : "Save Name"}
              </button>
            </div>
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
