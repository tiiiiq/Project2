'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Clock, Info, XCircle, Trash2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import SidebarSupervisor from '@/components/SidebarSupervisor';
import PageHeader from '@/components/PageHeader';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';
import { API_URL, getHeaders } from '@/config/api';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    link: string;
    created_at: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [userRole, setUserRole] = useState<string>('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    const fetchNotifications = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/api/notifications`, {
                headers: getHeaders(token)
            });
            const data = await res.json();
            if (res.ok) {
                setNotifications(data.data.notifications);
            } else {
                setErrorMsg(data.message || 'فشل في جلب الإشعارات');
            }
        } catch (err: any) {
            setErrorMsg('تعذر الاتصال بالخادم');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setUserRole(user.role);
        }
        fetchNotifications();
    }, []);

    const markAsRead = async (id: number | 'all') => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: getHeaders(token)
            });
            if (res.ok) {
                if (id === 'all') {
                    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
                } else {
                    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
                }
            }
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const deleteNotification = async (id: number) => {
        // Backend doesn't have delete yet, so we just filter out from UI or mark as read
        // For now let's just mark as read if delete is clicked or we can just leave it
        markAsRead(id);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'idea_submitted': return <Info className="w-5 h-5 text-blue-500" />;
            case 'idea_accepted': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'idea_rejected': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Bell className="w-5 h-5 text-indigo-500" />;
        }
    };

    // Build the correct navigation link based on notification type and stored link
    const getNotificationLink = (notification: Notification): string => {
        const link = notification.link || '';

        // If the link already contains ?id=, use it directly
        if (link.includes('?id=')) {
            return link;
        }

        // For idea-related notifications, route to the correct details page
        switch (notification.type) {
            case 'idea_accepted':
            case 'idea_rejected':
                return '/idea-details';
            case 'idea_submitted':
                return '/supervisor-idea-details';
            default:
                return link || '#';
        }
    };

    const handleDetailsClick = async (notification: Notification) => {
        await markAsRead(notification.id);
        const targetLink = getNotificationLink(notification);
        if (targetLink && targetLink !== '#') {
            router.push(targetLink);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden lg:static" dir="rtl">
            {userRole === 'supervisor' ? (
                <SidebarSupervisor isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            ) : (
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            )}

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {userRole === 'supervisor' ? (
                    <PageHeaderSupervisor title="الإشعارات" onMenuClick={() => setIsSidebarOpen(true)} />
                ) : (
                    <PageHeader title="الإشعارات" onMenuClick={() => setIsSidebarOpen(true)} />
                )}

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">إشعاراتي</h2>
                            {notifications.some(n => !n.is_read) && (
                                <button
                                    onClick={() => markAsRead('all')}
                                    className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    تحديد الكل كمقروء
                                </button>
                            )}
                        </div>

                        {errorMsg && (
                            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 text-red-700 text-center font-bold">
                                {errorMsg}
                            </div>
                        )}

                        <div className="space-y-4">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 animate-pulse h-24"></div>
                                ))
                            ) : notifications.length === 0 ? (
                                <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
                                    <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-500 font-bold text-lg">لا توجد إشعارات حالياً</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`bg-white p-4 md:p-6 rounded-xl border transition-all hover:shadow-md flex gap-4 ${notification.is_read ? 'border-gray-100 opacity-75' : 'border-indigo-100 bg-indigo-50/30'}`}
                                    >
                                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 ${notification.is_read ? 'bg-gray-100' : 'bg-white shadow-sm'}`}>
                                            {getIcon(notification.type)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`text-base font-bold ${notification.is_read ? 'text-gray-700' : 'text-indigo-900'}`}>
                                                    {notification.title}
                                                </h3>
                                                <span className="text-xs text-gray-400 flex items-center gap-1 font-medium whitespace-nowrap">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(notification.created_at).toLocaleDateString('ar-EG')}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                                {notification.message}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <button
                                                    onClick={() => handleDetailsClick(notification)}
                                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-all"
                                                >
                                                    عرض التفاصيل
                                                    <ArrowRight className="w-3 h-3" />
                                                </button>

                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors"
                                                    >
                                                        تحديد كمقروء
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

