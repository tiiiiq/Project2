'use client';

import {
    User,
    Mail,
    Lock,
    Camera,
    LayoutDashboard,
    FolderKanban,
    MessageSquare,
    ChevronLeft
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SidebarSupervisor from '@/components/SidebarSupervisor';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';
import PrimaryButton from '@/components/buttons/PrimaryButton';

export default function SupervisorProfilePage() {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden lg:static" dir="rtl">
           

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PageHeaderSupervisor title="الملف الشخصي" onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto ">
                        {/* عنوان الصفحة */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-[#090832] mb-2">الملف الشخصي (مشرف)</h1>
                            <p className="text-gray-500">عرض وتعديل معلوماتك الشخصية كمُشرف</p>
                        </div>

                        <div className="grid grid-cols-12 gap-8">
                            {/* ===== الشريط الجانبي الأيمن ===== */}
                            <div className="col-span-12 lg:col-span-4">
                                {/* بطاقة البروفايل */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                                    <div className="flex flex-col items-center text-center">
                                        {/* صورة البروفايل */}
                                        <div className="relative mb-4">
                                            <div className="w-28 h-28  bg-[#585C9A] rounded-2xl flex items-center justify-center shadow-lg">
                                                <User className="w-14 h-14 text-white" />
                                            </div>
                                            <button className="absolute -bottom-2 -left-2 w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors">
                                                <Camera className="w-4 h-4 text-[#090832]" />
                                            </button>
                                        </div>

                                        <h2 className="text-xl font-bold text-[#090832] mb-1">د. محمد علي</h2>
                                        <p className="text-gray-500 text-sm mb-4">مشرف أكاديمي</p>

                                        <div className="w-full pt-4 border-t border-gray-100">
                                            <div className="flex items-center justify-between py-2">
                                                <span className="text-sm text-gray-600">الإيميل</span>
                                                <span className="text-sm font-medium text-[#090832]">m.ali@university.edu</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* قائمة التنقل الجانبية الداخلية */}
                                <div className="bg-[#090832] text-gray-50 rounded-2xl shadow-sm border border-gray-100 p-4">
                                    <nav className="space-y-1">
                                        {[
                                            { icon: LayoutDashboard, label: 'الرئيسية', href: '/supervisorDashboard' },
                                            { icon: FolderKanban, label: 'المشروع', href: '/supervisorProject' },
                                            { icon: MessageSquare, label: 'قروب الدردشة', href: '/supervisorChat' },
                                        ].map((item, index) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={index}
                                                    href={item.href}
                                                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${isActive
                                                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 border-r-4 border-blue-500'
                                                        : 'text-gray-50 hover:bg-blue-950 '
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                                        <span className="font-medium">{item.label}</span>
                                                    </div>
                                                    <ChevronLeft className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                                </Link>
                                            );
                                        })}
                                    </nav>
                                </div>
                            </div>

                            {/* ===== المحتوى الرئيسي ===== */}
                            <div className="col-span-12 lg:col-span-8">
                                <div className="bg-white shadow-sm border border-gray-100 p-6 mb-6 rounded-2xl">
                                    <h3 className="text-lg font-bold text-[#090832] mb-6 flex items-center gap-2">
                                        <User className="w-5 h-5 text-[#9BB1D9]" />
                                        المعلومات الشخصية
                                    </h3>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                                            <input type="text" defaultValue="د. محمد علي" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9BB1D9] transition-all rounded-xl" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">الإيميل</label>
                                            <input type="email" defaultValue="m.ali@university.edu" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9BB1D9] transition-all rounded-xl" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                                            <div className="relative">
                                                <input type="password" defaultValue="********" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9BB1D9] transition-all" />
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <PrimaryButton type="submit" size="lg">حفظ التعديلات</PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
