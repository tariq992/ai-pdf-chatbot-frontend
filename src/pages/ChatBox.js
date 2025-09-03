import { useState, useRef, useEffect } from "react";
import {
  User,
  Bot,
  AlertCircle,
  Lock,
  ArrowDown,
  Sun,
  Moon,
  ExternalLink,
  Check,
} from "lucide-react";
import { GrSend } from "react-icons/gr";
import { askAI, createCheckoutSession } from "../api/api";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function ChatBox() {
  const [open, setOpen] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const token = localStorage.getItem("token");
  const [userName, setUserName] = useState(null);


  useEffect(() => {
    const storedUser = localStorage.getItem("user_name");
    if (storedUser) setUserName(storedUser);
  }, []);

  const storageKey = token
    ? `gemini_chat_messages_${token}`
    : "gemini_chat_messages_guest";
   
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim()) return;


    const userMessage = {
      sender: "user",
      text: input.trim(),
      createdAt: new Date().toISOString(),
      read: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await askAI({ question: userMessage.text, topK: 6 });
      const aiText = response.data?.answer || "I’m not sure about that.";
      const aiMessage = {
        sender: "ai",
        text: aiText,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      if (error.response?.status === 429) {
        setLimitReached(true);
      } else {
        const errorMsg = {
          sender: "ai",
          text: (
            <>
              <AlertCircle className="inline w-4 h-4 mr-1" /> Something went
              wrong. Please try again later.
            </>
          ),
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  };

  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
    setInput(e.target.value);
  };

  const handleSubscribe = async () => {
    try {
      const { id } = await createCheckoutSession();
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (err) {
      alert("Subscription failed. Try again!");
    }
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    setShowScrollBtn(scrollTop + clientHeight < scrollHeight - 50);
  };

  const formatDateDivider = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  };


   return (
    <div className={` fixed bottom-0 right-0 z-50 ${darkMode ? "dark" : ""}`}>
   
        <div className=" w-80 h-[500px] backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-[scaleIn_0.3s_ease]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">🤖 AI Assistant</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
          
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-3 text-sm pr-1 scrollbar-thin scrollbar-thumb-emerald-400 scrollbar-track-transparent"
            >
              {messages.length === 0 && (
                <p className="text-gray-600 dark:text-gray-400 text-center mt-8 text-xs animate-wave">
                  👋 Hi {userName || "there"}! I’m your assistant. How can I
                  help today?
                </p>
              )}

              {messages.map((msg, i) => {
                const prevMsg = messages[i - 1];
                const showDivider =
                  !prevMsg ||
                  formatDateDivider(prevMsg.createdAt) !==
                    formatDateDivider(msg.createdAt);

                return (
                  <div key={i}>
                    {showDivider && (
                      <div className="text-center text-[10px] text-gray-400 my-2">
                        {formatDateDivider(msg.createdAt)}
                      </div>
                    )}
                    <div
                      className={`flex items-end gap-2 animate-[fadeIn_0.4s_ease] ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.sender === "ai" && (
                        <Bot className="w-5 h-5 text-emerald-500" />
                      )}
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md whitespace-pre-wrap ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tl-lg rounded-br-lg"
                            : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tr-lg rounded-bl-lg"
                        }`}
                      >
                        {typeof msg.text === "string" &&
                        msg.text.match(/https?:\/\//) ? (
                          <a
                            href={msg.text}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
                          >
                            {msg.text} <ExternalLink size={12} />
                          </a>
                        ) : (
                          msg.text
                        )}

                        <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 justify-end">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {msg.sender === "user" && <Check size={12} />}
                        </div>
                      </div>
                      {msg.sender === "user" && (
                        <User className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-300 dark:bg-gray-600 px-3 py-2 rounded-2xl flex items-center space-x-1 animate-[wave_1s_infinite]">
                    <span className="w-2 h-2 bg-gray-500 dark:bg-gray-200 rounded-full"></span>
                    <span className="w-2 h-2 bg-gray-500 dark:bg-gray-200 rounded-full"></span>
                    <span className="w-2 h-2 bg-gray-500 dark:bg-gray-200 rounded-full"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {showScrollBtn && (
              <button
                onClick={() =>
                  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="absolute bottom-24 right-4 bg-emerald-600 text-white p-2 rounded-full shadow-md hover:bg-emerald-700"
              >
                <ArrowDown size={12} />
              </button>
            )}

            {/* Input + Quick replies */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-2 border-t border-gray-200 dark:border-gray-700">
              {!limitReached ? (
                <>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!loading) handleSend();
                    }}
                    className="flex items-center gap-2 rounded-2xl bg-gray-50 dark:bg-gray-800 px-2 py-1 shadow-sm"
                  >
                    {/* Textarea */}
                    <textarea
                      ref={textareaRef}
                      rows={1}
                      value={input}
                      onInput={handleInput}
                      onKeyDown={handleKeyDown}
                      placeholder="Write a message..."
                      className="flex-grow resize-none overflow-hidden rounded-xl bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-0"
                      disabled={loading}
                    />


                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={loading || !input.trim()}
                      className={`p-2 rounded-full shadow-sm transition active:scale-90 focus:outline-none ${
                        loading || !input.trim()
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-emerald-600 hover:text-emerald-700"
                      }`}
                    >
                      <GrSend size={18} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Daily free limit reached.
                  </p>
                  <button
                    onClick={handleSubscribe}
                    className="w-full px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white shadow-md hover:bg-emerald-700 flex items-center justify-center gap-2"
                  >
                    <Lock size={14} /> Subscribe to continue
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );

}
