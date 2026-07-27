import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const WhatsAppLiveChat: React.FC = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    // Show tooltip after 3 seconds
    const timer = setTimeout(() => {
      if (!isOpen) setIsTooltipVisible(true);
    }, 3000);
    
    // Hide tooltip after 10 seconds
    const hideTimer = setTimeout(() => {
      setIsTooltipVisible(false);
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [isOpen]);

  const handleSend = () => {
    if (!message.trim()) return;
    const phone = settings.whatsapp_number || '994776117780';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-4 z-50 flex flex-col items-start pointer-events-none">
      
      {/* Chat Window */}
      <div 
        className={`bg-card border border-border shadow-2xl rounded-2xl w-[300px] sm:w-[350px] mb-4 transition-all duration-300 origin-bottom-left ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-50 pointer-events-none absolute bottom-12'
        }`}
      >
        {/* Header */}
        <div className="bg-[#075E54] text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#075E54] rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-sm">itsec.az Dəstək</h3>
              <p className="text-[10px] text-white/80">Adətən dərhal cavab veririk</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Body */}
        <div className="p-4 bg-[#E5DDD5] dark:bg-[#1e1e1e] h-[200px] overflow-y-auto flex flex-col gap-3">
          <div className="bg-white dark:bg-[#2d2d2d] p-3 rounded-2xl rounded-tl-sm text-sm shadow-sm self-start max-w-[85%] text-foreground">
            Salam! 👋 Sizə necə kömək edə bilərik? Təhlükəsizlik sistemləri və ya məhsullarımız haqqında sualınız var?
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 bg-card border-t border-border rounded-b-2xl">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Mesajınızı yazın..." 
              className="flex-1 bg-muted border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#25D366]"
            />
            <button 
              type="submit"
              disabled={!message.trim()}
              className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center text-white shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-[#128C7E]"
            >
              <Send size={16} className="ml-1" />
            </button>
          </form>
        </div>
      </div>

      {/* Floating Button & Tooltip */}
      <div className="relative pointer-events-auto">
        {/* Tooltip */}
        <div className={`absolute left-16 top-1/2 -translate-y-1/2 bg-card border border-border shadow-lg px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-500 ${isTooltipVisible && !isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}>
          Bizimlə Canlı Çat 🔥
          <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-card border-l border-b border-border rotate-45"></div>
        </div>

        <button
          onClick={() => { setIsOpen(!isOpen); setIsTooltipVisible(false); }}
          className="w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] rounded-full shadow-xl flex items-center justify-center text-white transition-transform hover:scale-110 relative"
          aria-label="Live Chat"
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
          
          {/* Notification badge */}
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

export default WhatsAppLiveChat;
