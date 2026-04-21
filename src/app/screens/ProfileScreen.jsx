import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Mail, ShieldCheck, Settings, ArrowLeft, List, Star, Camera } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { upsertProfile, uploadProfileImage } from "../data/profileStore";
import { getSellerReviews } from "../data/marketplaceStore";

export default function ProfileScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, updateUserProfile } = useAuth();
  const [ratingSummary, setRatingSummary] = useState({
    averageRating: 0,
    reviewCount: 0,
  });
  const [isUploadingProfilePicture, setIsUploadingProfilePicture] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!user?.id) {
      return undefined;
    }

    getSellerReviews(user.id).then((reviews) => {
      if (!isMounted) {
        return;
      }

      const reviewCount = reviews.length;
      const averageRating = reviewCount
        ? reviews.reduce((total, review) => total + Number(review.rating), 0) / reviewCount
        : 0;

      setRatingSummary({ averageRating, reviewCount });
    });

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file || !user?.id) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    setIsUploadingProfilePicture(true);

    try {
      const avatarUrl = await uploadProfileImage(file, user.id);
      const profileRow = await upsertProfile({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl,
      });

      updateUserProfile({
        ...user,
        fullName: profileRow.full_name || user.fullName,
        profilePicture: profileRow.avatar_url || avatarUrl,
      });
      toast.success("Profile photo updated.");
    } catch (error) {
      toast.error(error.message || "Could not update your profile photo.");
    } finally {
      setIsUploadingProfilePicture(false);
      event.target.value = "";
    }
  };

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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative"
            disabled={isUploadingProfilePicture}
          >
            <img
              src={
                user?.profilePicture ||
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
              }
              alt="Profile"
              className="h-20 w-20 rounded-full border border-[#E5E7EB] object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition group-hover:opacity-100">
              <Camera className="h-4 w-4" />
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
            />
          </button>
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
            <p className="mt-1 inline-flex items-center gap-2 text-xs font-medium text-[#92400E]">
              <Star className="h-4 w-4 fill-current text-[#F59E0B]" />
              {ratingSummary.reviewCount > 0
                ? `${ratingSummary.averageRating.toFixed(1)} rating (${ratingSummary.reviewCount} reviews)`
                : "No ratings yet"}
            </p>
            <p className="mt-1 text-xs text-[#6B7280]">
              {isUploadingProfilePicture ? "Uploading photo..." : "Click your photo to change it"}
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
            onClick={() => navigate("/my-listings")}
            className="rounded-xl border border-[#E5E7EB] p-4 text-left hover:bg-[#F9FAFB] sm:col-span-2"
          >
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#111827]">
              <List className="h-4 w-4" /> My Listings
            </p>
            <p className="text-xs text-[#6B7280]">View, edit, or delete your posts</p>
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
