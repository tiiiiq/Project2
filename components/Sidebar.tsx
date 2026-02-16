'use client';

import {
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageSquare,
  LogOut,
  ChevronRight,
  Sparkles,
  User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'الرئيسية', href: '/leaderDashboard' },
    { icon: FolderKanban, label: 'المشروع', href: '/project' },
    { icon: Users, label: 'فرق المشروع', href: '/projectGroup' },
    { icon: MessageSquare, label: 'غرفة الدردشة', href: '/chat' },
    { icon: User, label: 'الملف الشخصي', href: '/profile' },
  ];

  return (
    <aside className="w-64 bg-[#090832] text-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold ">AI SUPERVISOR</h1>
            <p className="text-sm ">مدير المشاريع الذكي</p>
          </div>
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
                      ? 'bg-blue-300 text-blue-600 border-r-4 border-blue-500'
                      : 'text-gray-50 hover:bg-blue-950  '
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
  );
};

export default Sidebar;