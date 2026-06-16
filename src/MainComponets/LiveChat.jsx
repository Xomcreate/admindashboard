import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const BOT_RESPONSES = [
  "Thanks for reaching out! How can I assist you today?",
  "I'm looking into that for you. Please give me a moment.",
  "That's a great question! Let me help you with that.",
  "I understand your concern. Here's what I can do for you.",
  "Our support team will follow up with you shortly if needed.",
];

const LiveChat = () => {
  const { isDark } = useTheme(); // Subscribes to changes from your context
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "support",
      text: "👋 Hi there! Welcome to support. How can we help you today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isOpen, isMinimized]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      from: "user",
      text: input.trim(),
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate a bot reply
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        from: "support",
        text: BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)],
        time: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, reply]);

      if (!isOpen || isMinimized) {
        setUnreadCount((c) => c + 1);
      }
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            setUnreadCount(0);
          }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#c45a45] shadow-lg flex items-center justify-center hover:scale-105 transition-transform shadow-[0_4px_14px_rgba(196,90,69,0.4)]"
          aria-label="Open live chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z"
            />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 border
            bg-white border-gray-200 text-gray-800
            dark:bg-[#121111] dark:border-[#242020] dark:text-white
            ${isMinimized ? "h-14" : "h-[480px]"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 dark:bg-[#1a1818] dark:border-[#242020] rounded-t-2xl shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#c45a45]/10 border border-[#c45a45]/25 flex items-center justify-center text-[#c45a45] font-bold text-sm">
                  S
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#1a1818] rounded-full animate-ping" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#1a1818] rounded-full" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight text-gray-900 dark:text-white">
                  Support Team
                </p>
                <p className="text-green-500 dark:text-green-400 text-xs flex items-center gap-1 font-medium">
                  Online
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized((v) => !v)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#242020] transition-colors"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {isMinimized ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#242020] transition-colors"
                aria-label="Close chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Container */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50/50 dark:bg-transparent scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-[#242020]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${
                      msg.from === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {msg.from === "support" && (
                      <div className="w-6 h-6 rounded-full bg-[#c45a45]/10 border border-[#c45a45]/20 flex items-center justify-center text-[#c45a45] font-bold text-[10px] shrink-0">
                        S
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.from === "user"
                          ? "bg-[#c45a45] text-white rounded-br-sm"
                          : "bg-white border border-gray-200 text-gray-800 dark:bg-[#1e1c1c] dark:border-[#242020] dark:text-gray-100 rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                      <p
                        className={`text-[9px] mt-1 tracking-wide ${
                          msg.from === "user"
                            ? "text-white/70 text-right"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {formatTime(msg.time)}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#c45a45]/10 border border-[#c45a45]/20 flex items-center justify-center text-[#c45a45] font-bold text-[10px] shrink-0">
                      S
                    </div>
                    <div className="bg-white border border-gray-200 dark:bg-[#1e1c1c] dark:border-[#242020] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center shadow-sm">
                      <span className="w-1.5 h-1.5 bg-[#c45a45]/60 rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 bg-[#c45a45]/60 rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 bg-[#c45a45]/60 rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="px-3 py-3 bg-white dark:bg-transparent border-t border-gray-200 dark:border-[#242020] shrink-0">
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 dark:bg-[#1e1c1c] dark:border-[#332d2c] rounded-xl px-3 py-1.5 focus-within:border-[#c45a45] dark:focus-within:border-[#c45a45] transition-all duration-200">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-sm outline-none text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-lg bg-[#c45a45] text-white flex items-center justify-center disabled:opacity-30 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition-all shrink-0 shadow-sm"
                    aria-label="Send message"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 transform rotate-45 relative -left-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.269 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-center text-[9px] font-medium tracking-wider text-gray-400 dark:text-zinc-600 mt-2 uppercase">
                  Powered by IPO Stock Support
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChat;