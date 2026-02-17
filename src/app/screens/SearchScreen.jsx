import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  X,
  TrendingUp,
  Clock,
  Home,
  MessageCircle,
  User,
  Search as SearchIcon,
} from "lucide-react";
import { mockListings } from "../data/mockData";

export default function SearchScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory] = useState([
    "Calculus Textbook",
    "Study Desk",
    "MacBook Air",
    "Office Chair",
  ]);

  const trendingSearches = [
    "Biology Textbook",
    "Mini Fridge",
    "Gaming Chair",
    "Desk Lamp",
    "Backpack",
  ];

  const filteredListings = searchQuery
    ? mockListings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-4">
      {/* iPhone Frame */}
      <div className="w-[393px] h-[852px] bg-white rounded-[60px] shadow-2xl overflow-hidden relative border-[14px] border-black">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl z-50" />

        {/* Content */}
        <div className="h-full flex flex-col bg-[#F4F6F9]">
          {/* Search Header */}
          <div className="pt-12 px-4 pb-4 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for items..."
                  autoFocus
                  className="w-full pl-10 pr-10 py-3 bg-[#F4F6F9] rounded-[12px] text-[16px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#E5E7EB] rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-[#6B7280]" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
            <AnimatePresence mode="wait">
              {searchQuery ? (
                /* Search Results */
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-4"
                >
                  <h3 className="text-[14px] font-semibold text-[#6B7280] mb-3">
                    {filteredListings.length} Results
                  </h3>
                  {filteredListings.length > 0 ? (
                    <div className="space-y-3">
                      {filteredListings.map((listing) => (
                        <motion.div
                          key={listing.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/item/${listing.id}`)}
                          className="bg-white rounded-[16px] p-3 shadow-sm flex items-center gap-3 cursor-pointer"
                        >
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-16 h-16 rounded-[12px] object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-[16px] font-semibold text-[#111827] mb-1">
                              {listing.title}
                            </h4>
                            <p className="text-[14px] text-[#2563EB] font-bold">
                              ${listing.price}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Search className="w-16 h-16 text-[#9CA3AF] mb-4" />
                      <p className="text-[16px] text-[#6B7280]">
                        No results found for "{searchQuery}"
                      </p>
                      <p className="text-[14px] text-[#9CA3AF] mt-2">
                        Try different keywords
                      </p>
                    </div>
                  )}
                </motion.div>
              ) : (
                /* Search Suggestions */
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-6"
                >
                  {/* Recent Searches */}
                  <div className="mb-8">
                    <h3 className="text-[18px] font-semibold text-[#111827] mb-4">
                      Recent Searches
                    </h3>
                    <div className="space-y-2">
                      {searchHistory.map((term, index) => (
                        <motion.button
                          key={index}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSearchQuery(term)}
                          className="w-full flex items-center gap-3 p-3 bg-white rounded-[12px] shadow-sm hover:bg-[#F4F6F9] transition-colors"
                        >
                          <Clock className="w-5 h-5 text-[#9CA3AF]" />
                          <span className="flex-1 text-left text-[16px] text-[#111827]">
                            {term}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Trending Searches */}
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#111827] mb-4">
                      Trending Searches
                    </h3>
                    <div className="space-y-2">
                      {trendingSearches.map((term, index) => (
                        <motion.button
                          key={index}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSearchQuery(term)}
                          className="w-full flex items-center gap-3 p-3 bg-white rounded-[12px] shadow-sm hover:bg-[#F4F6F9] transition-colors"
                        >
                          <TrendingUp className="w-5 h-5 text-[#2563EB]" />
                          <span className="flex-1 text-left text-[16px] text-[#111827]">
                            {term}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-3 flex items-center justify-around">
            <NavButton
              icon={Home}
              label="Home"
              onClick={() => navigate("/browse")}
            />
            <NavButton icon={SearchIcon} label="Search" active />
            <NavButton
              icon={MessageCircle}
              label="Messages"
              onClick={() => navigate("/messages")}
            />
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