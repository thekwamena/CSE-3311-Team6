import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MapPin, ShieldCheck, Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { addReview, getListingsBySellerId, getSellerById, getSellerReviews } from "../data/marketplaceStore";

function formatDate(value) {
  if (!value) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function StarRow({ rating }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-[#F59E0B]">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < Math.round(rating) ? "fill-current" : ""}`}
        />
      ))}
    </span>
  );
}

export default function SellerProfileScreen() {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [seller, setSeller] = useState(null);
  const [sellerListings, setSellerListings] = useState([]);
  const [isLoadingSeller, setIsLoadingSeller] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setIsLoadingSeller(true);
    Promise.all([getSellerById(sellerId), getListingsBySellerId(sellerId)])
      .then(([nextSeller, nextListings]) => {
        if (!isMounted) {
          return;
        }

        setSeller(nextSeller || null);
        setSellerListings(nextListings);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingSeller(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [sellerId]);

  useEffect(() => {
    let isMounted = true;

    setIsLoadingReviews(true);
    getSellerReviews(sellerId)
      .then((nextReviews) => {
        if (isMounted) {
          setReviews(nextReviews);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingReviews(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [sellerId]);

  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + Number(review.rating), 0) / reviews.length
    : seller?.rating || 0;
  const hasReviewed = reviews.some((review) => review.reviewerId === user?.id);
  const isOwnProfile = sellerId === user?.id;

  const handleSubmitReview = async (event) => {
    event.preventDefault();
    setReviewError("");

    if (!user?.id) {
      setReviewError("You must be signed in to leave a review.");
      return;
    }

    if (isOwnProfile) {
      setReviewError("You cannot review your own account.");
      return;
    }

    setIsSubmittingReview(true);

    try {
      const newReview = await addReview({
        sellerId,
        reviewerId: user.id,
        reviewerName: user.fullName || user.email,
        listingId: sellerListings[0]?.id,
        rating: selectedRating,
        comment: reviewComment,
      });

      setReviews((currentReviews) => [newReview, ...currentReviews]);
      setReviewComment("");
      setSelectedRating(5);
      toast.success("Review posted.");
    } catch (error) {
      setReviewError(error.message || "Could not post review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoadingSeller) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] p-6">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 text-center shadow-sm">
          Loading seller profile...
        </div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] p-6">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 text-center shadow-sm">
          Seller not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#2563EB]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              src={seller.avatar}
              alt={seller.name}
              className="h-24 w-24 rounded-full border border-[#E5E7EB] object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#111827]">{seller.name}</h1>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#2563EB]">
                <ShieldCheck className="h-4 w-4" />
                Verified UTA student seller
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#4B5563]">
                <StarRow rating={averageRating} />
                <span className="font-semibold text-[#111827]">{averageRating.toFixed(1)}</span>
                <span>{reviews.length} reviews</span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,0.8fr]">
          <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-[#111827]">Reviews</h2>
            <form onSubmit={handleSubmitReview} className="mt-4 rounded-xl border border-[#DBEAFE] bg-[#F8FAFC] p-4">
              <h3 className="text-sm font-semibold text-[#111827]">Write a review</h3>
              {isOwnProfile ? (
                <p className="mt-2 text-sm text-[#6B7280]">This is your account, so reviews are disabled here.</p>
              ) : hasReviewed ? (
                <p className="mt-2 text-sm text-[#6B7280]">You already reviewed this seller.</p>
              ) : (
                <>
                  <div className="mt-3 flex items-center gap-2">
                    {Array.from({ length: 5 }, (_, index) => {
                      const value = index + 1;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setSelectedRating(value)}
                          className="text-[#F59E0B] transition hover:scale-105"
                          aria-label={`${value} star rating`}
                        >
                          <Star className={`h-6 w-6 ${value <= selectedRating ? "fill-current" : ""}`} />
                        </button>
                      );
                    })}
                    <span className="text-sm font-medium text-[#4B5563]">{selectedRating} stars</span>
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(event) => {
                      setReviewComment(event.target.value);
                      setReviewError("");
                    }}
                    rows={4}
                    className="mt-3 w-full resize-none rounded-lg border border-[#CBD5E1] bg-white p-3 text-sm text-[#111827] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE]"
                    placeholder="Share how the meetup, communication, and item condition went."
                  />
                  {reviewError && <p className="mt-2 text-sm text-[#DC2626]">{reviewError}</p>}
                  <button
                    type="submit"
                    disabled={isSubmittingReview || !reviewComment.trim()}
                    className="mt-3 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1E40AF] disabled:cursor-not-allowed disabled:bg-[#CBD5E1]"
                  >
                    {isSubmittingReview ? "Posting..." : "Post Review"}
                  </button>
                </>
              )}
            </form>
            {isLoadingReviews ? (
              <p className="mt-4 text-sm text-[#6B7280]">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="mt-4 text-sm text-[#6B7280]">No reviews yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <article key={review.id} className="rounded-xl border border-[#E5E7EB] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{review.reviewerName}</p>
                        <p className="text-xs text-[#6B7280]">{formatDate(review.createdAt)}</p>
                      </div>
                      <StarRow rating={Number(review.rating)} />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#4B5563]">{review.comment}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-[#111827]">Listings</h2>
            <div className="mt-4 space-y-3">
              {sellerListings.map((listing) => (
                <button
                  key={listing.id}
                  onClick={() => navigate(`/item/${listing.id}`)}
                  className="flex w-full gap-3 rounded-xl border border-[#E5E7EB] p-3 text-left transition hover:bg-[#F9FAFB]"
                >
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[#111827]">{listing.title}</p>
                    <p className="mt-1 text-sm font-bold text-[#2563EB]">${listing.price}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#6B7280]">
                      <MapPin className="h-3.5 w-3.5" />
                      {listing.location}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
