import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ChevronLeft,
  Settings,
  Phone,
  Mail,
  Star,
  Shield,
  ChevronRight,
  Home,
  Search,
  MessageCircle,
  User,
} from "lucide-react";

export default function ProfileScreen() {
  const navigate = useNavigate();

  const reviews = [
    {
      id: "1",
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      rating: 5,
      comment: "Great experience! Would buy again.",
      date: "April 2026",
    },
    {
      id: "2",
      name: "Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
      rating: 5,
      comment: "Fast response and item was as described.",
      date: "March 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-4">
      {/* iPhone Frame */}
      <div className="w-[393px] h-[852px] bg-white rounded-[60px] shadow-2xl overflow-hidden relative border-[14px] border-black">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl z-50" />

        {/* Content */}
        <div className="h-full flex flex-col bg-[#F4F6F9]">
          {/* Top Bar */}
          <div className="pt-12 px-4 pb-3 bg-white shadow-sm flex items-center justify-between">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/browse")}
              className="w-9 h-9 flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-[#111827]" />
            </motion.button>
            <h1 className="text-[18px] font-semibold text-[#111827]">Profile</h1>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate("/settings")}
              className="w-9 h-9 flex items-center justify-center"
            >
              <Settings className="w-6 h-6 text-[#111827]" />
            </motion.button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
            {/* Profile Header */}
            <div className="bg-white px-6 pt-8 pb-6">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#2563EB] mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name & Badge */}
                <h2 className="text-[24px] font-bold text-[#111827] mb-2">
                  Alex Thompson
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-[14px] text-[#2563EB] font-medium">
                    Verified Student
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full mb-6">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/settings")}
                    className="flex-1 py-2.5 bg-[#2563EB] text-white rounded-[12px] font-semibold text-[14px] shadow-md hover:bg-[#1E40AF] transition-colors"
                  >
                    Edit Profile
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/browse")}
                    className="flex-1 py-2.5 bg-[#F4F6F9] text-[#111827] rounded-[12px] font-semibold text-[14px] hover:bg-[#E5E7EB] transition-colors"
                  >
                    View Listings
                  </motion.button>
                </div>

                {/* Contact Info */}
                <div className="w-full space-y-3 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-[#F4F6F9] rounded-[12px]">
                    <Phone className="w-5 h-5 text-[#6B7280]" />
                    <span className="text-[14px] text-[#111827]">
                      (817) 555-1234
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#F4F6F9] rounded-[12px]">
                    <Mail className="w-5 h-5 text-[#6B7280]" />
                    <span className="text-[14px] text-[#111827]">
                      alexthompson@mavs.uta.edu
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-around w-full py-4 border-t border-[#E5E7EB]">
                  <div className="text-center">
                    <p className="text-[24px] font-bold text-[#111827]">12</p>
                    <p className="text-[12px] text-[#6B7280]">Sales</p>
                  </div>
                  <div className="w-px h-10 bg-[#E5E7EB]" />
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <p className="text-[24px] font-bold text-[#111827]">
                        4.9
                      </p>
                      <Star className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
                    </div>
                    <p className="text-[12px] text-[#6B7280]">4.9/5 reviews</p>
                  </div>
                  <div className="w-px h-10 bg-[#E5E7EB]" />
                  <div className="text-center">
                    <p className="text-[24px] font-bold text-[#111827]">32</p>
                    <p className="text-[12px] text-[#6B7280]">Reviews</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="px-4 py-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-semibold text-[#111827]">
                  Reviews
                </h3>
                <button className="flex items-center gap-1 text-[14px] text-[#2563EB] font-medium">
                  See All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[16px] p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-[14px] font-semibold text-[#111827]">
                            {review.name}
                          </h4>
                          <span className="text-[12px] text-[#9CA3AF]">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3 text-[#FBBF24] fill-[#FBBF24]"
                            />
                          ))}
                        </div>
                        <p className="text-[14px] text-[#6B7280]">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-3 flex items-center justify-around">
            <NavButton
              icon={Home}
              label="Home"
              onClick={() => navigate("/browse")}
            />
            <NavButton
              icon={Search}
              label="Search"
              onClick={() => navigate("/search")}
            />
            <NavButton
              icon={MessageCircle}
              label="Messages"
              onClick={() => navigate("/messages")}
            />
            <NavButton icon={User} label="Profile" active />
          </div>
        </div>
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function NavButton({ icon: Icon, label, active, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="flex flex-col items-center gap-1"
    >
      <Icon
        className={`w-6 h-6 ${
          active ? "text-[#2563EB]" : "text-[#9CA3AF]"
        }`}
      />
      <span
        className={`text-[11px] ${
          active ? "text-[#2563EB] font-semibold" : "text-[#9CA3AF]"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}