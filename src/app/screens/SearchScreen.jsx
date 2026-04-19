import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Search, X } from "lucide-react";
import { getListings } from "../data/marketplaceStore";

export default function SearchScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const listings = useMemo(() => getListings(), []);

  const filteredListings = searchQuery
    ? listings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-[#F4F6F9] p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-4 shadow-sm sm:p-6">
        <h1 className="mb-4 text-2xl font-bold text-[#111827]">Search listings</h1>

        <div className="mb-6 flex items-center gap-2 rounded-xl border border-[#D1D5DB] px-3 py-2">
          <Search className="h-4 w-4 text-[#9CA3AF]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Try 'textbook' or 'desk'"
            className="w-full text-sm focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-[#9CA3AF]">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {searchQuery && (
          <p className="mb-3 text-xs text-[#6B7280]">{filteredListings.length} results</p>
        )}

        <div className="space-y-3">
          {filteredListings.map((listing) => (
            <button
              key={listing.id}
              onClick={() => navigate(`/item/${listing.id}`)}
              className="flex w-full items-center gap-3 rounded-xl border border-[#E5E7EB] p-3 text-left hover:bg-[#F9FAFB]"
            >
              <img src={listing.images[0]} alt={listing.title} className="h-14 w-14 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#111827]">{listing.title}</p>
                <p className="truncate text-xs text-[#6B7280]">{listing.description}</p>
              </div>
              <p className="text-sm font-bold text-[#2563EB]">${listing.price}</p>
            </button>
          ))}
        </div>

        {searchQuery && filteredListings.length === 0 && (
          <p className="py-10 text-center text-sm text-[#6B7280]">No results found.</p>
        )}

        <div className="mt-6 text-center">
          <button onClick={() => navigate("/browse")} className="text-sm font-medium text-[#2563EB]">Back to browse</button>
        </div>
      </div>
    </div>
  );
}