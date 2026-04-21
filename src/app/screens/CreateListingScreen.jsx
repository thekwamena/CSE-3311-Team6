import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { addListing, getListingById, updateListing } from "../data/marketplaceStore";
import { useAuth } from "../context/AuthContext";

const categories = ["Books", "Furniture", "Electronics", "Other"];

export default function CreateListingScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEditing = Boolean(id);
  const [existingListing, setExistingListing] = useState(null);
  const [isLoadingListing, setIsLoadingListing] = useState(isEditing);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Books",
    location: "UTA Campus",
    distance: "0.5",
    images: [],
    imageUrl: "",
    imageFile: null,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!isEditing) {
      return undefined;
    }

    getListingById(id)
      .then((nextListing) => {
        if (!isMounted) {
          return;
        }

        setExistingListing(nextListing || null);
        if (nextListing) {
          setForm({
            title: nextListing.title || "",
            description: nextListing.description || "",
            price: nextListing.price ? String(nextListing.price) : "",
            category: nextListing.category || "Books",
            location: nextListing.location || "UTA Campus",
            distance: nextListing.distance ? String(nextListing.distance) : "0.5",
            images: nextListing.images || [],
            imageUrl: nextListing.images?.[0] || "",
            imageFile: null,
          });
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
  }, [id, isEditing]);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setForm((current) => ({
      ...current,
      images: [previewUrl],
      imageUrl: "",
      imageFile: file,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.price ||
      (!form.imageFile && !form.imageUrl && form.images.length === 0)
    ) {
      setError("Please fill all required fields and upload at least one image.");
      return;
    }

    if (Number(form.price) > 1000) {
      setError("Listing price cannot be over $1000.");
      return;
    }

    try {
      if (isEditing) {
        const updated = await updateListing(id, form, user);
        toast.success("Listing updated successfully.");
        navigate(`/item/${updated.id}`);
        return;
      }

      const created = await addListing(form, user);
      toast.success("Listing created successfully.");
      navigate(`/item/${created.id}`);
    } catch (error) {
      setError(error.message || "Could not save listing.");
    }
  };

  if (isLoadingListing) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-center shadow-sm">
          Loading listing...
        </div>
      </div>
    );
  }

  if (isEditing && !existingListing) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-center shadow-sm">
          Listing not found.
        </div>
      </div>
    );
  }

  if (isEditing && existingListing?.seller.id !== user?.id) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] px-4 py-8">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-center shadow-sm">
          You can only edit your own listings.
        </div>
      </div>
    );
  }

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

        <h1 className="mb-1 text-2xl font-bold text-[#111827]">
          {isEditing ? "Edit listing" : "Create a listing"}
        </h1>
        <p className="mb-6 text-sm text-[#6B7280]">
          {isEditing ? "Update your post details." : "Share your item with the UTA community."}
        </p>

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
                max="1000"
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
              {form.images[0] ? "Change image" : "Upload image"}
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
            {isEditing ? "Save changes" : "Publish listing"}
          </button>
        </form>
      </div>
    </div>
  );
}

