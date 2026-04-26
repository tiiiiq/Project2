'use client';

import { Bell, ArrowRight, Menu } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { API_URL, getHeaders } from '@/config/api';

interface PageHeaderProps {
    title: string;
    backHref?: string;
    onMenuClick?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, backHref, onMenuClick }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch(`${API_URL}/api/notifications`, {
                    headers: getHeaders(token)
                });
                const data = await res.json();
                if (res.ok) {
                    const unread = data.data.notifications.filter((n: any) => !n.is_read).length;
                    setUnreadCount(unread);
                }
            } catch (err) {
                console.error('Error fetching unread count:', err);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 md:gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 text-gray-500 hover:text-gray-700 lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>
                {backHref && (
                    <Link href={backHref} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                    </Link>
                )}
                <h1 className="text-lg md:text-xl font-bold text-[#090832] truncate max-w-[150px] md:max-w-none">{title}</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <Link href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <span className="font-medium text-sm md:text-base hidden sm:inline">الملف الشخصي</span>
                    <span className="sm:hidden p-2"><User className="w-5 h-5 text-gray-500" /></span>
                </Link>
                <Link href="/notifications" className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                    <Bell className="w-5 h-5 md:w-6 md:h-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full animate-pulse">
                            {unreadCount > 9 ? '+9' : unreadCount}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
};

import { User } from 'lucide-react';

export default PageHeader;
