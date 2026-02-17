import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  MapPin,
  Star,
  Shield,
  Home,
  MessageCircle,
  User,
  Package,
} from "lucide-react";
import { mockListings } from "../data/mockData";

export default function BrowseScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxDistance, setMaxDistance] = useState(10);
  const [showHint, setShowHint] = useState(true);

  const categories = ["All", "Books", "Furniture", "Electronics"];

  const filteredListings = mockListings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || listing.category === activeCategory;
    const matchesPrice =
      listing.price >= priceRange[0] && listing.price <= priceRange[1];
    const matchesDistance = listing.distance <= maxDistance;

    return matchesSearch && matchesCategory && matchesPrice && matchesDistance;
  });

  const handleApplyFilters = () => {
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setPriceRange([0, 1000]);
    setMaxDistance(10);
  };

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
            <div className="flex items-center gap-3 mb-4">
              {/* Search Field */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search listings..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F4F6F9] rounded-[12px] text-[16px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilterModal(true)}
                className="w-11 h-11 bg-[#2563EB] rounded-[12px] flex items-center justify-center shadow-md hover:bg-[#1E40AF] transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5 text-white" />
              </button>

              {/* Profile Avatar */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/profile")}
                className="w-11 h-11 bg-[#E5E7EB] rounded-full overflow-hidden"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </motion.button>
            </div>

            {/* Category Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2 rounded-[20px] text-[16px] font-medium whitespace-nowrap transition-all ${
                    activeCategory === category
                      ? "bg-[#2563EB] text-white shadow-md"
                      : "bg-white text-[#6B7280] border-2 border-[#E5E7EB]"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Listings Feed */}
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 no-scrollbar">
            {filteredListings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full text-center px-8"
              >
                <Package className="w-16 h-16 text-[#9CA3AF] mb-4" />
                <h3 className="text-[22px] font-semibold text-[#111827] mb-2">
                  No listings found
                </h3>
                <p className="text-[16px] text-[#6B7280]">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredListings.map((listing, index) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    index={index}
                    onClick={() => navigate(`/item/${listing.id}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-3 flex items-center justify-around">
            <NavButton icon={Home} label="Home" active />
            <NavButton icon={Search} label="Search" />
            <NavButton icon={MessageCircle} label="Messages" />
            <NavButton icon={User} label="Profile" />
          </div>

          {/* Create Listing FAB */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-24 right-6 w-14 h-14 bg-[#2563EB] rounded-full shadow-lg flex items-center justify-center z-20"
          >
            <Plus className="w-6 h-6 text-white" />
          </motion.button>

          {/* Demo Hint */}
          {filteredListings.length > 0 && showHint && (
            null
          )}
        </div>

        {/* Filter Modal */}
        <AnimatePresence>
          {showFilterModal && (
            <FilterModal
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxDistance={maxDistance}
              setMaxDistance={setMaxDistance}
              onClose={() => setShowFilterModal(false)}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />
          )}
        </AnimatePresence>
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

function ListingCard({ listing, index, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 bg-[#E5E7EB]">
        <img
          src={listing.images[0]}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
          <span className="text-[16px] font-bold text-[#2563EB]">
            ${listing.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-[18px] font-semibold text-[#111827] mb-1 line-clamp-1">
          {listing.title}
        </h3>
        <p className="text-[14px] text-[#6B7280] mb-3 line-clamp-2">
          {listing.description}
        </p>

        {/* Seller Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={listing.seller.avatar}
              alt={listing.seller.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-medium text-[#111827]">
                  {listing.seller.name}
                </span>
                {listing.seller.verified && (
                  <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-[#FBBF24] fill-[#FBBF24]" />
                <span className="text-[12px] text-[#6B7280]">
                  {listing.seller.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Distance */}
          <div className="flex items-center gap-1 text-[#6B7280]">
            <MapPin className="w-4 h-4" />
            <span className="text-[13px]">{listing.distance} mi</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NavButton({ icon: Icon, label, active = false }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (label === "Search") {
      navigate("/search");
    } else if (label === "Messages") {
      navigate("/messages");
    } else if (label === "Profile") {
      navigate("/profile");
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className="flex flex-col items-center gap-1"
    >
      <Icon
        className={`w-6 h-6 ${
          active ? "text-[#2563EB]" : "text-[#9CA3AF]"
        }`}
      />
      <span
        className={`text-[11px] ${
          active ? "text-[#2563EB] font-medium" : "text-[#9CA3AF]"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}

function FilterModal({
  priceRange,
  setPriceRange,
  maxDistance,
  setMaxDistance,
  onClose,
  onApply,
  onReset,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white rounded-t-[24px] p-6 shadow-2xl"
      >
        {/* Handle Bar */}
        <div className="w-12 h-1.5 bg-[#E5E7EB] rounded-full mx-auto mb-6" />

        <h2 className="text-[22px] font-semibold text-[#111827] mb-6">
          Filter Listings
        </h2>

        {/* Price Range */}
        <div className="mb-6">
          <label className="block text-[16px] font-medium text-[#111827] mb-3">
            Price Range
          </label>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-[14px] text-[#6B7280]">${priceRange[0]}</span>
            <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full relative">
              <div
                className="absolute h-full bg-[#2563EB] rounded-full"
                style={{
                  left: `${(priceRange[0] / 1000) * 100}%`,
                  right: `${100 - (priceRange[1] / 1000) * 100}%`,
                }}
              />
            </div>
            <span className="text-[14px] text-[#6B7280]">${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full"
          />
        </div>

        {/* Max Distance */}
        <div className="mb-8">
          <label className="block text-[16px] font-medium text-[#111827] mb-3">
            Max Distance (Campus)
          </label>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-[14px] text-[#6B7280]">0 mi</span>
            <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full relative">
              <div
                className="absolute h-full bg-[#2563EB] rounded-full"
                style={{ width: `${(maxDistance / 10) * 100}%` }}
              />
            </div>
            <span className="text-[14px] text-[#6B7280]">10 mi</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={maxDistance}
            onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-[14px] text-[#6B7280] text-center mt-1">
            {maxDistance} mi
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3 rounded-[12px] border-2 border-[#E5E7EB] text-[16px] font-semibold text-[#6B7280] hover:bg-[#F4F6F9] transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className="flex-1 py-3 rounded-[12px] bg-[#2563EB] text-white text-[16px] font-semibold hover:bg-[#1E40AF] transition-colors shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}