'use client';

import { Bell, ArrowRight, Menu, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface PageHeaderProps {
    title: string;
    backHref?: string;
    onMenuClick?: () => void;
}

const PageHeaderSupervisor: React.FC<PageHeaderProps> = ({ title, backHref, onMenuClick }) => {
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
                <Link href="/supervisorProfile" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <span className="font-medium text-sm md:text-base hidden sm:inline">الملف الشخصي</span>
                    <span className="sm:hidden p-2"><User className="w-5 h-5 text-gray-500" /></span>
                </Link>
                <Link href="/notifications" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="w-5 h-5 md:w-6 md:h-6" />
                </Link>
            </div>
        </header>
    );
};

export default PageHeaderSupervisor;
