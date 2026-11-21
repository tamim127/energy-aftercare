import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { chatLabel } from '../content/site';
import { faqData } from '../content/faqData';

// Front-end-only chat panel. The opening line reuses live copy from the FAQ page.
const opener = faqData.still?.lines.find((l) => l.startsWith('Speak to a real person')) ?? '';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<string[]>([]);
  const [text, setText] = useState('');

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setMsgs((m) => [...m, text.trim()]);
    setText('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            role="dialog"
            aria-label={chatLabel}
            className="flex h-[440px] w-[calc(100vw-2.5rem)] max-w-[360px] flex-col overflow-hidden rounded-2xl border border-ea-grey/30 bg-ea-black text-ea-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ea-grey/20 px-5 py-4">
              <p className="flex items-center gap-2 font-bold"><span className="h-2 w-2 rounded-full bg-ea-green" />{chatLabel}</p>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-ea-grey hover:text-ea-green"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-5 text-sm">
              <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-ea-ink2 px-4 py-3">{opener}</p>
              {msgs.map((m, i) => (
                <p key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-ea-green px-4 py-3 text-ea-black">{m}</p>
              ))}
            </div>
            <form onSubmit={send} className="flex gap-2 border-t border-ea-grey/20 p-3">
              <label htmlFor="chat-input" className="sr-only">Message</label>
              <input id="chat-input" value={text} onChange={(e) => setText(e.target.value)} className="flex-1 rounded-full border border-ea-grey/30 bg-ea-ink px-4 text-sm outline-none focus:border-ea-green" />
              <button type="submit" aria-label="Send" className="flex h-11 w-11 items-center justify-center rounded-full bg-ea-green text-ea-black"><Send className="h-4 w-4" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="flex min-h-[52px] items-center gap-2 rounded-full bg-ea-green px-5 font-bold text-ea-black shadow-[0_8px_30px_-6px_hsl(var(--ea-green)/0.7)] transition-transform hover:-translate-y-0.5">
        <MessageCircle className="h-5 w-5" /> <span className="hidden sm:inline">{chatLabel}</span>
      </button>
    </div>
  );
}
