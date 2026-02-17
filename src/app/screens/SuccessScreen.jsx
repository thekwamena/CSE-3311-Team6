import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { CheckCircle2, PartyPopper, Clock, MapPin, DollarSign } from "lucide-react";

export default function SuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, listing } = location.state || { type: "meetup" };

  const isMeetup = type === "meetup";

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-4">
      {/* iPhone Frame */}
      <div className="w-[393px] h-[852px] bg-white rounded-[60px] shadow-2xl overflow-hidden relative border-[14px] border-black">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl z-50" />

        {/* Content */}
        <div className="h-full flex flex-col items-center justify-center px-8 bg-gradient-to-b from-[#F4F6F9] to-white">
          {/* Animated Check Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            className="mb-8"
          >
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center ${
                isMeetup ? "bg-[#D1FAE5]" : "bg-[#DBEAFE]"
              }`}
            >
              <CheckCircle2
                className={`w-20 h-20 ${
                  isMeetup ? "text-[#10B981]" : "text-[#2563EB]"
                }`}
              />
            </div>
          </motion.div>

          {/* Confetti Animation */}
          <Confetti />

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[28px] font-bold text-[#111827] text-center mb-3"
          >
            {isMeetup ? "Meetup Confirmed!" : "Request Sent!"}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[16px] text-[#6B7280] text-center mb-8 px-4"
          >
            {isMeetup
              ? "Your meetup has been scheduled. Check your messages for details."
              : "The seller has been notified of your interest. They'll message you soon."}
          </motion.p>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full bg-white rounded-[16px] p-6 shadow-lg mb-6"
          >
            {isMeetup ? (
              <>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#DBEAFE] rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#111827] mb-1">
                      Tomorrow at 2:00 PM
                    </h3>
                    <p className="text-[14px] text-[#6B7280]">
                      Be on time to ensure a smooth exchange
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#DBEAFE] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#111827] mb-1">
                      Near UTA Library
                    </h3>
                    <p className="text-[14px] text-[#6B7280]">
                      Main entrance, look for the seller
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#DBEAFE] rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-[#111827] mb-1">
                    Next Steps
                  </h3>
                  <p className="text-[14px] text-[#6B7280]">
                    Wait for the seller to respond. You'll get a notification when
                    they message you.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Savings Badge */}
          {listing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-[16px] p-4 w-full mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[14px] opacity-90">Estimated Savings</p>
                  <p className="text-[24px] font-bold">$120+</p>
                  <p className="text-[12px] opacity-80">
                    vs. bookstore pricing
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Return Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/browse")}
            className="w-full py-3.5 bg-[#2563EB] text-white rounded-[12px] font-semibold text-[16px] shadow-md hover:bg-[#1E40AF] transition-colors"
          >
            Return to Home
          </motion.button>

          {/* Secondary Action */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => navigate(`/chat/${listing?.id || "1"}`)}
            className="mt-3 text-[16px] font-medium text-[#6B7280] hover:text-[#2563EB] transition-colors"
          >
            View Conversation
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function Confetti() {
  const particles = Array.from({ length: 30 });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: "50%",
            y: "50%",
            scale: 0,
            opacity: 1,
          }}
          animate={{
            x: `${50 + (Math.random() - 0.5) * 100}%`,
            y: `${50 + (Math.random() - 0.5) * 100}%`,
            scale: Math.random() * 1.5 + 0.5,
            opacity: 0,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.02,
            ease: "easeOut",
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: [
              "#2563EB",
              "#10B981",
              "#FBBF24",
              "#EF4444",
              "#8B5CF6",
            ][i % 5],
          }}
        />
      ))}
    </div>
  );
}