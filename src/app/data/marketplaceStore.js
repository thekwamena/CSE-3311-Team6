import { mockListings, mockMessages } from "./mockData";
import { supabase } from "../lib/supabaseClient";

const LISTINGS_KEY = "marketplace:listings";
const CONVERSATIONS_KEY = "marketplace:conversations";

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
}

export function getListings() {
  ensureSeedData();
  return readJson(LISTINGS_KEY, mockListings);
}

export function getListingById(id) {
  return getListings().find((listing) => listing.id === id);
}

export function addListing(listingInput, userProfile) {
  const listings = getListings();
  const newListing = {
    id: String(Date.now()),
    title: listingInput.title,
    description: listingInput.description,
    price: Number(listingInput.price),
    category: listingInput.category,
    images: listingInput.images,
    seller: {
      name: userProfile?.fullName || "UTA Student",
      rating: 5,
      avatar:
        userProfile?.profilePicture ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
      verified: true,
    },
    distance: Number(listingInput.distance || 0.5),
    location: listingInput.location || "UTA Campus",
    createdAt: Date.now(),
  };

  const nextListings = [newListing, ...listings];
  writeJson(LISTINGS_KEY, nextListings);
  return newListing;
}

export function getConversations() {
  ensureSeedData();
  return readJson(CONVERSATIONS_KEY, getInitialConversations());
}

export async function addReview({ sellerId, reviewerId, listingId, rating, comment }) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      seller_id: sellerId,
      reviewer_id: reviewerId,
      listing_id: listingId,
      rating,
      comment,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
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

