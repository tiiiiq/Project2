'use client';

import SidebarSupervisor from '@/components/SidebarSupervisor';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';
import { Send, Paperclip, MoreVertical, CheckCheck, Layout } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { API_URL, getHeaders } from '@/config/api';

interface Project {
  id: number;
  name: string;
}

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

export default function SupervisorChatPage() {
  const [message, setMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get current user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUserId(user.id);
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    } else {
      setMessages([]);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/supervisor/projects`, {
        headers: getHeaders(token!),
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data.data.projects);
        if (data.data.projects.length > 0) {
          setSelectedProjectId(data.data.projects[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchMessages = async () => {
    if (!selectedProjectId) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/api/chat?projectId=${selectedProjectId}`, {
        headers: getHeaders(token!),
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
    if (!message.trim() || !selectedProjectId) return;

    const token = localStorage.getItem('token');
    const body = { 
      content: message,
      projectId: selectedProjectId 
    };
    
    const sentMessage = message;
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: getHeaders(token!),
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchMessages();
      } else {
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
      <SidebarSupervisor isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <PageHeaderSupervisor title="غرفة الدردشة" onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="bg-gray-50 border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#090832] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg md:text-xl">👥</span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-black">قروب الدردشة</h2>
              {selectedProjectId && (
                <p className="text-xs text-gray-500 font-bold">
                  المشروع الحالي: {projects.find(p => p.id === selectedProjectId)?.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-gray-400" />
            <select
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(Number(e.target.value))}
              className="bg-white border border-gray-200 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-bold outline-none"
            >
              <option value="">اختر المشروع...</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* منطقة عرض الرسائل */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/30">
          {!selectedProjectId ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <Send className="w-10 h-10 opacity-20" />
              </div>
              <p className="font-bold">يرجى اختيار مشروع لبدء المحادثة</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <p className="font-bold italic">لا توجد رسائل بعد.. ابدأ بالترحيب بالفريق!</p>
            </div>
          ) : (
            messages.map((msg) => {
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
                      <span className="text-[10px] md:text-xs text-gray-500 font-medium">{formatTime(msg.created_at || msg.createdAt)}</span>
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
            })
          )}
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
              disabled={!selectedProjectId}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={selectedProjectId ? "اكتب رسالتك هنا..." : "اختر مشروعاً أولاً"}
              className="flex-1 px-4 py-2 md:py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm md:text-base focus:border-[#090832] transition-colors disabled:cursor-not-allowed"
            />
            <button 
              type="submit"
              disabled={!message.trim() || !selectedProjectId}
              className="p-2 md:p-3 bg-[#090832] text-white rounded-xl hover:bg-[#1a1945] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
