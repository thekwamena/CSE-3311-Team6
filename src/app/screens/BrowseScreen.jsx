import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Search, Plus, MapPin, Star, Shield, MessageCircle, User, LogOut, SlidersHorizontal } from "lucide-react";
import { getListings } from "../data/marketplaceStore";
import { useAuth } from "../context/AuthContext";

export default function BrowseScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [listings, setListings] = useState([]);
  const [isLoadingListings, setIsLoadingListings] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1000);

  useEffect(() => {
    let isMounted = true;

    getListings()
      .then((nextListings) => {
        if (isMounted) {
          setListings(nextListings);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingListings(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ["All", ...new Set(listings.map((item) => item.category))];

  const filteredListings = useMemo(() => listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || listing.category === activeCategory;
    const matchesPrice = Number(listing.price) <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  }), [activeCategory, listings, maxPrice, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-[#EEF2FF]">
      <header className="border-b border-[#E2E8F0] bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 py-4">
          <div className="mr-auto">
            <h1 className="text-xl font-bold text-[#0F172A]">MaverickMarket</h1>
            <p className="text-xs text-[#64748B]">Campus marketplace for UTA students</p>
          </div>
          <button
            onClick={() => navigate("/messages")}
            className="rounded-xl border border-[#E2E8F0] p-2 text-[#475569] transition hover:bg-[#F8FAFC]"
            aria-label="Open messages"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="rounded-xl border border-[#E2E8F0] p-2 text-[#475569] transition hover:bg-[#F8FAFC]"
            aria-label="Open profile"
          >
            <User className="h-5 w-5" />
          </button>
          <button
            onClick={logout}
            className="rounded-xl border border-[#FECACA] px-3 py-2 text-sm font-medium text-[#DC2626] transition hover:bg-[#FEF2F2]"
          >
            <span className="inline-flex items-center gap-1">
              <LogOut className="h-4 w-4" /> Logout
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8">
        <div className="mb-5 rounded-2xl border border-[#DBEAFE] bg-gradient-to-r from-[#EFF6FF] to-[#EEF2FF] p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-[#475569]">Welcome back</p>
          <p className="mt-1 text-lg font-semibold text-[#0F172A]">{user?.fullName || user?.email}</p>
        </div>

        <div className="mb-4 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#334155]">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search listings"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white py-2.5 pl-9 pr-4 text-sm text-[#0F172A] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE]"
              />
            </div>
            <button
              onClick={() => navigate("/create-listing")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1E40AF]"
            >
              <Plus className="h-4 w-4" />
              New Listing
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "border-[#1D4ED8] bg-[#1D4ED8] text-white"
                    : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
                }`}
              >
                {category}
              </button>
            ))}
            <div className="ml-auto w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 sm:w-64">
              <label className="mb-1 block text-xs font-medium text-[#64748B]">Max price: ${maxPrice}</label>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {isLoadingListings ? (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center text-[#64748B] shadow-sm">
            Loading listings...
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white p-10 text-center text-[#64748B] shadow-sm">
            No listings match these filters.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <button
                key={listing.id}
                onClick={() => navigate(`/item/${listing.id}`)}
                className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <img src={listing.images[0]} alt={listing.title} className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
                <div className="p-4">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <h2 className="line-clamp-1 text-base font-semibold text-[#0F172A]">{listing.title}</h2>
                    <span className="text-base font-bold text-[#1D4ED8]">${listing.price}</span>
                  </div>
                  <p className="line-clamp-2 text-sm text-[#64748B]">{listing.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-[#64748B]">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {listing.distance} mi
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-[#F59E0B]" /> {listing.seller.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-medium text-[#1D4ED8]">
                    <Shield className="h-3.5 w-3.5" /> Verified student seller
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
