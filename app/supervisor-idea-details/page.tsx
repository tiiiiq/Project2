'use client';

import SidebarSupervisor from '@/components/SidebarSupervisor';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useState } from 'react';
import { OctagonX } from 'lucide-react';

export default function SupervisorIdeaDetailsPage() {
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden lg:static" dir="rtl">
            <SidebarSupervisor isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PageHeaderSupervisor title="تفاصيل الفكرة للمراجعة" backHref="/sent-ideas" onMenuClick={() => setIsSidebarOpen(true)} />

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-6 flex items-center justify-center overflow-hidden">
                    <div className="bg-white w-full max-w-3xl border-2 border-[#1E90FF] rounded-lg p-6 md:p-8 shadow-sm relative flex flex-col max-h-full overflow-y-auto">

                        <div className="space-y-6">
                            {/* Concept Text */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-lg">نص الفكرة:</label>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-800">
                                    تصميم تطبيق يربط بين الطلاب والمشرفين الأكاديميين لتسهيل عملية اختيار ومتابعة مشاريع التخرج باستخدام تقنيات الذكاء الاصطناعي.
                                </div>
                            </div>

                            {/* Implementation Duration */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-lg">مدة تنفيذ الفكرة:</label>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-800">
                                    4 - 6 أشهر
                                </div>
                            </div>

                            {/* Idea Summary */}
                            <div>
                                <label className="block text-gray-700 font-bold mb-2 text-lg">ملخص الفكرة:</label>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-800 leading-relaxed">
                                    يهدف المشروع إلى أتمتة عملية التوفيق بين مهارات الطلاب ومتطلبات المشاريع المتاحة، مع توفير واجهة تفاعلية لمتابعة الإنجاز والمهام اليومية. يتضمن النظام لوحة تحكم ذكية للمشرفين لتقييم التقدم وتقديم الملاحظات بشكل فوري.
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                                <PrimaryButton size='lg' className="w-full sm:w-auto">
                                    أوافق على الفكرة
                                </PrimaryButton>
                                <button
                                    onClick={() => setIsRejectModalOpen(true)}
                                    className="w-full sm:w-auto px-8 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-all font-bold text-lg"
                                >
                                    أرفض الفكرة
                                </button>
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            {/* Reject Idea Modal */}
            {isRejectModalOpen && (
                <RejectIdeaModal onClose={() => setIsRejectModalOpen(false)} />
            )}
        </div>
    );
}

const RejectIdeaModal = ({ onClose }: { onClose: () => void }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onClose();
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
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2">✕</button>
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
                        <PrimaryButton type="submit" size="lg" className="flex-1 order-2 sm:order-1">إرسال الرفض</PrimaryButton>
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium order-1 sm:order-2">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
