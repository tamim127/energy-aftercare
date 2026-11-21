import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Send,
  X,
  Sparkles,
  RotateCcw,
  Bot,
  User as UserIcon,
  ExternalLink,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@project/components/lib/utils';
import { chatLabel, contact } from '../content/site';
import { sendAIChatMessage, type ChatMessage } from '../wix/aiChat';

const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  content:
    "Hello! I'm Energy Aftercare's AI Technical Assistant. I can help answer questions about our Bronze, Silver, Gold, and Platinum support plans, finding an Approved Installer in your area, or reviewing a solar/battery quote.\n\nHow can I help you today?",
};

const SUGGESTED_QUESTIONS = [
  'What are your plan prices & inclusions?',
  'Find an approved installer near me',
  'How does the savings calculator work?',
  'Speak with our technical team',
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput('');
    const userMsg: ChatMessage = { role: 'user', content: query };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const result = await sendAIChatMessage(newHistory);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: result.text,
        action: result.action,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I'm sorry, I encountered a temporary connection issue. You can call us directly on 07943 812137 or email admin@energyaftercare.co.uk.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput('');
  };

  // Simple formatting for bold and lists
  const formatText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) return <div key={idx} className="h-2" />;

      // Parse bold **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-ea-green">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
            <span className="text-ea-green font-bold shrink-0">•</span>
            <span>{renderedParts}</span>
          </div>
        );
      }

      return <p key={idx} className="my-0.5 leading-relaxed">{renderedParts}</p>;
    });
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999] flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-label="Energy Aftercare AI Chat Assistant"
            className="flex h-[520px] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-ea-grey/30 bg-ea-black text-ea-white shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ea-grey/20 bg-ea-ink px-4 py-3.5">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-ea-green/15 border border-ea-green/40 text-ea-green">
                  <Bot className="h-4 w-4" />
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-ea-green ring-2 ring-ea-black animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-ea-white flex items-center gap-1.5">
                    Energy Aftercare AI
                  </h4>
                  <p className="text-[10px] text-ea-green font-medium">Official Knowledge Assistant</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleReset}
                  title="Reset conversation"
                  aria-label="Reset chat"
                  className="p-1.5 text-ea-grey hover:text-ea-white hover:bg-ea-black/50 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="p-1.5 text-ea-grey hover:text-ea-white hover:bg-ea-black/50 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto p-4 text-xs sm:text-sm no-scrollbar bg-gradient-to-b from-ea-black via-ea-black to-ea-ink/50"
            >
              {messages.map((m, idx) => {
                const isAssistant = m.role === 'assistant';
                return (
                  <div
                    key={idx}
                    className={cn('flex flex-col', isAssistant ? 'items-start' : 'items-end')}
                  >
                    <div
                      className={cn(
                        'max-w-[88%] rounded-2xl px-4 py-3 shadow-md text-xs sm:text-sm',
                        isAssistant
                          ? 'rounded-tl-xs bg-ea-ink border border-ea-grey/25 text-ea-white'
                          : 'rounded-tr-xs bg-ea-green text-ea-black font-semibold'
                      )}
                    >
                      {formatText(m.content)}

                      {/* Interactive Action CTA Pill */}
                      {m.action && (
                        <div className="mt-3 pt-2 border-t border-ea-grey/20">
                          <Link
                            to={m.action.to}
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-ea-green/20 border border-ea-green/50 px-3 py-1.5 text-xs font-bold text-ea-green hover:bg-ea-green hover:text-ea-black transition-colors"
                          >
                            <span>{m.action.label}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs bg-ea-ink border border-ea-grey/25 px-4 py-3 max-w-[100px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-ea-green animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-ea-green animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-ea-green animate-bounce" />
                </div>
              )}
            </div>

            {/* Quick Suggestion Pills */}
            {messages.length <= 2 && (
              <div className="px-3 py-2 border-t border-ea-grey/15 bg-ea-ink/60 flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSend(q)}
                    disabled={loading}
                    className="rounded-full border border-ea-grey/25 bg-ea-black/60 px-2.5 py-1 text-[11px] font-medium text-ea-white/80 hover:border-ea-green hover:text-ea-green transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="border-t border-ea-grey/20 bg-ea-ink p-2.5 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <label htmlFor="chat-input" className="sr-only">
                  Ask a question
                </label>
                <input
                  ref={inputRef}
                  id="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about plans, installers, calculator..."
                  disabled={loading}
                  className="flex-1 rounded-full border border-ea-grey/30 bg-ea-black px-4 py-2 text-xs sm:text-sm text-ea-white outline-none focus:border-ea-green placeholder-ea-grey"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ea-green text-ea-black hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] text-center text-ea-grey/70">
                Locked strictly to Energy Aftercare services &amp; knowledge base.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Open Energy Aftercare AI Assistant"
        className="flex min-h-[50px] items-center gap-2.5 rounded-full bg-ea-green px-5 py-3 font-bold text-ea-black shadow-[0_8px_30px_-6px_rgba(0,229,117,0.7)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Sparkles className="h-4 w-4 fill-ea-black" />
        <span className="text-sm font-extrabold">{chatLabel}</span>
      </button>
    </div>
  );
}
