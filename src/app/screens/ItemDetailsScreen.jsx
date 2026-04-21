import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MessageCircle, ShoppingCart, MapPin, Shield, Star, X } from "lucide-react";
import { toast } from "sonner";
import { getListingById } from "../data/marketplaceStore";

export default function ItemDetailsScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [requestSent, setRequestSent] = useState(false);
  const [listing, setListing] = useState(null);
  const [isLoadingListing, setIsLoadingListing] = useState(true);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getListingById(id)
      .then((nextListing) => {
        if (isMounted) {
          setListing(nextListing || null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingListing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!isImageViewerOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsImageViewerOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isImageViewerOpen]);

  if (isLoadingListing) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] p-6">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 text-center shadow-sm">Loading listing...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] p-6">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 text-center shadow-sm">Listing not found.</div>
      </div>
    );
  }

  const handleBuyNow = () => {
    setRequestSent(true);
    toast.success("Purchase request sent to seller.");
    setTimeout(() => {
      navigate("/success", { state: { type: "purchase", listing } });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <button onClick={() => navigate("/browse")} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#2563EB]">
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </button>

        <div className="grid gap-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-[1.1fr,1fr]">
          <button
            type="button"
            onClick={() => setIsImageViewerOpen(true)}
            className="group relative overflow-hidden rounded-xl"
          >
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="h-72 w-full rounded-xl object-cover transition duration-200 group-hover:scale-[1.01] sm:h-96"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 py-4 text-left text-sm font-medium text-white">
              Click to view full image
            </span>
          </button>

          <div>
            <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-medium text-[#2563EB]">
              <Shield className="h-3.5 w-3.5" /> Verified listing
            </p>
            <h1 className="text-2xl font-bold text-[#111827]">{listing.title}</h1>
            <p className="mt-1 text-3xl font-bold text-[#2563EB]">${listing.price}</p>

            <p className="mt-4 text-sm leading-6 text-[#4B5563]">{listing.description}</p>

            <div className="mt-5 rounded-xl border border-[#E5E7EB] p-4">
              <h2 className="mb-3 text-sm font-semibold text-[#111827]">Seller</h2>
              <button
                onClick={() => navigate(`/users/${listing.seller.id}`)}
                className="flex w-full items-center gap-3 rounded-lg text-left transition hover:bg-[#F9FAFB]"
              >
                <img src={listing.seller.avatar} alt={listing.seller.name} className="h-11 w-11 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{listing.seller.name}</p>
                  <p className="inline-flex items-center gap-1 text-xs text-[#6B7280]"><Star className="h-3.5 w-3.5 text-[#F59E0B]" /> {listing.seller.rating.toFixed(1)} rating</p>
                </div>
              </button>
              <p className="mt-3 inline-flex items-center gap-1 text-xs text-[#6B7280]"><MapPin className="h-3.5 w-3.5" /> {listing.distance} mi away - {listing.location}</p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button onClick={() => navigate(`/chat/${listing.id}`)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1E40AF]">
                <MessageCircle className="h-4 w-4" />
                Message Seller
              </button>
              <button
                onClick={handleBuyNow}
                disabled={requestSent}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2563EB] px-4 py-3 text-sm font-semibold text-[#2563EB] hover:bg-[#EFF6FF] disabled:cursor-not-allowed disabled:border-[#A7F3D0] disabled:bg-[#ECFDF5] disabled:text-[#059669]"
              >
                <ShoppingCart className="h-4 w-4" />
                {requestSent ? "Request Sent" : "Buy Now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isImageViewerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setIsImageViewerOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsImageViewerOpen(false)}
            className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80"
            aria-label="Close image viewer"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="max-h-[90vh] w-full max-w-6xl rounded-xl object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
