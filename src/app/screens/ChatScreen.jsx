import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Send, Check, CheckCheck } from "lucide-react";
import { mockListings, mockMessages } from "../data/mockData";

export default function ChatScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [messages, setMessages] = useState(mockMessages);
  const [inputText, setInputText] = useState("");
  const [meetupConfirmed, setMeetupConfirmed] = useState(false);
  const messagesEndRef = useRef(null);

  const listing = mockListings.find((l) => l.id === id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: String(messages.length + 1),
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputText("");

    // Simulate seller response
    setTimeout(() => {
      const sellerResponse = {
        id: String(messages.length + 2),
        sender: "seller",
        text: "Sounds good! See you then.",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, sellerResponse]);
    }, 1200);
  };

  const handleConfirmMeetup = () => {
    setMeetupConfirmed(true);
    setTimeout(() => {
      navigate("/success", { state: { type: "meetup", listing } });
    }, 500);
  };

  const handleBack = () => {
    // Navigate back to item details page
    navigate(`/item/${id}`);
  };

  if (!listing) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-4">
      {/* iPhone Frame */}
      <div className="w-[393px] h-[852px] bg-white rounded-[60px] shadow-2xl overflow-hidden relative border-[14px] border-black">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl z-50" />

        {/* Content */}
        <div className="h-full flex flex-col bg-[#F4F6F9]">
          {/* Top Bar */}
          <div className="pt-12 px-4 pb-3 bg-white shadow-sm flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBack}
              className="w-9 h-9 flex items-center justify-center"
            >
              <ChevronLeft className="w-6 h-6 text-[#111827]" />
            </motion.button>

            <img
              src={listing.seller.avatar}
              alt={listing.seller.name}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex-1">
              <h2 className="text-[16px] font-semibold text-[#111827]">
                {listing.seller.name}
              </h2>
              <p className="text-[13px] text-[#10B981]">Active now</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {/* Context Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[16px] p-3 shadow-sm mb-4"
            >
              <div className="flex gap-3">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-16 h-16 rounded-[12px] object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-[14px] font-semibold text-[#111827] line-clamp-1">
                    {listing.title}
                  </h3>
                  <p className="text-[16px] font-bold text-[#2563EB] mt-1">
                    ${listing.price}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Messages */}
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] ${
                      message.sender === "user" ? "order-2" : "order-1"
                    }`}
                  >
                    <div
                      className={`rounded-[20px] px-4 py-2.5 ${
                        message.sender === "user"
                          ? "bg-[#2563EB] text-white"
                          : "bg-white text-[#111827]"
                      }`}
                    >
                      <p className="text-[16px]">{message.text}</p>
                    </div>
                    <p
                      className={`text-[11px] text-[#9CA3AF] mt-1 px-2 ${
                        message.sender === "user" ? "text-right" : "text-left"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Meetup Confirmation Pill */}
            {!meetupConfirmed && messages.length >= 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center py-2"
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirmMeetup}
                  className="bg-[#10B981] text-white px-6 py-2.5 rounded-full font-semibold text-[14px] shadow-md hover:bg-[#059669] transition-colors flex items-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Confirm Meetup
                </motion.button>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-[#E5E7EB] p-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-[#F4F6F9] rounded-full text-[16px] text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={!inputText.trim()}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                  inputText.trim()
                    ? "bg-[#2563EB] text-white shadow-md"
                    : "bg-[#E5E7EB] text-[#9CA3AF]"
                }`}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}