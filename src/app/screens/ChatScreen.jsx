import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Send } from "lucide-react";
import { getConversationByListingId, getListingById, sendMessage } from "../data/marketplaceStore";

export default function ChatScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputText, setInputText] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const messagesEndRef = useRef(null);

  const listing = useMemo(() => getListingById(id), [id]);
  const conversation = useMemo(() => getConversationByListingId(id), [id, refreshKey]);
  const messages = conversation?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#F4F6F9] p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm">Conversation not found.</div>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputText.trim()) {
      return;
    }

    sendMessage(id, "user", inputText.trim());
    setInputText("");
    setRefreshKey((current) => current + 1);

    setTimeout(() => {
      sendMessage(id, "seller", "Thanks for reaching out. I am available later today.");
      setRefreshKey((current) => current + 1);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] p-4 sm:p-6">
      <div className="mx-auto flex h-[80vh] max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#E5E7EB] p-4">
          <button onClick={() => navigate("/messages")} className="text-[#2563EB]"><ArrowLeft className="h-4 w-4" /></button>
          <img src={listing.seller.avatar} alt={listing.seller.name} className="h-9 w-9 rounded-full object-cover" />
          <div>
            <p className="text-sm font-semibold text-[#111827]">{listing.seller.name}</p>
            <p className="text-xs text-[#6B7280]">{listing.title}</p>
          </div>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-[#F9FAFB] p-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${message.sender === "user" ? "bg-[#2563EB] text-white" : "bg-white text-[#111827]"}`}>
                <p>{message.text}</p>
                <p className={`mt-1 text-[10px] ${message.sender === "user" ? "text-[#DBEAFE]" : "text-[#9CA3AF]"}`}>{message.timestamp}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-[#E5E7EB] p-3">
          <div className="flex items-center gap-2">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message"
              className="flex-1 rounded-full border border-[#D1D5DB] px-4 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
            <button onClick={handleSend} disabled={!inputText.trim()} className="rounded-full bg-[#2563EB] p-2 text-white disabled:cursor-not-allowed disabled:bg-[#CBD5E1]">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}