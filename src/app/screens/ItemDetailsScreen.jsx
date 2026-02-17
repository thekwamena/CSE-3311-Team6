import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Shield,
  Star,
  MapPin,
  Eye,
  MessageCircle,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";
import { mockListings } from "../data/mockData";
import { toast } from "sonner";

export default function ItemDetailsScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const listing = mockListings.find((l) => l.id === id);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center">
        <p className="text-[16px] text-[#6B7280]">Listing not found</p>
      </div>
    );
  }

  const description = listing.description;
  const shouldTruncate = description.length > 120;
  const displayDescription =
    shouldTruncate && !showFullDescription
      ? description.slice(0, 120) + "..."
      : description;

  const handleMessageSeller = () => {
    navigate(`/chat/${listing.id}`);
  };

  const handleBuyNow = () => {
    setRequestSent(true);
    toast.success("Purchase request sent to seller!");
    setTimeout(() => {
      navigate("/success", { state: { type: "purchase", listing } });
    }, 1500);
  };

  const handleBack = () => {
    // Navigate back to browse page as fallback
    navigate("/browse");
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
          <div className="absolute top-12 left-0 right-0 z-30 px-4 flex items-center justify-between">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
            >
              <ChevronLeft className="w-6 h-6 text-[#111827]" />
            </motion.button>
          </div>

          {/* Image Carousel */}
          <div className="relative h-80 bg-[#E5E7EB]">
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              src={listing.images[currentImageIndex]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />

            {/* Navigation Dots */}
            {listing.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {listing.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white w-6"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto pb-24">
            {/* Category Badge */}
            <div className="px-4 pt-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#DBEAFE] rounded-full">
                <Shield className="w-4 h-4 text-[#2563EB]" />
                <span className="text-[13px] font-medium text-[#2563EB]">
                  Verified Student
                </span>
              </div>
            </div>

            {/* Title & Price */}
            <div className="px-4 pt-3 pb-4">
              <h1 className="text-[28px] font-bold text-[#111827] mb-2">
                {listing.title}
              </h1>
              <div className="text-[32px] font-bold text-[#2563EB]">
                ${listing.price}
              </div>
            </div>

            {/* Description */}
            <div className="px-4 pb-4">
              <h2 className="text-[18px] font-semibold text-[#111827] mb-2">
                Description
              </h2>
              <p className="text-[16px] text-[#6B7280] leading-relaxed">
                {displayDescription}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-[16px] font-medium text-[#2563EB] mt-2"
                >
                  {showFullDescription ? "Read Less" : "Read More"}
                </button>
              )}
            </div>

            {/* Seller Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-4 mb-4 bg-white rounded-[16px] p-4 shadow-sm"
            >
              <h3 className="text-[18px] font-semibold text-[#111827] mb-3">
                Seller
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={listing.seller.avatar}
                    alt={listing.seller.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[16px] font-semibold text-[#111827]">
                        {listing.seller.name}
                      </span>
                      {listing.seller.verified && (
                        <Shield className="w-4 h-4 text-[#2563EB]" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#FBBF24] fill-[#FBBF24]" />
                      <span className="text-[14px] text-[#6B7280]">
                        {listing.seller.rating.toFixed(1)} rating
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-[14px] font-medium text-[#2563EB] hover:underline">
                  View Profile
                </button>
              </div>

              {/* Location */}
              <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center gap-2 text-[#6B7280]">
                <MapPin className="w-5 h-5" />
                <span className="text-[14px]">
                  {listing.distance} mi away • {listing.location}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Bottom Action Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4 shadow-lg">
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleMessageSeller}
                className="flex-1 py-3.5 bg-[#2563EB] text-white rounded-[12px] font-semibold text-[16px] flex items-center justify-center gap-2 shadow-md hover:bg-[#1E40AF] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Message Seller
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBuyNow}
                disabled={requestSent}
                className={`flex-1 py-3.5 rounded-[12px] font-semibold text-[16px] flex items-center justify-center gap-2 border-2 transition-all ${
                  requestSent
                    ? "bg-[#10B981] border-[#10B981] text-white"
                    : "border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                }`}
              >
                {requestSent ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      ✓
                    </motion.div>
                    Request Sent
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Buy Now
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}