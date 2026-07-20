import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Mic, Send, Volume2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendChatMessage } from "@/lib/api";
import { initialChat, suggestedQuestions } from "@/data/mockData";

type Msg = { role: "user" | "assistant"; text: string };

export function ChatAssistant({ disease }: { disease?: string }) {
  const [messages, setMessages] = useState<Msg[]>(initialChat);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    try {
      const res = await sendChatMessage(text, { disease });
      setMessages((m) => [...m, { role: "assistant", text: res.reply }]);
    } finally {
      setTyping(false);
    }
  };

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  const toggleMic = () => {
    // Placeholder — swap in real /transcribe API later
    setListening((l) => !l);
    setTimeout(() => setListening(false), 1500);
  };

  return (
    <div className="card-elevated flex flex-col h-full min-h-[560px] overflow-hidden">
      <div className="p-4 border-b border-border/70 flex items-center gap-3 bg-gradient-to-r from-leaf-soft/70 to-transparent">
        <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center text-primary-foreground shadow-md shadow-primary/25">
          <Bot className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="font-display font-semibold leading-tight">LeafDoc Assistant</div>
          <div className="text-xs text-muted-foreground">
            {disease ? `Context: ${disease}` : "AI Agronomist · Online"}
          </div>
        </div>
        <span className="chip">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Live
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="h-7 w-7 rounded-lg bg-primary/15 text-primary grid place-items-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                m.role === "user"
                  ? "gradient-primary text-primary-foreground rounded-br-sm"
                  : "bg-secondary text-secondary-foreground rounded-bl-sm"
              }`}
            >
              {m.text}
              {m.role === "assistant" && (
                <button
                  onClick={() => speak(m.text)}
                  className="ml-2 inline-flex align-middle text-muted-foreground hover:text-primary"
                  title="Speak"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {m.role === "user" && (
              <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground grid place-items-center shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </motion.div>
        ))}
        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex gap-2"
            >
              <div className="h-7 w-7 rounded-lg bg-primary/15 text-primary grid place-items-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-secondary rounded-2xl px-3 py-2.5 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 pt-2 pb-1 flex gap-2 flex-wrap border-t border-border/60">
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="chip hover:bg-primary/10 hover:border-primary/40 transition"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="p-3 border-t border-border/60 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={toggleMic}
          className={`h-10 w-10 rounded-xl grid place-items-center border transition ${
            listening ? "gradient-primary text-primary-foreground border-transparent animate-pulse" : "bg-card border-border text-muted-foreground hover:text-primary"
          }`}
          title="Voice input"
        >
          <Mic className="h-4 w-4" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about treatment, watering, prevention…"
          className="flex-1 h-10 rounded-xl bg-secondary/60 border border-border px-3 text-sm outline-none focus:border-primary focus:bg-card transition"
        />
        <Button
          type="submit"
          className="gradient-primary text-primary-foreground rounded-xl h-10 px-4 shadow-md shadow-primary/25"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
