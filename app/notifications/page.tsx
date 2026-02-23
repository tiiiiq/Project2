'use client';

import Sidebar from '@/components/Sidebar';
import PageHeader from '@/components/PageHeader';
import { Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

export default function NotificationsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'approval',
            message: 'وافق المشرف على الفكرة: نظام إدارة مشاريع التخرج الذكي',
            date: 'منذ ساعتين',
        },
        {
            id: 2,
            type: 'rejection',
            message: 'رفض المشرف الفكرة: تطبيق توصيل الطلبات بالدرون',
            date: 'منذ 5 ساعات',
        },
        {
            id: 3,
            type: 'approval',
            message: 'وافق المشرف على طلب الانضمام للفريق',
            date: 'منذ يوم واحد',
        },
    ]);

    const deleteNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden lg:static" dir="rtl">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PageHeader title="الإشعارات" onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                <Bell className="w-16 h-16 mb-4 opacity-20" />
                                <p className="text-xl">لا توجد إشعارات حالياً</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex items-center justify-between p-5 rounded-xl border transition-all duration-200 hover:shadow-md ${notification.type === 'approval'
                                        ? 'bg-green-50 border-green-100 text-green-800'
                                        : 'bg-[#FFF0F3] border-[#FFE1E6] text-[#D9363E]'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {notification.type === 'approval' ? (
                                            <CheckCircle2 className="w-6 h-6 shrink-0" />
                                        ) : (
                                            <XCircle className="w-6 h-6 shrink-0" />
                                        )}
                                        <div>
                                            <p className="font-bold text-lg">{notification.message}</p>
                                            <span className="text-sm opacity-70">{notification.date}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => deleteNotification(notification.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
                                        title="حذف الإشعار"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

// Simple reuseable Bell icon since it's not imported from lucide-react in this snippet
function Bell({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    );
}
