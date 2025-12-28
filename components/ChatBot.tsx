
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SystemSpecs, ComparisonResult } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface Props {
  specs: SystemSpecs | null;
  result: ComparisonResult | null;
}

const ChatBot: React.FC<Props> = ({ specs, result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(() => {
    try {
      return localStorage.getItem('os_guru_opened') === 'true';
    } catch {
      return false;
    }
  });
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hey! I\'m your OS Guru. Ask me anything about your computer or the recommendations I gave you! I\'ll keep it simple. 😊' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initChat = () => {
    if (chatRef.current) return chatRef.current;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const systemInstruction = `
      You are the OS Guru. Your goal is to help the user understand their OS options in a very simple, friendly, and concise way.
      
      CRITICAL RULES:
      1. Keep answers SHORT. Usually 1-3 sentences.
      2. Use simple language. Avoid heavy tech jargon unless specifically asked.
      3. Be encouraging and friendly. Use an emoji occasionally.
      4. Focus on the user's specific hardware and the recommendations already provided.
      
      User Context:
      - Current OS: ${specs?.os || 'Unknown'}
      - Experience: ${specs?.userExperience || 'beginner'}
      - Recommended: ${result?.recommendations?.map(r => r.osName).join(', ') || 'None yet'}

      Topics you know about:
      - Windows 11 (Copilot, Snap Layouts)
      - macOS Sequoia (Apple Intelligence, iPhone Mirroring)
      - Linux (Ubuntu, Mint, Zorin, and even pro stuff like NixOS/Arch)

      If they ask a complex question, give a "TL;DR" (Too Long; Didn't Read) style simple version first.
    `;

    chatRef.current = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });
    return chatRef.current;
  };

  const toggleChat = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && !hasBeenOpened) {
      setHasBeenOpened(true);
      try {
        localStorage.setItem('os_guru_opened', 'true');
      } catch (e) {
        console.warn('LocalStorage not available');
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const chat = initChat();
      const response = await chat.sendMessage({ message: userMessage });
      const modelText = response.text || "Sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: "Oops, something went wrong. Try again!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Chat window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[320px] sm:w-[400px] h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-emerald-500 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                 <span className="text-xl">🧙‍♂️</span>
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest leading-none">OS Guru</h4>
                <p className="text-[10px] text-emerald-100 font-bold mt-1">Simple & Fast Helper</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-emerald-100 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-emerald-500 text-white rounded-tr-none shadow-md shadow-emerald-500/10' 
                  : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping}
                className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button 
        onClick={toggleChat}
        className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-90 transition-all group"
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <div className="relative">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            {!hasBeenOpened && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse"></div>
            )}
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatBot;
