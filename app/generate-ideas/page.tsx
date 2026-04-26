'use client';

import Sidebar from '@/components/Sidebar';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PageHeader from '@/components/PageHeader';
import Link from 'next/link';
import { useState } from 'react';
import { API_URL, getHeaders } from '@/config/api';

export default function GenerateIdeasPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [ideas, setIdeas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [difficulty, setDifficulty] = useState('متوسط');

    const handleGenerateIdeas = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/ai/generate-ideas`, {
                method: 'POST',
                headers: getHeaders(token),
                body: JSON.stringify({ difficulty }),
            });

            const data = await response.json();

            if (response.ok) {
                // The API returns an array of {title, summary} or an object {ideas: [...]}
                setIdeas(Array.isArray(data) ? data : (data.ideas || []));
            } else {
                setError(data.message || 'فشل في توليد الأفكار');
            }
        } catch (err: any) {
            setError('تعذر الاتصال بالخادم. تأكد من تشغيل الـ backend.');
        } finally {
            setLoading(false);
        }
    };

    const handleFetchSavedIdeas = async () => {
        setLoading(true);
        setError('');
        setIdeas([]);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/projects/ideas/saved`, {
                method: 'GET',
                headers: getHeaders(token),
            });

            const data = await response.json();

            if (response.ok) {
                setIdeas(data.data.ideas || []);
            } else {
                setError(data.message || 'فشل في جلب الأفكار المحفوظة');
            }
        } catch (err: any) {
            setError('تعذر الاتصال بالخادم. تأكد من تشغيل الـ backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden lg:static" dir="rtl">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PageHeader title="AI SUPERVISOR" onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 flex items-center justify-center overflow-hidden">
                    <div className="bg-white w-full max-w-4xl border-2 border-[#1E90FF] rounded-lg p-6 shadow-sm relative flex flex-col max-h-full overflow-hidden">
                        <p className="text-center text-gray-800 text-base mb-6 font-medium shrink-0">
                            تأكد ان كل الفريق ادخل بياناتهم واضغط البدء لجلب الافكار المقترحة لكم من الذكاء الاصطناعي
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 px-6 shrink-0">
                            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                <label className="text-sm font-bold text-gray-600">مدى صعوبة المشروع:</label>
                                <select 
                                    value={difficulty} 
                                    onChange={(e) => setDifficulty(e.target.value)}
                                    className="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                                >
                                    <option value="سهل">سهل</option>
                                    <option value="متوسط">متوسط</option>
                                    <option value="صعب">صعب</option>
                                </select>
                            </div>
                            
                            <div className="flex gap-4">
                                <PrimaryButton 
                                    size="md" 
                                    className="min-w-[140px] bg-[#585C9A] hover:bg-[#4A4E85] text-lg py-2"
                                    onClick={handleFetchSavedIdeas}
                                    disabled={loading}
                                >
                                    {loading ? 'جاري التحميل...' : 'الافكار المحفوظة'}
                                </PrimaryButton>
                                <PrimaryButton 
                                    size="md" 
                                    className="min-w-[140px] bg-[#585C9A] hover:bg-[#4A4E85] text-lg py-2"
                                    onClick={handleGenerateIdeas}
                                    disabled={loading}
                                >
                                    {loading ? 'جاري التوليد...' : 'توليد افكار'}
                                </PrimaryButton>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 text-center rounded text-sm font-bold">
                                {error}
                            </div>
                        )}

                        <div className="space-y-3 flex-1 overflow-y-auto pr-2 min-h-0">
                            {ideas.length > 0 ? (
                                ideas.map((idea, index) => (
                                    <Link
                                        key={index}
                                        href="/idea-details"
                                        onClick={() => localStorage.setItem('selectedIdea', JSON.stringify(idea))}
                                        className="bg-[#D9E6F6] p-3 rounded-sm text-center font-bold text-lg text-black shrink-0 hover:bg-[#C5D9F1] transition-colors block"
                                    >
                                        {idea.title}
                                    </Link>
                                ))
                            ) : (
                                !loading && (
                                    <div className="text-center text-gray-400 mt-10 italic">
                                        لا توجد أفكار بعد. اضغط على "توليد افكار" للبدء.
                                    </div>
                                )
                            )}

                            {loading && (
                                <div className="flex flex-col items-center justify-center mt-10 space-y-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF]"></div>
                                    <p className="text-[#1E90FF] font-medium animate-pulse">جاري تحليل بيانات الفريق وتوليد أفكار مبتكرة...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
