import React, { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { LanguageCode } from '../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedAction?: {
    label: string;
    query: string;
  };
}

interface ProductFinderChatProps {
  currentLang: LanguageCode;
  onSearchProduct: (query: string) => void;
}

export const ProductFinderChat: React.FC<ProductFinderChatProps> = ({
  currentLang,
  onSearchProduct,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: '👋 Hey there! I am your AI Product Recommendation Assistant. Tell me what you are looking for (e.g. "Best noise cancelling headphones under $300" or "Family SUV with high safety in India").',
    },
  ]);

  const quickPrompts = [
    'Best 4K OLED TV under $1,200',
    'Flagship phone with best camera 2025',
    'Reliable compact SUV in India',
    'Best cordless vacuum for pet hair',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Formulate intelligent AI reply with direct grounded search action
    setTimeout(() => {
      let replyText = `I can help synthesize evidence for "${text}". Click below to explore grounded decision insights, trade-offs, and ratings.`;
      let searchAction = text;

      if (text.toLowerCase().includes('tv') || text.toLowerCase().includes('oled')) {
        replyText = `For 4K OLED displays, top models like LG C-Series and Sony Bravia XR offer high color accuracy and low input lag.`;
        searchAction = 'LG OLED TV';
      } else if (text.toLowerCase().includes('phone') || text.toLowerCase().includes('camera')) {
        replyText = `For flagship mobile cameras, models like iPhone 15 Pro and Samsung Galaxy S24 Ultra offer high dynamic range and video stability.`;
        searchAction = 'iPhone 15 Pro';
      } else if (text.toLowerCase().includes('suv') || text.toLowerCase().includes('car')) {
        replyText = `For compact and mid-size SUVs, models like Tata Nexon and Hyundai Creta are popular for safety features and high resale value.`;
        searchAction = 'Tata Nexon';
      } else if (text.toLowerCase().includes('headphone') || text.toLowerCase().includes('audio') || text.toLowerCase().includes('noise')) {
        replyText = `For noise cancelling headphones, Sony WH-1000XM5 and Bose QuietComfort Ultra are consistently recognized for ANC performance.`;
        searchAction = 'Sony WH-1000XM5';
      }

      const aiMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: replyText,
        suggestedAction: {
          label: `Search Decision Report for "${searchAction}"`,
          query: searchAction,
        },
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating AI Product Finder Trigger Button */}
      <button
        id="product-finder-chat-btn"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-[#00B67A] hover:bg-[#008254] text-white rounded-full font-bold text-xs shadow-xl flex items-center gap-2 hover:scale-105 transition-all cursor-pointer border-2 border-white/40"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        <span className="hidden sm:inline">AI Product Finder Chat</span>
        <span className="sm:hidden">AI Finder</span>
      </button>

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[400px] max-h-[580px] bg-white rounded-3xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#005128] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00B67A] flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">AI Product Finder</h4>
                <div className="flex items-center gap-1 text-[10px] text-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Multi-Source Consensus Active</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2.5 bg-zinc-50 border-b border-zinc-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 text-[11px] font-medium text-zinc-700 hover:text-emerald-800 border border-zinc-200 whitespace-nowrap transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[340px] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#005128] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-zinc-900 text-white rounded-br-none'
                      : 'bg-zinc-100 text-zinc-800 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {m.suggestedAction && (
                    <button
                      onClick={() => {
                        onSearchProduct(m.suggestedAction!.query);
                        setIsOpen(false);
                      }}
                      className="mt-2.5 w-full py-2 px-3 bg-[#00B67A] hover:bg-[#008254] text-white rounded-xl font-bold text-[11px] flex items-center justify-between transition-colors shadow-xs cursor-pointer"
                    >
                      <span className="truncate">{m.suggestedAction.label}</span>
                      <ArrowRight className="w-3 h-3 shrink-0 ml-1" />
                    </button>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-zinc-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. best laptop for college)..."
              className="flex-1 px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#00B67A] text-zinc-900"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 bg-[#00B67A] hover:bg-[#008254] disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
