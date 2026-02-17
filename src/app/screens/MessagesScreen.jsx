import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Search,
  Home,
  MessageCircle,
  User,
  Search as SearchIcon,
} from "lucide-react";
import { mockListings } from "../data/mockData";

export default function MessagesScreen() {
  const navigate = useNavigate();

  // Mock conversations
  const conversations = [
    {
      id: "1",
      listing: mockListings[0],
      lastMessage: "Sounds good! See you then.",
      timestamp: "2:45 PM",
      unread: 2,
    },
    {
      id: "2",
      listing: mockListings[1],
      lastMessage: "Is this still available?",
      timestamp: "Yesterday",
      unread: 0,
    },
    {
      id: "3",
      listing: mockListings[2],
      lastMessage: "Thanks for the quick response!",
      timestamp: "Monday",
      unread: 0,
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
          <div className="pt-12 px-4 pb-4 bg-white shadow-sm">
            <h1 className="text-[24px] font-bold text-[#111827] mb-4">
              Messages
            </h1>

            {/* Search Field */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#F4F6F9] rounded-[12px] text-[16px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
            {conversations.length > 0 ? (
              <div className="py-2">
                {conversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/chat/${conversation.listing.id}`)}
                    className="px-4 py-4 bg-white border-b border-[#E5E7EB] flex items-center gap-3 cursor-pointer hover:bg-[#F4F6F9] transition-colors"
                  >
                    {/* Listing Image */}
                    <div className="w-14 h-14 rounded-[12px] overflow-hidden flex-shrink-0">
                      <img
                        src={conversation.listing.images[0]}
                        alt={conversation.listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Message Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-[16px] font-semibold text-[#111827] truncate pr-2">
                          {conversation.listing.seller.name}
                        </h3>
                        <span className="text-[12px] text-[#9CA3AF] whitespace-nowrap">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="text-[14px] text-[#6B7280] mb-1 truncate">
                        {conversation.listing.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-[14px] text-[#9CA3AF] truncate pr-2">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <div className="w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-[11px] text-white font-bold">
                              {conversation.unread}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-8">
                <MessageCircle className="w-16 h-16 text-[#9CA3AF] mb-4" />
                <h3 className="text-[20px] font-semibold text-[#111827] mb-2">
                  No Messages Yet
                </h3>
                <p className="text-[16px] text-[#6B7280]">
                  Start browsing to connect with sellers
                </p>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/browse")}
                  className="mt-6 px-6 py-3 bg-[#2563EB] text-white rounded-[12px] font-semibold text-[16px] shadow-md hover:bg-[#1E40AF] transition-colors"
                >
                  Browse Listings
                </motion.button>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-3 flex items-center justify-around">
            <NavButton
              icon={Home}
              label="Home"
              onClick={() => navigate("/browse")}
            />
            <NavButton
              icon={SearchIcon}
              label="Search"
              onClick={() => navigate("/search")}
            />
            <NavButton icon={MessageCircle} label="Messages" active />
            <NavButton
              icon={User}
              label="Profile"
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