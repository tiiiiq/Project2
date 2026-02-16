// app/chat/page.tsx
'use client';

import Sidebar from '@/components/Sidebar';
import { Send, Smile, Paperclip, MoreVertical, CheckCheck, User } from 'lucide-react';
import { useState } from 'react';

export default function ChatPage() {
  const [message, setMessage] = useState('');

  // رسائل المحادثة
  const messages = [
    {
      id: 1,
      sender: 'طارق',
      content: 'مرحباً',
      time: '10:30 ص',
      isMe: false,
    },
    {
      id: 2,
      sender: 'شهاب',
      content: 'حياكم',
      time: '10:31 ص',
      isMe: false,
    },
    {
      id: 3,
      sender: 'المشرف',
      content: 'جاهزين ؟؟',
      time: '10:32 ص',
      isMe: true,
    },
    {
      id: 4,
      sender:'طارق',
      content: 'ان شاء الله',
      time: '10:33 ص',
      isMe: false,
    },
  ];

  return (
      <div className="flex min-h-screen bg-white">
      <Sidebar />
        <main className="flex-1 ">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#9BB1D9] rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">👥</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">قروب الدردشة</h2>
          
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* منطقة عرض الرسائل */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}
          >
            {/* صورة المرسل */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              msg.sender === 'طارق' ? 'bg-[#9BB1D9]' :
              msg.sender === 'شهاب' ? 'bg-[#8AA0C8]' :
              msg.sender === 'المشرف' ? 'bg-[#090832]' :
              'bg-gray-400'
            }`}>
              <span className="text-white font-bold text-sm">
                {msg.sender.charAt(0)}
              </span>
            </div>

            {/* محتوى الرسالة */}
            <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-black text-sm">{msg.sender}</span>
                <span className="text-xs text-gray-500 font-medium">{msg.time}</span>
                {msg.isMe && (
                  <CheckCheck className="w-4 h-4 text-[#9BB1D9]" />
                )}
              </div>
              <div className={`px-4 py-3 rounded-2xl ${
                msg.isMe 
                  ? 'bg-[#C0F6CC] text-gray-900 rounded-l-lg' 
                  : 'bg-[#B3B3B3]  rounded-r-lg'
              } shadow-sm`}>
                <p className="text-base font-medium">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}

        {/* مؤشر الكتابة */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
            <span className="text-gray-600 font-bold">...</span>
          </div>
          <div className="bg-white border border-gray-200 px-5 py-3 rounded-2xl rounded-r-xl shadow-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        </div>
      </div>

      {/* شريط إدخال الرسالة */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالتك هنا..."
              className="w-full px-5 py-3 bg-[#CADFC5] border border-gray-200 rounded-xl outline-0 transition-all text-black font-medium placeholder:font-normal"
            />

          </div>
          
          <button className="p-3 bg-[#CADFC5] text-white rounded-xl hover:bg-[#bae2b0] transition-all duration-300 shadow-sm hover:shadow-md">
            <Send className="w-5 h-5 text-green-700" />
          </button>
        </div>
      </div>
      </main>
    </div>
  );
}