import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { addListing } from "../data/marketplaceStore";
import { useAuth } from "../context/AuthContext";

const categories = ["Books", "Furniture", "Electronics", "Other"];

export default function CreateListingScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Books",
    location: "UTA Campus",
    distance: "0.5",
    images: [],
  });

  const [error, setError] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((current) => ({ ...current, images: [String(reader.result)] }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.price || form.images.length === 0) {
      setError("Please fill all required fields and upload at least one image.");
      return;
    }

    const created = addListing(form, user);
    toast.success("Listing created successfully.");
    navigate(`/item/${created.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] px-4 py-8">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#2563EB]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="mb-1 text-2xl font-bold text-[#111827]">Create a listing</h1>
        <p className="mb-6 text-sm text-[#6B7280]">Share your item with the UTA community.</p>

        {error && <p className="mb-4 rounded-lg bg-[#FEE2E2] p-3 text-sm text-[#991B1B]">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">Title *</label>
            <input
              value={form.title}
              onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
              className="w-full rounded-xl border border-[#D1D5DB] px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none"
              placeholder="e.g., Calculus textbook"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              rows={4}
              className="w-full rounded-xl border border-[#D1D5DB] px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none"
              placeholder="Condition, course, pickup details..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#374151]">Price (USD) *</label>
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))}
                className="w-full rounded-xl border border-[#D1D5DB] px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#374151]">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))}
                className="w-full rounded-xl border border-[#D1D5DB] px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">Pickup location</label>
            <input
              value={form.location}
              onChange={(e) => setForm((current) => ({ ...current, location: e.target.value }))}
              className="w-full rounded-xl border border-[#D1D5DB] px-4 py-3 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#374151]">Item image *</label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#2563EB] p-4 text-sm font-medium text-[#2563EB] hover:bg-[#EFF6FF]">
              <ImagePlus className="h-4 w-4" />
              Upload image
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {form.images[0] && (
              <img src={form.images[0]} alt="Preview" className="mt-3 h-40 w-full rounded-xl object-cover" />
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1E40AF]"
          >
            Publish listing
          </button>
        </form>
      </div>
    </div>
  );
}

