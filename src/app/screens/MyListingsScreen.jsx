import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Edit, Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteListing, getListingsByUserId } from "../data/marketplaceStore";
import { useAuth } from "../context/AuthContext";

export default function MyListingsScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const listings = useMemo(
    () => (user?.id ? getListingsByUserId(user.id) : []),
    [user?.id, refreshKey]
  );

  const handleDelete = (listing) => {
    const confirmed = window.confirm(`Delete "${listing.title}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    try {
      deleteListing(listing.id, user);
      setRefreshKey((value) => value + 1);
      toast.success("Listing deleted.");
    } catch (error) {
      toast.error(error.message || "Could not delete listing.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/profile")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#2563EB]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </button>

        <div className="mb-5 flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">My listings</h1>
            <p className="mt-1 text-sm text-[#6B7280]">Edit or remove items you posted.</p>
          </div>
          <button
            onClick={() => navigate("/create-listing")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1E40AF]"
          >
            <Plus className="h-4 w-4" />
            New Listing
          </button>
        </div>

        {listings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-[#111827]">No listings yet</p>
            <p className="mt-1 text-sm text-[#6B7280]">Create a post and it will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing) => (
              <article
                key={listing.id}
                className="grid gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:grid-cols-[8rem,1fr,auto]"
              >
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="h-32 w-full rounded-lg object-cover sm:h-32 sm:w-32"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-[#111827]">{listing.title}</h2>
                    <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-medium text-[#2563EB]">
                      {listing.category}
                    </span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-[#2563EB]">${listing.price}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#4B5563]">
                    {listing.description}
                  </p>
                  <p className="mt-2 text-xs text-[#6B7280]">{listing.location}</p>
                </div>
                <div className="flex gap-2 sm:flex-col sm:justify-center">
                  <button
                    onClick={() => navigate(`/item/${listing.id}`)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB] sm:flex-none"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/edit-listing/${listing.id}`)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#BFDBFE] px-3 py-2 text-sm font-semibold text-[#2563EB] hover:bg-[#EFF6FF] sm:flex-none"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(listing)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#FECACA] px-3 py-2 text-sm font-semibold text-[#DC2626] hover:bg-[#FEF2F2] sm:flex-none"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
