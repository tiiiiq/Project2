'use client';

import Sidebar from '@/components/Sidebar';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';

import { useState } from 'react';

export default function GenerateIdeasPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const ideas = [
        "فكرة",
        "فكرة",
        "فكرة",
        "فكرة",
        "فكرة",
    ];

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden lg:static" dir="rtl">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PageHeader title="AI SUPERVISOR" onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 flex items-center justify-center overflow-hidden">
                    <div className="bg-white w-full max-w-3xl border-2 border-[#1E90FF] rounded-lg p-6 shadow-sm relative flex flex-col max-h-full overflow-hidden">
                        <p className="text-center text-gray-800 text-base mb-6 font-medium shrink-0">
                            تأكد ان كل الفريق ادخل بياناتهم واضغط البدء لجلب الافكار المقترحة لكم من الذكاء الاصطناعي
                        </p>

                        <div className="flex justify-center gap-6 mb-8 px-6 shrink-0">
                            <PrimaryButton size="md" className="w-full max-w-[160px] bg-[#585C9A] hover:bg-[#4A4E85] text-lg py-2">
                                الافكار المحفوظة
                            </PrimaryButton>
                            <PrimaryButton size="md" className="w-full max-w-[160px] bg-[#585C9A] hover:bg-[#4A4E85] text-lg py-2">
                                توليد افكار
                            </PrimaryButton>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto pr-2 min-h-0">
                            {ideas.map((idea, index) => (
                                <Link
                                    key={index}
                                    href="/idea-details"
                                    className="bg-[#D9E6F6] p-3 rounded-sm text-center font-bold text-lg text-black shrink-0 hover:bg-[#C5D9F1] transition-colors block"
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
