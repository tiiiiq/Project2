'use client';

import Sidebar from '@/components/Sidebar';
import PageHeader from '@/components/PageHeader';
import { Send, Paperclip, MoreVertical, CheckCheck } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { API_URL, getHeaders } from '@/config/api';

interface Message {
  id: number;
  content: string;
  sender_id: number;
  created_at?: string;
  createdAt?: string;
  User: {
    id: number;
    full_name: string;
    role: string;
  };
}

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
    }

    fetchMessages();

    // Start polling
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        headers: getHeaders(token),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(data.data.messages);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const body = { content: message };
    
    // Clear input immediately for better UX
    const sentMessage = message;
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchMessages();
      } else {
        // If failed, restore the message
        setMessage(sentMessage);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessage(sentMessage);
    }
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen bg-white flex overflow-hidden lg:static" dir="rtl">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <PageHeader title="غرفة الدردشة" onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="bg-gray-50 border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#585C9A] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg md:text-xl">👥</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-black">قروب الدردشة</h2>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* منطقة عرض الرسائل */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex items-start gap-2 md:gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.User.role === 'supervisor' ? 'bg-[#090832]' : 'bg-[#9BB1D9]'
                  }`}>
                  <span className="text-white font-bold text-xs md:text-sm">
                    {msg.User.full_name ? msg.User.full_name.charAt(0) : 'U'}
                  </span>
                </div>

                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-black text-xs md:text-sm">{msg.User.full_name}</span>
                    <span className="text-[10px] md:text-xs text-gray-500">{formatTime(msg.created_at || msg.createdAt)}</span>
                    {isMe && <CheckCheck className="w-3 h-3 md:w-4 md:h-4 text-[#9BB1D9]" />}
                  </div>
                  <div className={`px-3 md:px-4 py-2 md:py-3 rounded-2xl ${
                      isMe ? 'bg-[#C0F6CC] text-gray-900 rounded-l-lg' : 'bg-white border border-gray-200 text-gray-800 rounded-r-lg'
                    } shadow-sm`}>
                    <p className="text-sm md:text-base font-medium">{msg.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* شريط إدخال الرسالة */}
        <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-200 px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-3">
            <button type="button" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5 text-gray-600" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm md:text-base focus:border-[#585C9A] transition-colors"
            />
            <button 
              type="submit"
              disabled={!message.trim()}
              className="p-2 md:p-3 bg-[#585C9A] text-white rounded-xl hover:bg-[#4a4e82] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}