import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import logoImg from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};



export function GuruChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", text: "Hi! I am GURU, your career and education assistant. How can I help you today?", isUser: false },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now().toString(), text: inputValue, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Convert history for Edge Function (excluding welcome message)
      const formattedHistory = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.isUser ? "user" : "model",
          parts: [{ text: m.text }],
        }));

      let attempt = 0;
      let success = false;
      let responseText = "";

      // Retry once if temporary error (max 2 attempts)
      while (attempt < 2 && !success) {
        attempt++;
        try {
          const { data, error } = await supabase.functions.invoke('chat-guru', {
            body: {
              history: formattedHistory,
              message: userMessage.text,
            },
          });

          if (error || (data && data.error)) {
            throw new Error(error?.message || data?.error || "Failed to communicate with server");
          }

          if (data && data.response) {
            responseText = data.response;
            success = true;
          } else {
            throw new Error("Invalid response from server");
          }
        } catch (err) {
          if (attempt === 2) {
            console.error("Chatbot Error after retries:", err);
          } else {
            console.warn(`Chatbot attempt ${attempt} failed, retrying...`);
            await new Promise(res => setTimeout(res, 1000));
          }
        }
      }

      if (success) {
        setMessages((prev) => [...prev, { id: Date.now().toString(), text: responseText, isUser: false }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), text: "I'm having a little trouble connecting right now. Please try again in a moment.", isUser: false },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl h-[80vh] max-h-[800px] min-h-[500px] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden relative"
            >
              {/* Header */}
              <div className="bg-primary p-4 sm:p-5 flex items-center justify-between text-primary-foreground">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white overflow-hidden p-1 sm:p-1.5 shadow-md">
                    <img src={logoImg} alt="GURU Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl">GURU</h3>
                    <p className="text-sm opacity-90">Career & Education AI Assistant</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/20 text-primary-foreground rounded-full h-10 w-10 sm:h-12 sm:w-12" onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </div>

              {/* Chat Area */}
              <ScrollArea className="flex-1 p-4 sm:p-6 bg-muted/30" ref={scrollRef}>
                <div className="flex flex-col gap-6 max-h-full">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 sm:gap-4 max-w-[85%] ${msg.isUser ? "self-end flex-row-reverse" : "self-start"}`}>
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center overflow-hidden ${msg.isUser ? "bg-primary text-primary-foreground" : "bg-white border shadow-sm p-1.5"}`}>
                        {msg.isUser ? (
                          <span className="text-sm font-bold">ME</span>
                        ) : (
                          <img src={logoImg} alt="GURU" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-base sm:text-lg leading-relaxed ${msg.isUser ? "bg-primary text-primary-foreground rounded-tr-sm sm:rounded-tr-md" : "bg-background border rounded-tl-sm sm:rounded-tl-md shadow-sm"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 sm:gap-4 max-w-[85%] self-start">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border shadow-sm p-1.5 flex items-center justify-center overflow-hidden">
                        <img src={logoImg} alt="GURU" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-5 rounded-3xl bg-background border rounded-tl-md shadow-sm flex items-center justify-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-bounce"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 sm:p-6 bg-background border-t">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3 relative max-w-4xl mx-auto">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask GURU about careers..."
                    className="pr-14 rounded-full border-muted-foreground/30 focus-visible:ring-primary/40 h-14 sm:h-16 text-base sm:text-lg shadow-inner"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!inputValue.trim() || isLoading}
                    className="absolute right-2 w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Send className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Button (Capsule Shape) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 sm:h-14 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center hover:bg-primary/90 transition-all px-4 gap-2 border border-primary-foreground/20 hover:shadow-primary/30"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-white p-0.5 overflow-hidden shadow-md">
                <img src={logoImg} alt="GURU" className="w-full h-full object-cover" />
              </div>
              <span className="font-semibold text-sm sm:text-base whitespace-nowrap tracking-wide">Ask GURU</span>
            </>
          )}
        </motion.button>
      </div>
    </>
  );
}
