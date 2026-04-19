import { useNavigate, useLocation } from "react-router";
import { CheckCircle2, MessageCircle, Home } from "lucide-react";

export default function SuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, listing } = location.state || { type: "meetup" };
  const isMeetup = type === "meetup";

  return (
    <div className="min-h-screen bg-[#F4F6F9] p-4 sm:p-6">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm">
        <CheckCircle2
          className={`mx-auto mb-4 h-16 w-16 ${
            isMeetup ? "text-[#10B981]" : "text-[#2563EB]"
          }`}
        />
        <h1 className="text-3xl font-bold text-[#111827]">
          {isMeetup ? "Meetup Confirmed" : "Request Sent"}
        </h1>
        <p className="mt-3 text-sm text-[#6B7280]">
          {isMeetup
            ? "Your meetup has been confirmed. Keep chatting to finalize details."
            : "The seller has been notified and can reply in your inbox."}
        </p>

        {listing && (
          <div className="mx-auto mt-6 max-w-md rounded-xl border border-[#E5E7EB] p-4 text-left">
            <p className="text-xs text-[#6B7280]">Listing</p>
            <p className="text-sm font-semibold text-[#111827]">
              {listing.title}
            </p>
            <p className="mt-1 text-sm text-[#2563EB] font-semibold">
              ${listing.price}
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => navigate("/browse")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1E40AF]"
          >
            <Home className="h-4 w-4" /> Return to browse
          </button>
          <button
            onClick={() => navigate(`/chat/${listing?.id || "1"}`)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2563EB] px-4 py-3 text-sm font-semibold text-[#2563EB] hover:bg-[#EFF6FF]"
          >
            <MessageCircle className="h-4 w-4" /> Open chat
          </button>
        </div>
      </div>
    </div>
  );
}