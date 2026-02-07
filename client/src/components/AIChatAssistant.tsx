import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2, Plus, Bot, User, Loader2, MessageCircle } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: number;
  title: string;
}

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (bubbleDismissed || isOpen) return;
    const timer = setTimeout(() => setShowBubble(true), 5000);
    return () => clearTimeout(timer);
  }, [bubbleDismissed, isOpen]);

  useEffect(() => {
    if (showBubble) {
      const hide = setTimeout(() => setShowBubble(false), 8000);
      return () => clearTimeout(hide);
    }
  }, [showBubble]);

  const loadConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch {}
  };

  const startNewConversation = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Yeni Sohbet" }),
      });
      if (res.ok) {
        const conv = await res.json();
        setConversationId(conv.id);
        setMessages([]);
        setShowHistory(false);
      }
    } catch {}
  };

  const loadConversation = async (id: number) => {
    try {
      const res = await fetch(`/api/conversations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setConversationId(data.id);
        setMessages(data.messages || []);
        setShowHistory(false);
      }
    } catch {}
  };

  const deleteConversation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationId === id) {
        setConversationId(null);
        setMessages([]);
      }
    } catch {}
  };

  const handleOpen = () => {
    setIsOpen(true);
    loadConversations();
    if (!conversationId) {
      startNewConversation();
    }
  };

  const sendDirectMessage = async (text: string) => {
    setInput("");
    await sendMessageWithContent(text);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput("");
    await sendMessageWithContent(text);
  };

  const sendMessageWithContent = async (text: string) => {
    if (!text || isLoading) return;

    let currentConvId = conversationId;
    if (!currentConvId) {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: text.slice(0, 50) }),
        });
        if (res.ok) {
          const conv = await res.json();
          currentConvId = conv.id;
          setConversationId(conv.id);
        }
      } catch {
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const res = await fetch(`/api/conversations/${currentConvId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage.content }),
      });

      if (!res.ok) throw new Error("Failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let fullText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.done) break;
                if (data.content) {
                  fullText += data.content;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id
                        ? { ...m, content: fullText }
                        : m
                    )
                  );
                }
                if (data.error) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMessage.id
                        ? { ...m, content: "Bir hata oluştu. Lütfen tekrar deneyin." }
                        : m
                    )
                  );
                }
              } catch {}
            }
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: "Bağlantı hatası. Lütfen tekrar deneyin." }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const escapeHtml = (str: string) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    let html = escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-[#39ff14] text-xs">$1</code>')
      .replace(/\n/g, "<br />");
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
              {showBubble && !isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute bottom-[72px] right-0 w-64 bg-[#0A0A0A] border border-[#39ff14]/30 rounded-2xl rounded-br-md p-4 shadow-xl shadow-[#39ff14]/10 cursor-pointer"
                  onClick={() => {
                    setBubbleDismissed(true);
                    setShowBubble(false);
                    handleOpen();
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBubbleDismissed(true);
                      setShowBubble(false);
                    }}
                    className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-white text-sm font-medium mb-1">Merhaba! 👋</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Fitness ve beslenme hakkında sorularınız mı var? Size yardımcı olmak için buradayım!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              data-testid="button-open-chat"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setBubbleDismissed(true);
                setShowBubble(false);
                handleOpen();
              }}
              className="relative w-[60px] h-[60px] rounded-full flex items-center justify-center"
              aria-label="AI Asistan"
            >
              <div className="absolute inset-0 rounded-full animate-[spin_3s_linear_infinite]">
                <svg className="w-full h-full" viewBox="0 0 60 60">
                  <circle
                    cx="30" cy="30" r="28"
                    fill="none"
                    stroke="#39ff14"
                    strokeWidth="2"
                    strokeDasharray="60 116"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="w-[52px] h-[52px] rounded-full bg-black flex items-center justify-center shadow-lg shadow-[#39ff14]/20 overflow-hidden">
                <img src="/logo.png" alt="Gokalaf" className="w-9 h-9 object-contain" />
              </div>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0A0A0A]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#39ff14]/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#39ff14]" />
                </div>
                <div>
                  <h3 className="text-white text-sm font-semibold font-['Oswald']">GOKALAF ASISTAN</h3>
                  <p className="text-gray-500 text-[10px]">AI Fitness Danışmanı</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  data-testid="button-chat-history"
                  onClick={() => {
                    setShowHistory(!showHistory);
                    if (!showHistory) loadConversations();
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  title="Sohbet Geçmişi"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button
                  data-testid="button-new-chat"
                  onClick={startNewConversation}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#39ff14] hover:bg-[#39ff14]/10 transition-colors"
                  title="Yeni Sohbet"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  data-testid="button-close-chat"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {showHistory ? (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <p className="text-xs text-gray-500 px-2 mb-2">Sohbet Geçmişi</p>
                {conversations.length === 0 ? (
                  <p className="text-gray-500 text-xs text-center py-8">Henüz sohbet yok</p>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      data-testid={`button-conversation-${conv.id}`}
                      onClick={() => loadConversation(conv.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${
                        conversationId === conv.id
                          ? "bg-[#39ff14]/10 border border-[#39ff14]/20"
                          : "bg-white/5 hover:bg-white/10 border border-transparent"
                      }`}
                    >
                      <span className="text-sm text-white truncate flex-1">{conv.title}</span>
                      <button
                        data-testid={`button-delete-conversation-${conv.id}`}
                        onClick={(e) => deleteConversation(conv.id, e)}
                        className="ml-2 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-[#39ff14]/10 flex items-center justify-center mb-4">
                      <Bot className="w-8 h-8 text-[#39ff14]" />
                    </div>
                    <h4 className="text-white font-semibold mb-2">Merhaba!</h4>
                    <p className="text-gray-400 text-sm mb-6">
                      Fitness, beslenme ve antrenman hakkında her şeyi sorabilirsin.
                    </p>
                    <div className="grid grid-cols-1 gap-2 w-full">
                      {[
                        "Kas yapmak için ne yemeliyim?",
                        "Yağ yakımı için en iyi antrenman?",
                        "Günde kaç kalori almalıyım?",
                      ].map((q) => (
                        <button
                          key={q}
                          data-testid={`button-quick-question`}
                          onClick={() => sendDirectMessage(q)}
                          className="text-left text-xs px-3 py-2.5 rounded-xl bg-white/5 text-gray-300 hover:bg-[#39ff14]/10 hover:text-[#39ff14] border border-white/5 hover:border-[#39ff14]/20 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                        msg.role === "user"
                          ? "bg-white/10"
                          : "bg-[#39ff14]/20"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="w-3.5 h-3.5 text-gray-300" />
                      ) : (
                        <Bot className="w-3.5 h-3.5 text-[#39ff14]" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#39ff14] text-black rounded-tr-md"
                          : "bg-white/5 text-gray-200 rounded-tl-md border border-white/5"
                      }`}
                    >
                      {msg.role === "assistant" && !msg.content && isLoading ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-[#39ff14] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-1.5 h-1.5 bg-[#39ff14] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-1.5 h-1.5 bg-[#39ff14] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      ) : (
                        renderMarkdown(msg.content)
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            <div className="p-3 border-t border-white/10 bg-[#0A0A0A]">
              <div className="flex items-end gap-2">
                <textarea
                  data-testid="input-chat-message"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Bir soru sor..."
                  rows={1}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#39ff14]/30 focus:ring-1 focus:ring-[#39ff14]/20 transition-colors max-h-[100px]"
                  style={{ minHeight: "40px" }}
                />
                <button
                  data-testid="button-send-message"
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-xl bg-[#39ff14] text-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#39ff14]/90 transition-colors flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[9px] text-gray-600 text-center mt-2">
                Gokalaf AI Asistan genel bilgi verir, kişisel program için koçluk paketlerimize göz atın.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
