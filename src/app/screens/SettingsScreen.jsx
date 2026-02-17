import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ChevronLeft,
  User,
  Bell,
  Receipt,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Home,
  Search,
  MessageCircle,
  User as UserIcon,
} from "lucide-react";

export default function SettingsScreen() {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: User,
      label: "Edit Profile",
      onClick: () => {},
      showBadge: false,
    },
    {
      icon: Bell,
      label: "Manage Notifications",
      onClick: () => {},
      showBadge: false,
    },
    {
      icon: Receipt,
      label: "Transaction History",
      onClick: () => {},
      showBadge: false,
    },
    {
      icon: Shield,
      label: "University Verification",
      onClick: () => {},
      showBadge: true,
      badgeText: "Verified",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      onClick: () => {},
      showBadge: false,
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
              onClick={() => navigate("/profile")}
              className="w-9 h-9 flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-[#111827]" />
            </motion.button>
            <h1 className="text-[18px] font-semibold text-[#111827]">
              Settings
            </h1>
            <div className="w-9" />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
            {/* Profile Card */}
            <div className="bg-white px-6 py-6 mb-2">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#2563EB]">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#111827] mb-1">
                    Alex Thompson
                  </h2>
                  <p className="text-[14px] text-[#6B7280]">
                    alexthompson@mavs.uta.edu
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="bg-white px-4 py-2">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  whileTap={{ scale: 0.98 }}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-4 py-4 border-b border-[#E5E7EB] last:border-b-0"
                >
                  <div className="w-10 h-10 bg-[#F4F6F9] rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#6B7280]" />
                  </div>
                  <span className="flex-1 text-left text-[16px] text-[#111827] font-medium">
                    {item.label}
                  </span>
                  {item.showBadge && item.badgeText && (
                    <span className="px-3 py-1 bg-[#D1FAE5] text-[#10B981] text-[12px] font-semibold rounded-full">
                      {item.badgeText}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
                </motion.button>
              ))}
            </div>

            {/* Logout Button */}
            <div className="px-4 py-6">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white rounded-[12px] shadow-sm border border-[#FEE2E2]"
              >
                <LogOut className="w-5 h-5 text-[#EF4444]" />
                <span className="text-[16px] text-[#EF4444] font-semibold">
                  Logout
                </span>
              </motion.button>
            </div>

            {/* App Version */}
            <div className="text-center px-6 py-4">
              <p className="text-[12px] text-[#9CA3AF]">Version 1.0.0</p>
              <p className="text-[12px] text-[#9CA3AF] mt-1">
                © 2026 MaverickMarket
              </p>
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
            <NavButton
              icon={UserIcon}
              label="Profile"
              active
              onClick={() => navigate("/profile")}
            />
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