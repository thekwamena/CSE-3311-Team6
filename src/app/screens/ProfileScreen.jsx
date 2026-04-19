import { useNavigate } from "react-router";
import { Mail, ShieldCheck, Settings, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F4F6F9] p-4 sm:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <button
          onClick={() => navigate("/browse")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#2563EB]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-6 flex items-center gap-4">
          <img
            src={
              user?.profilePicture ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
            }
            alt="Profile"
            className="h-20 w-20 rounded-full border border-[#E5E7EB] object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">
              {user?.fullName || "UTA Student"}
            </h1>
            <p className="mt-1 inline-flex items-center gap-2 text-sm text-[#6B7280]">
              <Mail className="h-4 w-4" /> {user?.email}
            </p>
            <p className="mt-1 inline-flex items-center gap-2 text-xs font-medium text-[#2563EB]">
              <ShieldCheck className="h-4 w-4" /> Verified UTA account
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => navigate("/messages")}
            className="rounded-xl border border-[#E5E7EB] p-4 text-left hover:bg-[#F9FAFB]"
          >
            <p className="text-sm font-semibold text-[#111827]">Inbox</p>
            <p className="text-xs text-[#6B7280]">Review active conversations</p>
          </button>
          <button
            onClick={() => navigate("/create-listing")}
            className="rounded-xl border border-[#E5E7EB] p-4 text-left hover:bg-[#F9FAFB]"
          >
            <p className="text-sm font-semibold text-[#111827]">Create Listing</p>
            <p className="text-xs text-[#6B7280]">Post a new item for sale</p>
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="rounded-xl border border-[#E5E7EB] p-4 text-left hover:bg-[#F9FAFB] sm:col-span-2"
          >
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#111827]">
              <Settings className="h-4 w-4" /> Account Settings
            </p>
            <p className="text-xs text-[#6B7280]">Manage your account and sign out</p>
          </button>
        </div>
      </div>
    </div>
  );
}
