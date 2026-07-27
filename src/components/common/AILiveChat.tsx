import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { sendStreamRequest } from '@/lib/sse';
import { Streamdown } from 'streamdown';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const SYSTEM_PROMPT = `Sən itsec.az təhlükəsizlik sistemləri onlayn mağazasının rəsmi süni intellekt (AI) asistanısan.
Vəzifən müştərilərə Azərbaycan dilində nəzakətli, səlis və köməkçi şəkildə cavab verməkdir.
İstifadəçilərə saytdakı ən keyfiyyətli, ən çox məsləhət görülən malları (məsələn, 4K Ultra HD kameralar, ColorVu və AcuSense texnologiyalı Hikvision kameraları, Dahua PTZ kameraları) təklif et.
Həmişə müştərinin ehtiyacına uyğun ən yaxşı təhlükəsizlik həllərini (NVR, DVR, IP kameralar, giriş nəzarət sistemləri) irəli çək və onları satın almağa həvəsləndir.
Cavablarını qısa, anlaşılan və formatlı (Markdown) şəkildə ver.`;

const AILiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Salam! 👋 Mən itsec.az süni intellekt köməkçisiyəm. Sizə ən keyfiyyətli təhlükəsizlik kameralarını və sistemlərini seçməkdə necə kömək edə bilərəm?' }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStream, setCurrentStream] = useState('');
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStream, isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setIsTooltipVisible(true);
    }, 4000);
    const hideTimer = setTimeout(() => {
      setIsTooltipVisible(false);
    }, 12000);
    return () => { clearTimeout(timer); clearTimeout(hideTimer); };
  }, [isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    
    // Prepare API history
    const apiHistory = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model", parts: [{ text: "Anladım. Mən itsec.az-ın süni intellekt köməkçisiyəm." }] },
    ];
    
    messages.forEach(m => {
      apiHistory.push({ role: m.role, parts: [{ text: m.content }] });
    });
    apiHistory.push({ role: "user", parts: [{ text: userMsg }] });

    setIsStreaming(true);
    setCurrentStream('');
    abortRef.current = new AbortController();

    await sendStreamRequest({
      functionUrl: `${supabaseUrl}/functions/v1/large-language-model`,
      requestBody: { contents: apiHistory },
      supabaseAnonKey,
      onData: (data) => {
        try {
          const parsed = JSON.parse(data);
          const chunk = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          setCurrentStream(prev => prev + chunk);
        } catch { /* skip */ }
      },
      onComplete: () => {
        setIsStreaming(false);
        setMessages(prev => {
          setCurrentStream((finalStream) => {
             return finalStream; // We'll just read from state? Wait, state might be stale
          });
          return prev;
        });
      },
      onError: (err) => {
        console.error("Stream error:", err);
        setIsStreaming(false);
        setMessages(prev => [...prev, { role: 'model', content: "Bağışlayın, xəta baş verdi. Zəhmət olmasa yenidən cəhd edin." }]);
      },
      signal: abortRef.current.signal,
    });
  };

  // We need to commit the stream to messages when streaming stops
  useEffect(() => {
    if (!isStreaming && currentStream) {
      setMessages(prev => [...prev, { role: 'model', content: currentStream }]);
      setCurrentStream('');
    }
  }, [isStreaming, currentStream]);

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      <div 
        className={`bg-card border border-border shadow-2xl rounded-2xl w-[320px] sm:w-[380px] mb-4 transition-all duration-300 origin-bottom-right flex flex-col ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto h-[500px] max-h-[80vh]' : 'opacity-0 scale-50 pointer-events-none absolute bottom-12 right-0 h-[400px]'
        }`}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 rounded-t-2xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={20} className="text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-bold text-sm">itsec.az AI Köməkçi</h3>
              <p className="text-[10px] text-primary-foreground/80">Sürətli və ağıllı dəstək</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="p-4 bg-muted/30 overflow-y-auto flex-1 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground'}`}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-br-sm' 
                    : 'bg-card border border-border text-foreground rounded-bl-sm prose prose-sm prose-p:leading-snug prose-p:my-1 prose-ul:my-1 prose-li:my-0'
                }`}>
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <Streamdown parseIncompleteMarkdown isAnimating={false}>{msg.content}</Streamdown>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isStreaming && currentStream && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2 max-w-[85%]">
                <div className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                  <Bot size={12} />
                </div>
                <div className="p-3 rounded-2xl text-sm shadow-sm bg-card border border-border text-foreground rounded-bl-sm prose prose-sm prose-p:leading-snug prose-p:my-1 prose-ul:my-1 prose-li:my-0">
                  <Streamdown parseIncompleteMarkdown isAnimating={true}>{currentStream}</Streamdown>
                </div>
              </div>
            </div>
          )}
          
          {isStreaming && !currentStream && (
            <div className="flex justify-start">
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                  <Bot size={12} />
                </div>
                <div className="p-3 rounded-2xl text-sm shadow-sm bg-card border border-border rounded-bl-sm flex gap-1">
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-card border-t border-border shrink-0 rounded-b-2xl">
          <form 
            onSubmit={handleSend}
            className="flex items-center gap-2 relative"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Sualınızı yazın..." 
              disabled={isStreaming}
              className="flex-1 bg-muted border border-border rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="absolute right-1 top-1 bottom-1 w-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-primary/90"
            >
              <Send size={14} className="ml-0.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Floating Button & Tooltip */}
      <div className="relative pointer-events-auto">
        <div className={`absolute right-16 top-1/2 -translate-y-1/2 bg-card border border-border shadow-lg px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-500 ${isTooltipVisible && !isOpen ? 'opacity-100 -translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
          Ağıllı AI Köməkçi 🤖
          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-card border-r border-t border-border rotate-45"></div>
        </div>

        <button
          onClick={() => { setIsOpen(!isOpen); setIsTooltipVisible(false); }}
          className="w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-xl flex items-center justify-center text-primary-foreground transition-transform hover:scale-110 relative"
          aria-label="AI Chat"
        >
          {isOpen ? <X size={24} /> : <Bot size={28} />}
          
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] font-bold items-center justify-center border-2 border-background">1</span>
            </span>
          )}
        </button>
      </div>

    </div>
  );
};

export default AILiveChat;
