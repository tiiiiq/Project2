'use client';

import Sidebar from '@/components/Sidebar';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PageHeader from '@/components/PageHeader';
import { useState, useEffect, Suspense } from 'react';
import { API_URL, getHeaders } from '@/config/api';
import { useRouter, useSearchParams } from 'next/navigation';

function IdeaDetailsContent() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [idea, setIdea] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const ideaId = searchParams.get('id');
        if (ideaId) {
            // Fetch idea from API by ID (coming from notification link)
            const fetchIdea = async () => {
                const token = localStorage.getItem('token');
                try {
                    const res = await fetch(`${API_URL}/api/projects/ideas/${ideaId}`, {
                        headers: getHeaders(token)
                    });
                    const data = await res.json();
                    if (res.ok) {
                        setIdea(data.data.idea);
                        localStorage.setItem('selectedIdea', JSON.stringify(data.data.idea));
                    } else {
                        setMsg({ type: 'error', text: data.message || 'فشل في جلب تفاصيل الفكرة' });
                    }
                } catch (err) {
                    setMsg({ type: 'error', text: 'تعذر الاتصال بالخادم' });
                }
            };
            fetchIdea();
        } else {
            const storedIdea = localStorage.getItem('selectedIdea');
            if (storedIdea) {
                setIdea(JSON.parse(storedIdea));
            } else {
                router.push('/generate-ideas');
            }
        }
    }, [router, searchParams]);

    const handleSaveIdea = async () => {
        setLoading(true);
        setMsg({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/projects/save-idea`, {
                method: 'POST',
                headers: getHeaders(token),
                body: JSON.stringify(idea),
            });

            const data = await response.json();
            if (response.ok) {
                setMsg({ type: 'success', text: 'تم حفظ الفكرة في قائمتك بنجاح!' });
                if (data.data?.idea) {
                    setIdea(data.data.idea);
                    localStorage.setItem('selectedIdea', JSON.stringify(data.data.idea));
                }
            } else {
                setMsg({ type: 'error', text: data.message || 'فشل في حفظ الفكرة' });
            }
        } catch (err) {
            setMsg({ type: 'error', text: 'تعذر الاتصال بالخادم' });
        } finally {
            setLoading(false);
        }
    };

    const handleSendToSupervisor = async () => {
        if (!idea.id) {
            setMsg({ type: 'error', text: 'يجب حفظ الفكرة أولاً قبل إرسالها للمشرف' });
            return;
        }

        setLoading(true);
        setMsg({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/projects/ideas/${idea.id}/send`, {
                method: 'POST',
                headers: getHeaders(token),
            });

            const data = await response.json();
            if (response.ok) {
                setMsg({ type: 'success', text: 'تم إرسال الفكرة للمشرف بنجاح!' });
                const updatedIdea = { ...idea, is_sent: true };
                setIdea(updatedIdea);
                localStorage.setItem('selectedIdea', JSON.stringify(updatedIdea));
            } else {
                setMsg({ type: 'error', text: data.message || 'فشل في إرسال الفكرة' });
            }
        } catch (err) {
            setMsg({ type: 'error', text: 'تعذر الاتصال بالخادم' });
        } finally {
            setLoading(false);
        }
    };

    if (!idea) return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF]"></div>
        </div>
    );

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden lg:static" dir="rtl">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PageHeader title="تفاصيل الفكرة" backHref="/generate-ideas" onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 flex items-center justify-center overflow-hidden font-sans">
                    <div className="bg-white w-full max-w-3xl border-2 border-[#1E90FF] rounded-lg p-6 md:p-8 shadow-sm relative flex flex-col max-h-full overflow-y-auto">

                        {msg.text && (
                            <div className={`mb-6 p-4 rounded-lg text-center font-bold ${msg.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                {msg.text}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Idea Title */}
                            <div className="text-center pb-4 border-b border-gray-100">
                                <h1 className="text-2xl md:text-3xl font-bold text-[#1E90FF]">{idea.title}</h1>
                            </div>

                            {/* Concept Text */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-lg italic border-r-4 border-[#1E90FF] pr-3">نص الفكرة:</label>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {idea.detailed_description || 'جاري تحميل تفاصيل الفكرة...'}
                                </div>
                            </div>

                            {/* Implementation Duration */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-lg italic border-r-4 border-[#585C9A] pr-3">مدة تنفيذ الفكرة:</label>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-800 font-medium">
                                    {idea.execution_time || 'غير محددة'}
                                </div>
                            </div>

                            {/* Idea Summary */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-lg italic border-r-4 border-[#1E90FF] pr-3">ملخص الفكرة:</label>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-800 leading-relaxed italic">
                                    {idea.summary}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-center pt-6">
                                <PrimaryButton 
                                    size='lg' 
                                    className={`flex-1 ${idea.is_sent ? 'bg-green-600 cursor-not-allowed' : 'bg-[#1E90FF] hover:bg-[#1C86EE]'}`}
                                    onClick={handleSendToSupervisor}
                                    disabled={loading || idea.is_sent}
                                    title={!idea.id ? "يجب حفظ الفكرة أولاً" : (idea.is_sent ? "تم الإرسال مسبقاً" : "")}
                                >
                                    {idea.is_sent ? 'تم الإرسال للمشرف' : 'ارسال للمشرف'}
                                </PrimaryButton>
                                <PrimaryButton 
                                    size='lg' 
                                    className="flex-1 bg-[#585C9A] hover:bg-[#4A4E85]"
                                    onClick={handleSaveIdea}
                                    disabled={loading || idea.id}
                                >
                                    {idea.id ? 'تم الحفظ في القائمة' : (loading ? 'جاري الحفظ...' : 'حفظ للقائمة')}
                                </PrimaryButton>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}

export default function IdeaDetailsPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF]"></div>
            </div>
        }>
            <IdeaDetailsContent />
        </Suspense>
    );
}
