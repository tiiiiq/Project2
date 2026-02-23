'use client';

import Sidebar from '@/components/Sidebar';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PageHeader from '@/components/PageHeader';

import { useState } from 'react';

export default function IdeaDetailsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="h-screen bg-gray-100 flex overflow-hidden lg:static" dir="rtl">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PageHeader title="تفاصيل الفكرة" backHref="/generate-ideas" onMenuClick={() => setIsSidebarOpen(true)} />

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
                            <div className="flex gap-4 justify-center pt-6">
                                <PrimaryButton size='lg' className=" ">
                                    ارسال للمشرف
                                </PrimaryButton>
                                <PrimaryButton size='lg' className=" ">
                                    حفظ للقائمة
                                </PrimaryButton>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
