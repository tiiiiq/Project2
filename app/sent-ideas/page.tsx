'use client';

import SidebarSupervisor from '@/components/SidebarSupervisor';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';
import Link from 'next/link';
import { useState } from 'react';

export default function SentIdeasPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const ideas = [
        "نظام إدارة مشاريع التخرج الذكي",
        "تطبيق توصيل الطلبات بالدرون",
        "منصة تعلم اللغات بالذكاء الاصطناعي",
        "نظام تتبع اللياقة البدنية المتطور",
        "تطبيق إدارة المخازن والمستودعات",
    ];

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden lg:static" dir="rtl">
            <SidebarSupervisor isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PageHeaderSupervisor title="الأفكار المرسلة" onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 flex items-center justify-center overflow-hidden">
                    <div className="bg-white w-full max-w-3xl border-2 border-[#1E90FF] rounded-lg p-6 shadow-sm relative flex flex-col max-h-full overflow-hidden">
                        <h2 className="text-xl font-bold text-[#090832] mb-6 border-b pb-4">قائمة الأفكار المستلمة</h2>

                        <div className="space-y-3 flex-1 overflow-y-auto pr-2 min-h-0">
                            {ideas.map((idea, index) => (
                                <Link
                                    key={index}
                                    href="/supervisor-idea-details"
                                    className="bg-[#D9E6F6] p-4 rounded-lg text-right font-bold text-lg text-[#090832] shrink-0 hover:bg-[#C5D9F1] transition-all border border-transparent hover:border-[#9BB1D9] block shadow-sm"
                                >
                                    {idea}
                                </Link>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
