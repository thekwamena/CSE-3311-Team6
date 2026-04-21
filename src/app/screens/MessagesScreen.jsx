import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MessageCircle, Search } from "lucide-react";
import { toast } from "sonner";
import {
  getConversationsForUser,
  getListingById,
  markConversationsRead,
} from "../data/marketplaceStore";
import { useAuth } from "../context/AuthContext";

export default function MessagesScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    getConversationsForUser(user)
      .then(async (nextConversations) => {
        const hydratedConversations = await Promise.all(
          nextConversations.map(async (conversation) => {
            const listing = conversation.listing || (await getListingById(conversation.listingId));
            return {
              ...conversation,
              listing,
              lastMessage: conversation.messages[conversation.messages.length - 1]?.text || "No messages yet",
            };
          })
        );

        if (!isMounted) {
          return;
        }

        markConversationsRead(user, hydratedConversations);
        setConversations(
          hydratedConversations
            .filter((conversation) => Boolean(conversation.listing))
        );
      })
      .catch(() => {
        if (isMounted) {
          toast.error("Could not load messages.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const filtered = conversations.filter((item) => {
    const target = `${item.participantName} ${item.listing?.title} ${item.lastMessage}`.toLowerCase();
    return target.includes(query.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#F4F6F9] p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white shadow-sm">
        <div className="border-b border-[#E5E7EB] p-4 sm:p-6">
          <h1 className="text-2xl font-bold text-[#111827]">Messages</h1>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#D1D5DB] px-3 py-2">
            <Search className="h-4 w-4 text-[#9CA3AF]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search conversations"
              className="w-full text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {isLoading ? (
            <div className="p-10 text-center">
              <p className="text-sm text-[#6B7280]">Loading conversations...</p>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() =>
                  navigate(`/chat/${conversation.listingId}?conversation=${conversation.id}`)
                }
                className="flex w-full items-center gap-3 p-4 text-left hover:bg-[#F9FAFB]"
              >
                <img
                  src={conversation.participantAvatar || conversation.listing.images[0]}
                  alt={conversation.participantName}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#111827]">{conversation.participantName}</p>
                  <p className="truncate text-xs text-[#6B7280]">{conversation.listing.title}</p>
                  <p className="truncate text-xs text-[#9CA3AF]">{conversation.lastMessage}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-10 text-center">
              <MessageCircle className="mx-auto mb-3 h-10 w-10 text-[#9CA3AF]" />
              <p className="text-sm text-[#6B7280]">No conversations found.</p>
            </div>
          )}
        </div>

        <div className="border-t border-[#E5E7EB] p-4 text-center">
          <button onClick={() => navigate("/browse")} className="text-sm font-medium text-[#2563EB]">Back to browse</button>
        </div>
      </div>
    </div>
  );
}
