'use client';

import SidebarSupervisor from '@/components/SidebarSupervisor';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { API_URL, getHeaders } from '@/config/api';

export default function SentIdeasPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [ideas, setIdeas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIncomingIdeas = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`${API_URL}/api/supervisor/ideas`, {
                    headers: getHeaders(token)
                });
                const data = await res.json();
                if (res.ok) {
                    setIdeas(data.data.ideas);
                }
            } catch (err) {
                console.error('Fetch ideas error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchIncomingIdeas();
    }, []);

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
                            {loading ? (
                                <p className="text-center py-10 font-bold text-gray-400 animate-pulse">جاري التحميل...</p>
                            ) : ideas.length === 0 ? (
                                <p className="text-center py-10 font-bold text-gray-400 italic">لا توجد أفكار بانتظار المراجعة حالياً.</p>
                            ) : ideas.map((idea) => (
                                <Link
                                    key={idea.id}
                                    href="/supervisor-idea-details"
                                    onClick={() => localStorage.setItem('selectedIdeaForReview', JSON.stringify(idea))}
                                    className="bg-[#D9E6F6] p-4 rounded-lg text-right font-bold text-lg text-[#090832] shrink-0 hover:bg-[#C5D9F1] transition-all border border-transparent hover:border-[#9BB1D9] block shadow-sm"
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{idea.title}</span>
                                        <span className="text-sm font-normal text-gray-500 bg-white/50 px-2 py-1 rounded">مشروع: {idea.Project?.title}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
