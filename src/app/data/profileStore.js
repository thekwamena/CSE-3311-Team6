import { supabase } from "../lib/supabaseClient";

const PROFILE_IMAGES_BUCKET = "profile-images";
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80";

function sanitizeProfileUrl(value) {
  if (!value || typeof value !== "string" || value.startsWith("data:")) {
    return null;
  }

  return value;
}

export async function ensureProfileBucketPublicUrl(filePath) {
  const { data } = supabase.storage.from(PROFILE_IMAGES_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

export async function uploadProfileImage(file, userId) {
  if (!supabase || !userId) {
    throw new Error("Supabase is not configured or you are not signed in.");
  }

  if (!file) {
    throw new Error("Please choose an image.");
  }

  const fileExtension = file.name?.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExtension}`;

  const { data: signedUpload, error: signedUploadError } = await supabase.storage
    .from(PROFILE_IMAGES_BUCKET)
    .createSignedUploadUrl(filePath);

  if (signedUploadError) {
    throw new Error(
      signedUploadError.message || "Could not create a signed upload URL for the profile image."
    );
  }

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_IMAGES_BUCKET)
    .uploadToSignedUrl(filePath, signedUpload.token, file, {
      cacheControl: "3600",
      contentType: file.type || "image/png",
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Could not upload profile image.");
  }

  return ensureProfileBucketPublicUrl(filePath);
}

export async function upsertProfile({ id, email, fullName, avatarUrl }) {
  if (!supabase || !id) {
    throw new Error("Supabase is not configured or you are not signed in.");
  }

  const payload = {
    id,
    email,
    full_name: fullName,
  };

  if (avatarUrl !== undefined) {
    payload.avatar_url = sanitizeProfileUrl(avatarUrl);
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Could not save profile.");
  }

  return data;
}

export async function getProfileById(userId) {
  if (!supabase || !userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}

export function mapProfileToUser(authUser, profileRow, fallbackProfilePicture = null) {
  return {
    id: authUser.id,
    email: authUser.email,
    fullName:
      profileRow?.full_name ||
      authUser.user_metadata?.full_name ||
      authUser.email?.split("@")[0],
    profilePicture:
      sanitizeProfileUrl(profileRow?.avatar_url) ||
      sanitizeProfileUrl(fallbackProfilePicture) ||
      DEFAULT_AVATAR,
  };
}

export { DEFAULT_AVATAR, PROFILE_IMAGES_BUCKET };
