import { mockListings, mockMessages, mockReviews } from "./mockData";
import { supabase } from "../lib/supabaseClient";

const LISTINGS_KEY = "marketplace:listings"; 
const CONVERSATIONS_KEY = "marketplace:conversations";
const REVIEWS_KEY = "marketplace:reviews";
const CONVERSATION_READS_KEY = "marketplace:conversationReads";
const LISTING_IMAGES_BUCKET = "listing-images";
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80";
  
function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value || ""
  ); 
}

function formatMessageTime(value) {
  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit", 
  });
} 
 
function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); 
}
 
function normalizeSeller(seller) {
  return {
    ...seller,
    id: seller.id || slugify(seller.name),  
  };
} 

function sanitizeImageUrl(value, fallback = null) {
  if (!value || typeof value !== "string") {
    return fallback;
  }

  if (value.startsWith("data:")) {
    return fallback;
  }

  return value;
}

async function getProfilesByIds(ids) {
  const uniqueIds = [...new Set((ids || []).filter(Boolean))];

  if (!supabase || uniqueIds.length === 0) {
    return new Map();
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", uniqueIds);

  if (error) {
    return new Map();
  }

  return new Map(
    data.map((profile) => [
      profile.id,
      {
        fullName: profile.full_name,
        avatarUrl: sanitizeImageUrl(profile.avatar_url, DEFAULT_AVATAR) || DEFAULT_AVATAR,
      },
    ])
  );
}

async function getSellerRatingsByIds(ids) {
  const uniqueIds = [...new Set((ids || []).filter(Boolean))];

  if (!supabase || uniqueIds.length === 0) {
    return new Map();
  }

  const { data, error } = await supabase
    .from("seller_ratings")
    .select("seller_id, average_rating, review_count")
    .in("seller_id", uniqueIds);

  if (error) {
    return new Map();
  }

  return new Map(
    data.map((row) => [
      row.seller_id,
      {
        averageRating: Number(row.average_rating || 0),
        reviewCount: Number(row.review_count || 0),
      },
    ])
  );
}

function getListingImageUrl(listingInput) {
  const candidate = listingInput.imageUrl || listingInput.images?.[0];
  return sanitizeImageUrl(candidate, null);
}

async function uploadListingImage(file, userProfile) {
  if (!supabase || !userProfile?.id) {
    throw new Error("Supabase is not configured or you are not signed in.");
  }

  if (!file) {
    throw new Error("Please upload an image for your listing.");
  }

  const fileExtension = file.name?.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `${userProfile.id}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${fileExtension}`;

  const { data: signedUpload, error: signedUploadError } = await supabase.storage
    .from(LISTING_IMAGES_BUCKET)
    .createSignedUploadUrl(filePath);

  if (signedUploadError) {
    throw new Error(
      signedUploadError.message || "Could not create a signed upload URL for the listing image."
    );
  }

  const { error: uploadError } = await supabase.storage
    .from(LISTING_IMAGES_BUCKET)
    .uploadToSignedUrl(filePath, signedUpload.token, file, {
      cacheControl: "3600",
      contentType: file.type || "image/png",
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Could not upload listing image.");
  }

  const { data } = supabase.storage.from(LISTING_IMAGES_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

function getLocalListings() {
  ensureSeedData();
  return readJson(LISTINGS_KEY, mockListings).map((listing) => ({
    ...listing,
    seller: normalizeSeller(listing.seller),
  }));
}

function mapDatabaseListing(listing) {
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price: Number(listing.price),
    category: listing.category,
    images: [listing.image_url].filter(Boolean),
    seller: {
      id: listing.seller_id,
      name: listing.seller_name || "UTA Student",
      rating: Number(listing.seller_rating || 0),
      avatar:
        listing.seller_avatar ||
        DEFAULT_AVATAR,
      verified: true,
    },
    distance: Number(listing.distance || 0.5),
    location: listing.location || "UTA Campus",
    createdAt: listing.created_at ? new Date(listing.created_at).getTime() : Date.now(),
    updatedAt: listing.updated_at ? new Date(listing.updated_at).getTime() : undefined,
  };
}

async function enrichDatabaseListings(listings) {
  if (!Array.isArray(listings) || listings.length === 0) {
    return [];
  }

  const sellerIds = listings.map((listing) => listing.seller.id).filter(Boolean);
  const [profileMap, ratingMap] = await Promise.all([
    getProfilesByIds(sellerIds),
    getSellerRatingsByIds(sellerIds),
  ]);

  return listings.map((listing) => {
    const sellerProfile = profileMap.get(listing.seller.id);
    const sellerRating = ratingMap.get(listing.seller.id);

    return {
      ...listing,
      seller: {
        ...listing.seller,
        name: sellerProfile?.fullName || listing.seller.name,
        avatar: sellerProfile?.avatarUrl || sanitizeImageUrl(listing.seller.avatar, DEFAULT_AVATAR) || DEFAULT_AVATAR,
        rating: sellerRating?.averageRating ?? listing.seller.rating,
        reviewCount: sellerRating?.reviewCount ?? listing.seller.reviewCount ?? 0,
      },
    };
  });
}

async function getDatabaseListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return enrichDatabaseListings(data.map(mapDatabaseListing));
}

function readJson(key, fallback) {
  try { 
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback; 
  } catch {
    return fallback;
  }
}
 
function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}  

function getConversationReadsKey(userId) {
  return `${CONVERSATION_READS_KEY}:${userId}`;
}

function getConversationReads(userId) {
  if (!userId) {
    return {};
  }

  return readJson(getConversationReadsKey(userId), {});
}

function setConversationReads(userId, reads) {
  if (!userId) {
    return;
  }

  writeJson(getConversationReadsKey(userId), reads);
}

function getConversationLastMessageTime(conversation) {
  const lastMessage = conversation?.messages?.[conversation.messages.length - 1];
  if (lastMessage?.createdAt) {
    return new Date(lastMessage.createdAt).getTime();
  }

  return Number(conversation?.updatedAt || 0);
}

function getInitialConversations() {
  return mockListings.slice(0, 3).map((listing, index) => ({
    id: String(index + 1), 
    listingId: listing.id,
    participantName: listing.seller.name,
    updatedAt: Date.now() - index * 1000 * 60 * 60,  
    messages: mockMessages,
  }));
}

export function ensureSeedData() {
  if (!localStorage.getItem(LISTINGS_KEY)) {
    writeJson(LISTINGS_KEY, mockListings); 
  }
  if (!localStorage.getItem(CONVERSATIONS_KEY)) {
    writeJson(CONVERSATIONS_KEY, getInitialConversations()); 
  }
  if (!localStorage.getItem(REVIEWS_KEY)) {
    writeJson(REVIEWS_KEY, mockReviews);  
  }
}
 
export async function getListings() {
  if (!supabase) {
    return getLocalListings();
  }

  try {
    return await getDatabaseListings();
  } catch {
    return getLocalListings();
  }
}

export async function getListingById(id) { 
  if (!supabase) {
    return getLocalListings().find((listing) => listing.id === id);
  }

  try {
    const { data, error } = await supabase.from("listings").select("*").eq("id", id).single();

    if (error) {
      throw error;
    }

    const [listing] = await enrichDatabaseListings([mapDatabaseListing(data)]);
    return listing;
  } catch {
    return getLocalListings().find((listing) => listing.id === id);
  }
}

export async function getSellerById(sellerId) {
  const listings = await getListingsBySellerId(sellerId);
  return listings[0]?.seller || null;
}

export async function getListingsBySellerId(sellerId) { 
  if (!supabase) {
    return getLocalListings().filter((listing) => listing.seller.id === sellerId);
  }

  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return enrichDatabaseListings(data.map(mapDatabaseListing));
  } catch {
    return getLocalListings().filter((listing) => listing.seller.id === sellerId);
  }
}

export async function getListingsByUserId(userId) {
  return getListingsBySellerId(userId);  
}

export async function addListing(listingInput, userProfile) { 
  const imageUrl = listingInput.imageFile
    ? await uploadListingImage(listingInput.imageFile, userProfile)
    : getListingImageUrl(listingInput);

  if (!imageUrl) {
    throw new Error("Please upload an image for your listing.");
  }

  const newListing = {
    title: listingInput.title.trim(),
    description: listingInput.description.trim(),
    price: Number(listingInput.price), 
    category: listingInput.category,
    images: [imageUrl],  
    seller: {
      id: userProfile?.id || slugify(userProfile?.fullName || "UTA Student"),
      name: userProfile?.fullName || "UTA Student",
      rating: 5, 
      avatar: userProfile?.profilePicture || DEFAULT_AVATAR,
      verified: true,
    },
    distance: Number(listingInput.distance || 0.5), 
    location: listingInput.location || "UTA Campus",
    createdAt: Date.now(), 
  };

  if (!supabase || !userProfile?.id) {
    throw new Error("Supabase is not configured or you are not signed in.");
  }

  const { data, error } = await supabase
    .from("listings")
      .insert({
        seller_id: userProfile.id,
        seller_name: newListing.seller.name,
        seller_avatar: sanitizeImageUrl(newListing.seller.avatar, DEFAULT_AVATAR),
        title: newListing.title,
        description: newListing.description,
        price: newListing.price,
      category: newListing.category,
      image_url: imageUrl,
      location: newListing.location,
      distance: newListing.distance,
      })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Could not save listing to Supabase.");
  }

  const [listing] = await enrichDatabaseListings([mapDatabaseListing(data)]);
  return listing;
}

export async function updateListing(listingId, listingInput, userProfile) {
  const existingListing = await getListingById(listingId);

  if (!existingListing) { 
    throw new Error("Listing not found.");
  } 

  if (existingListing.seller.id !== userProfile?.id) {
    throw new Error("You can only edit your own listings."); 
  }

  const imageUrl = listingInput.imageFile
    ? await uploadListingImage(listingInput.imageFile, userProfile)
    : getListingImageUrl(listingInput) || existingListing.images[0];

  const updatedListing = {
    ...existingListing, 
    title: listingInput.title.trim(),
    description: listingInput.description.trim(),
    price: Number(listingInput.price), 
    category: listingInput.category,
    images: [imageUrl],
    distance: Number(listingInput.distance || existingListing.distance || 0.5), 
    location: listingInput.location || "UTA Campus",
    updatedAt: Date.now(),
  };

  if (!supabase || !userProfile?.id || !isUuid(listingId)) {
    const nextListings = getLocalListings().map((listing) =>  
      listing.id === listingId ? updatedListing : listing
    );
    writeJson(LISTINGS_KEY, nextListings);
    return updatedListing;
  }

  try {
    const { data, error } = await supabase
      .from("listings")
      .update({
        title: updatedListing.title,
        description: updatedListing.description,
        price: updatedListing.price,
        category: updatedListing.category,
        image_url: imageUrl,
        location: updatedListing.location,
        distance: updatedListing.distance,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId)
      .eq("seller_id", userProfile.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const [listing] = await enrichDatabaseListings([mapDatabaseListing(data)]);
    return listing;
  } catch {
    const nextListings = getLocalListings().map((listing) =>  
      listing.id === listingId ? updatedListing : listing
    );
    writeJson(LISTINGS_KEY, nextListings);
    return updatedListing;
  }
} 

export async function deleteListing(listingId, userProfile) { 
  const existingListing = await getListingById(listingId);  

  if (!existingListing) {
    throw new Error("Listing not found."); 
  }

  if (existingListing.seller.id !== userProfile?.id) {
    throw new Error("You can only delete your own listings.");  
  }

  if (!supabase || !userProfile?.id || !isUuid(listingId)) {
    const nextListings = getLocalListings().filter((listing) => listing.id !== listingId);
    const nextConversations = getConversations().filter(
      (conversation) => conversation.listingId !== listingId 
    );
    writeJson(LISTINGS_KEY, nextListings);
    writeJson(CONVERSATIONS_KEY, nextConversations);
    return;
  }

  try {
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", listingId)
      .eq("seller_id", userProfile.id);

    if (error) {
      throw error;
    }
  } catch {
    const nextListings = getLocalListings().filter((listing) => listing.id !== listingId);
    const nextConversations = getConversations().filter(
      (conversation) => conversation.listingId !== listingId 
    );
    writeJson(LISTINGS_KEY, nextListings);
    writeJson(CONVERSATIONS_KEY, nextConversations);
  }
}
  
export function getConversations() {
  ensureSeedData(); 
  return readJson(CONVERSATIONS_KEY, getInitialConversations());
}

function mapDatabaseConversation(conversation, currentUserId, profileMap = new Map()) {
  const messages = conversation.chat_messages || [];
  const isBuyerView = conversation.buyer_id === currentUserId;
  const participantId = isBuyerView ? conversation.seller_id : conversation.buyer_id;
  const participantProfile = profileMap.get(participantId);
  const sellerProfile = profileMap.get(conversation.seller_id);
  
  return {
    id: conversation.id,
    listingId: conversation.listing_id,
    participantId,
    participantName:
      participantProfile?.fullName ||
      (isBuyerView ? conversation.seller_name : conversation.buyer_name) ||
      "UTA Student",
    participantAvatar:
      participantProfile?.avatarUrl ||
      (isBuyerView
        ? sanitizeImageUrl(conversation.seller_avatar, DEFAULT_AVATAR)
        : DEFAULT_AVATAR) ||
      DEFAULT_AVATAR,
    updatedAt: new Date(conversation.updated_at || conversation.created_at).getTime(),  
    listing: {
      id: conversation.listing_id,
      title: conversation.listing_title,
      images: [conversation.listing_image_url],
      seller: {
        id: conversation.seller_id,
        name: conversation.seller_name, 
        avatar:
          sellerProfile?.avatarUrl ||
          sanitizeImageUrl(conversation.seller_avatar, DEFAULT_AVATAR) ||
          DEFAULT_AVATAR,
      },
    },
    messages: messages.map((message) => ({
      id: message.id,
      sender: message.sender_id === currentUserId ? "user" : "seller",
      text: message.body,  
      timestamp: formatMessageTime(message.created_at),
      createdAt: message.created_at,
    })),
  };
} 

export async function getConversationsForUser(userProfile) {  
  if (!supabase || !userProfile?.id) {
    return getConversations();
  }

  try { 
    const { data, error } = await supabase
      .from("chat_conversations")
      .select(`
        *, 
        chat_messages (
          id,
          sender_id,
          body,
          created_at
        )
      `)
      .or(`buyer_id.eq.${userProfile.id},seller_id.eq.${userProfile.id}`)  
      .order("updated_at", { ascending: false })
      .order("created_at", { referencedTable: "chat_messages", ascending: true });

    if (error) {
      return getConversations();
    }

    const profileMap = await getProfilesByIds(
      data.flatMap((conversation) => [conversation.seller_id, conversation.buyer_id])
    );

    return data.map((conversation) =>
      mapDatabaseConversation(conversation, userProfile.id, profileMap)
    ); 
  } catch {
    return getConversations();
  }  
} 

export async function getUnreadConversationCount(userProfile) {
  if (!userProfile?.id) {
    return 0;
  }

  const conversations = await getConversationsForUser(userProfile);
  const reads = getConversationReads(userProfile.id);

  return conversations.filter((conversation) => {
    const lastMessage = conversation.messages?.[conversation.messages.length - 1];
    if (!lastMessage || lastMessage.sender === "user") {
      return false;
    }

    const lastMessageTime = getConversationLastMessageTime(conversation);
    const lastReadTime = Number(reads[conversation.id] || 0);
    return lastMessageTime > lastReadTime;
  }).length;
}

export function markConversationsRead(userProfile, conversations) {
  if (!userProfile?.id || !Array.isArray(conversations) || conversations.length === 0) {
    return;
  }

  const reads = getConversationReads(userProfile.id);
  const nextReads = { ...reads };

  conversations.forEach((conversation) => {
    if (!conversation?.id) {
      return;
    }

    const lastMessageTime = getConversationLastMessageTime(conversation);
    if (lastMessageTime > 0) {
      nextReads[conversation.id] = lastMessageTime;
    }
  });

  setConversationReads(userProfile.id, nextReads);
}

async function getOrCreateDatabaseConversation(listingId, userProfile) {
  const listing = await getListingById(listingId);
 
  if (!supabase || !userProfile?.id || !listing) {
    return null; 
  }
  
  try {
    const { data: existingConversation, error: existingError } = await supabase
      .from("chat_conversations")
      .select("*") 
      .eq("listing_id", listingId)  
      .or(`buyer_id.eq.${userProfile.id},seller_id.eq.${userProfile.id}`)
      .maybeSingle();

    if (existingError) { 
      throw existingError;
    }

    if (existingConversation) {  
      return existingConversation;
    }

    const { data: createdConversation, error: createError } = await supabase
      .from("chat_conversations") 
      .insert({
        listing_id: listingId, 
        listing_title: listing.title,
        listing_image_url: listing.images[0],
        seller_id: isUuid(listing.seller.id) ? listing.seller.id : null,
        seller_key: listing.seller.id,  
        seller_name: listing.seller.name,
        seller_avatar: listing.seller.avatar, 
        buyer_id: userProfile.id,
        buyer_name: userProfile.fullName || userProfile.email || "UTA Student",
      })
      .select()
      .single(); 

    if (createError) {
      throw createError; 
    }

    return createdConversation;
  } catch { 
    return null;
  }  
}

async function getDatabaseConversationById(conversationId, userProfile) {
  if (!supabase || !userProfile?.id || !conversationId) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("chat_conversations")
      .select(`
        *,
        chat_messages (
          id,
          sender_id,
          body,
          created_at
        )
      `)
      .eq("id", conversationId)
      .or(`buyer_id.eq.${userProfile.id},seller_id.eq.${userProfile.id}`)
      .order("created_at", { referencedTable: "chat_messages", ascending: true })
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const profileMap = await getProfilesByIds([data.seller_id, data.buyer_id]);
    return mapDatabaseConversation(data, userProfile.id, profileMap);
  } catch {
    return null;
  }
}

export async function getConversationByListingIdForUser(
  listingId,
  userProfile,
  conversationId = null
) {
  if (!supabase || !userProfile?.id) {
    return getConversationByListingId(listingId); 
  }

  if (conversationId) {
    const matchedConversation = await getDatabaseConversationById(conversationId, userProfile);
    if (matchedConversation) {
      return matchedConversation;
    }
  }

  const conversation = await getOrCreateDatabaseConversation(listingId, userProfile);
  if (!conversation) {
    return getConversationByListingId(listingId);
  }  
 
  try {
    const { data, error } = await supabase
      .from("chat_conversations") 
      .select(`
        *,
        chat_messages ( 
          id,
          sender_id,
          body,  
          created_at
        )
      `)
      .eq("id", conversation.id)
      .order("created_at", { referencedTable: "chat_messages", ascending: true })
      .single();
 
    if (error) {
      return getConversationByListingId(listingId);
    }

    const profileMap = await getProfilesByIds([data.seller_id, data.buyer_id]);

    return mapDatabaseConversation(data, userProfile.id, profileMap);
  } catch {
    return getConversationByListingId(listingId); 
  }
}
 
export async function addReview({ sellerId, reviewerId, reviewerName, listingId, rating, comment }) {
  ensureSeedData();

  const cleanComment = comment.trim();
  const numericRating = Number(rating);

  if (!sellerId || !reviewerId) {  
    throw new Error("You must be signed in to leave a review.");
  } 

  if (sellerId === reviewerId) {
    throw new Error("You cannot review your own account.");  
  }

  if (numericRating < 1 || numericRating > 5) {
    throw new Error("Review rating must be between 1 and 5 stars."); 
  }

  if (!cleanComment) {
    throw new Error("Please write a short review.");
  }

  const localReviews = readJson(REVIEWS_KEY, mockReviews); 
  const alreadyReviewed = localReviews.some(
    (review) => review.sellerId === sellerId && review.reviewerId === reviewerId
  );
  
  if (alreadyReviewed) {
    throw new Error("You already reviewed this seller.");
  }
 
  const canUseSupabase = supabase && isUuid(sellerId) && isUuid(reviewerId) && isUuid(listingId);

  if (!canUseSupabase) {
    const newReview = {
      id: String(Date.now()),   
      sellerId,
      reviewerId,
      reviewerName: reviewerName || "UTA Student", 
      listingId, 
      rating: numericRating,
      comment: cleanComment,  
      createdAt: new Date().toISOString(),
    };

    writeJson(REVIEWS_KEY, [newReview, ...localReviews]);
    return newReview;
  } 

  const { data, error } = await supabase 
    .from("reviews")
    .insert({  
      seller_id: sellerId,
      reviewer_id: reviewerId,
      listing_id: listingId, 
      rating: numericRating,
      comment: cleanComment,
    })
    .select()
    .single(); 

  if (error) throw error;  
  return {
    id: data.id, 
    sellerId: data.seller_id,
    reviewerId: data.reviewer_id, 
    reviewerName: reviewerName || "UTA Student",  
    listingId: data.listing_id,
    rating: data.rating, 
    comment: data.comment,
    createdAt: data.created_at,  
  };
}

export async function getSellerRating(sellerId) { 
  if (!supabase) {
    return { average_rating: 0, review_count: 0 }; 
  }
 
  const { data, error } = await supabase
    .from("seller_ratings")
    .select("*")
    .eq("seller_id", sellerId)  
    .single(); 


  if (error) return { average_rating: 0, review_count: 0 }; 
  return data;
}

export async function getSellerReviews(sellerId) { 
  ensureSeedData();
  const localReviews = readJson(REVIEWS_KEY, mockReviews).filter(  
    (review) => review.sellerId === sellerId
  );
 
  if (!supabase) {
    return localReviews; 
  }
 
  if (!isUuid(sellerId)) {
    return localReviews;  
  }
 
  const { data, error } = await supabase
    .from("reviews")
    .select(` 
      id,
      rating,
      comment,  
      created_at,
      profiles:reviewer_id (
        full_name
      ) 
    `)
    .eq("seller_id", sellerId) 
    .order("created_at", { ascending: false });  

  if (error) {
    return localReviews;
  } 
 
  const databaseReviews = data.map((review) => ({
    id: review.id,
    sellerId,  
    reviewerName: review.profiles?.full_name || "UTA Student",
    rating: review.rating,
    comment: review.comment, 
    createdAt: review.created_at,
  }));

  return [...localReviews, ...databaseReviews];  
}
 
export function getConversationByListingId(listingId) {
  return getConversations().find((conversation) => conversation.listingId === listingId); 
}

export function sendMessage(listingId, sender, text) {  
  const conversations = getConversations();
  const timestamp = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  
  let updated = false;
  const nextConversations = conversations.map((conversation) => {
    if (conversation.listingId !== listingId) {
      return conversation; 
    }

    updated = true;  
    return {
      ...conversation,
      updatedAt: Date.now(), 
      messages: [
        ...conversation.messages,
        {
          id: String(Date.now()),
          sender,
          text,
          timestamp,
        }, 
      ],
    };
  });

  if (!updated) {
    nextConversations.unshift({  
      id: String(Date.now()),
      listingId,
      participantName: "Seller",
      updatedAt: Date.now(),
      messages: [
        {
          id: String(Date.now()),  
          sender,
          text,
          timestamp,
        },
      ],
    }); 
  }

  
 
  writeJson(CONVERSATIONS_KEY, nextConversations);
  return nextConversations.find((conversation) => conversation.listingId === listingId);
}

export async function sendDatabaseMessage(listingId, userProfile, text, conversationId = null) {  
  if (!supabase || !userProfile?.id) {
    const conversation = sendMessage(listingId, "user", text); 
    return conversation.messages[conversation.messages.length - 1];
  }

  const existingConversation =
    conversationId ? await getDatabaseConversationById(conversationId, userProfile) : null;
  const conversation = existingConversation || (await getOrCreateDatabaseConversation(listingId, userProfile));
 
  if (!conversation) { 
    const localConversation = sendMessage(listingId, "user", text);
    return localConversation.messages[localConversation.messages.length - 1];  
  }

  try {
    const { data: sentMessage, error: messageError } = await supabase 
      .from("chat_messages") 
      .insert({
        conversation_id: conversation.id,
        sender_id: userProfile.id, 
        body: text,
      })
      .select()
      .single();  

    if (messageError) {
      throw messageError;
    }

    const { error: updateError } = await supabase
      .from("chat_conversations")  
      .update({ updated_at: new Date().toISOString() }) 
      .eq("id", conversation.id);

    if (updateError) { 
      throw updateError;
    }

    return {
      id: sentMessage.id,
      sender: "user",
      text: sentMessage.body,
      timestamp: formatMessageTime(sentMessage.created_at),
      createdAt: sentMessage.created_at, 
    };
  } catch {
    const localConversation = sendMessage(listingId, "user", text); 
    return localConversation.messages[localConversation.messages.length - 1];
  }
}

