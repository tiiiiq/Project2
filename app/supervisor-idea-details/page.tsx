'use client';

import SidebarSupervisor from '@/components/SidebarSupervisor';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useState, useEffect, Suspense } from 'react';
import { OctagonX, CheckCircle, Clock } from 'lucide-react';
import { API_URL, getHeaders } from '@/config/api';
import { useRouter, useSearchParams } from 'next/navigation';

function SupervisorIdeaDetailsContent() {
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
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
                    const res = await fetch(`${API_URL}/api/supervisor/ideas/${ideaId}`, {
                        headers: getHeaders(token)
                    });
                    const data = await res.json();
                    if (res.ok) {
                        setIdea(data.data.idea);
                        localStorage.setItem('selectedIdeaForReview', JSON.stringify(data.data.idea));
                    } else {
                        setMsg({ type: 'error', text: data.message || 'فشل في جلب تفاصيل الفكرة' });
                    }
                } catch (err) {
                    setMsg({ type: 'error', text: 'تعذر الاتصال بالخادم' });
                }
            };
            fetchIdea();
        } else {
            const storedIdea = localStorage.getItem('selectedIdeaForReview');
            if (storedIdea) {
                setIdea(JSON.parse(storedIdea));
            } else {
                router.push('/sent-ideas');
            }
        }
    }, [router, searchParams]);

    const handleReview = async (status: 'accepted' | 'rejected', reason?: string) => {
        setLoading(true);
        setMsg({ type: '', text: '' });
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/supervisor/ideas/${idea.id}/review`, {
                method: 'POST',
                headers: getHeaders(token),
                body: JSON.stringify({ status, reason })
            });

            const data = await res.json();
            if (res.ok) {
                setMsg({ type: 'success', text: status === 'accepted' ? 'تم قبول الفكرة بنجاح!' : 'تم إرسال الرفض للمشروع.' });
                // Update local state to reflect change immediately
                setIdea({ ...idea, is_accepted: status === 'accepted', rejection_reason: reason || null });
                if (status === 'rejected') setIsRejectModalOpen(false);
            } else {
                setMsg({ type: 'error', text: data.message || 'فشل في تحديث حالة الفكرة' });
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
            <SidebarSupervisor isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PageHeaderSupervisor title="تفاصيل الفكرة للمراجعة" backHref="/sent-ideas" onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 flex items-center justify-center overflow-hidden">
                    <div className="bg-white w-full max-w-3xl border-2 border-[#1E90FF] rounded-lg p-6 md:p-8 shadow-sm relative flex flex-col max-h-full overflow-y-auto">

                        {msg.text && (
                            <div className={`mb-6 p-4 rounded-lg text-center font-bold ${msg.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                {msg.text}
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Idea Header */}
                            <div className="text-center pb-4 border-b border-gray-100">
                                <h1 className="text-2xl md:text-3xl font-bold text-[#1E90FF] mb-2">{idea.title}</h1>
                                {idea.Project && (
                                    <p className="text-gray-500 font-medium">مشروع: {idea.Project.title}</p>
                                )}
                            </div>

                            {/* Status logic */}
                            {idea.is_accepted && (
                                <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3 text-green-700">
                                    <CheckCircle className="w-6 h-6" />
                                    <span className="font-bold">لقد قمت بقبول هذه الفكرة مسبقاً.</span>
                                </div>
                            )}

                            {idea.is_accepted === false && idea.rejection_reason && (
                                <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex flex-col gap-2">
                                    <div className="flex items-center gap-3 text-red-700">
                                        <OctagonX className="w-6 h-6" />
                                        <span className="font-bold">تم رفض هذه الفكرة:</span>
                                    </div>
                                    <p className="text-red-600 bg-white/50 p-3 rounded-lg border border-red-100 italic">
                                        "{idea.rejection_reason}"
                                    </p>
                                </div>
                            )}

                            {/* Concept Text */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-lg">نص الفكرة:</label>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {idea.detailed_description}
                                </div>
                            </div>

                            {/* Implementation Duration */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-lg">مدة تنفيذ الفكرة:</label>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-800 flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-gray-400" />
                                    <span>{idea.execution_time}</span>
                                </div>
                            </div>

                            {/* Idea Summary */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-lg">ملخص الفكرة:</label>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-800 leading-relaxed italic">
                                    {idea.summary}
                                </div>
                            </div>

                            {/* Action Buttons - Only show if not reviewed yet or allow re-review if needed */}
                            {(!idea.is_accepted && !idea.rejection_reason) && (
                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                                    <PrimaryButton 
                                        size='lg' 
                                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                                        onClick={() => handleReview('accepted')}
                                        disabled={loading}
                                    >
                                        {loading ? 'جاري المعالجة...' : 'أوافق على الفكرة'}
                                    </PrimaryButton>
                                    <button
                                        onClick={() => setIsRejectModalOpen(true)}
                                        disabled={loading}
                                        className="w-full sm:w-auto px-8 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-all font-bold text-lg disabled:opacity-50"
                                    >
                                        أرفض الفكرة
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>

            {/* Reject Idea Modal */}
            {isRejectModalOpen && (
                <RejectIdeaModal 
                    onClose={() => setIsRejectModalOpen(false)} 
                    onConfirm={(reason) => handleReview('rejected', reason)}
                    isSubmitting={loading}
                />
            )}
        </div>
    );
}

const RejectIdeaModal = ({ onClose, onConfirm, isSubmitting }: { onClose: () => void, onConfirm: (reason: string) => void, isSubmitting: boolean }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(reason);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md shadow-2xl rounded-2xl overflow-hidden animate-fade-in">
                {/* Header Modal */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <OctagonX className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-black">سبب رفض الفكرة</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 text-xl">✕</button>
                </div>

                {/* Form Modal */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اكتب سبب الرفض هنا</label>
                        <textarea
                            required
                            rows={4}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9BB1D9] focus:border-transparent outline-none transition-all resize-none"
                            placeholder="مثال: الفكرة مكررة أو لا تتناسب مع المسار الأكاديمي..."
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <PrimaryButton 
                            type="submit" 
                            size="lg" 
                            className="flex-1 order-2 sm:order-1 bg-red-600 hover:bg-red-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرفض'}
                        </PrimaryButton>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium order-1 sm:order-2"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function SupervisorIdeaDetailsPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF]"></div>
            </div>
        }>
            <SupervisorIdeaDetailsContent />
        </Suspense>
    );
}
