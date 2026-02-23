'use client';

import {
    LayoutDashboard,
    FolderKanban,
    MessageSquare,
    LogOut,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const SidebarSupervisor: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const pathname = usePathname();

    const menuItems = [
        { icon: LayoutDashboard, label: 'الرئيسية', href: '/supervisorDashboard' },
        { icon: FolderKanban, label: 'المشروع', href: '/supervisorProject' },
        { icon: MessageSquare, label: 'قروب الدردشة', href: '/supervisorChat' },
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden shadow-2xl backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-[#090832] text-white border-l lg:border-r border-gray-200 flex flex-col transition-transform duration-300 transform lg:translate-x-0 lg:static ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
                }`}>
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="truncate">
                                <h1 className="text-xl font-bold ">AI SUPERVISOR</h1>
                                <p className="text-sm opacity-70">مدير المشاريع الذكي</p>
                            </div>
                        </div>
                        {/* Close button for mobile */}
                        <button
                            onClick={onClose}
                            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${isActive
                                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-r-4 border-blue-500'
                                            : 'text-gray-50 hover:bg-blue-950 '
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <button className="w-full flex items-center gap-3 p-3 text-gray-50 hover:bg-blue-950 cursor-pointer rounded-lg transition-colors mt-2">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">تسجيل الخروج</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SidebarSupervisor;
