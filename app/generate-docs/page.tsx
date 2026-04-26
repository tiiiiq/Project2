'use client';

import Sidebar from '@/components/Sidebar';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import PageHeader from '@/components/PageHeader';
import { useState, useEffect } from 'react';
import { Save, ChevronLeft, RefreshCcw, Play, Loader2 } from 'lucide-react';
import { API_URL, getHeaders } from '@/config/api';

const steps = [
    {
        id: 'abstract',
        title: 'إنشاء الـ Abstract',
        description: 'ملخص الفكرة المولد بالذكاء الاصطناعي',
    },
    {
        id: 'objectives',
        title: 'إنشاء الـ Objectives',
        description: ' اهداف المشروع المقترحة من الذكاء الاصطناعي',
    },
    {
        id: 'scope',
        title: 'إنشاء الـ Scope',
        description: ' نطاق المشروع المولد بالذكاء الاصطناعي',
    },
    {
        id: 'timeline',
        title: 'إنشاء الـ Timeline',
        description: 'الجدول الزمني المقترح من الذكاء الاصطناعي',
    },
    {
        id: 'risks',
        title: 'تحليل مخاطر المشروع المحتملة من الذكاء الاصطناعي',
        description: 'تحليل المخاطر المحتملة من الذكاء الاصطناعي',
    },
    {
        id: 'resources',
        title: 'إنشاء المصادر التعليمية',
        description: 'مصادر تعليمية من يوتيوب وكتب ومواقع مقترحة من الذكاء الاصطناعي',
    }
];

export default function GenerateDocsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isRegenModalOpen, setIsRegenModalOpen] = useState(false);
    const [contents, setContents] = useState<Record<string, string>>({
        abstract: '',
        objectives: '',
        scope: '',
        timeline: '',
        risks: '',
        resources: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchDocs = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch(`${API_URL}/api/documents`, {
                    headers: getHeaders(token)
                });
                const data = await res.json();
                if (res.ok && data.data.documents) {
                    const docs = data.data.documents;
                    setContents({
                        abstract: docs.abstract || '',
                        objectives: docs.objectives || '',
                        scope: docs.scope || '',
                        timeline: docs.timeline || '',
                        risks: docs.risks || '',
                        resources: docs.resources || ''
                    });

                    // Auto-jump to first empty step
                    const firstEmptyIndex = steps.findIndex(step => !docs[step.id]);
                    if (firstEmptyIndex !== -1) {
                        setCurrentStep(firstEmptyIndex);
                    } else {
                        // All docs filled, stay at last step or first step
                        setCurrentStep(0);
                    }
                }
            } catch (err) {
                console.error('Error fetching docs:', err);
            }
        };
        fetchDocs();
    }, []);

    const generateDoc = async (notes?: string) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setIsLoading(true);
        const type = steps[currentStep].id;

        try {
            const res = await fetch(`${API_URL}/api/ai/generate-document`, {
                method: 'POST',
                headers: getHeaders(token),
                body: JSON.stringify({ type, notes })
            });
            const data = await res.json();
            if (res.ok) {
                setContents(prev => ({ ...prev, [type]: data.data.content }));
            } else {
                alert(data.message || 'فشل في توليد المستند');
            }
        } catch (err) {
            alert('تعذر الاتصال بالخادم');
        } finally {
            setIsLoading(false);
            setIsRegenModalOpen(false);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        setIsSaving(true);
        const type = steps[currentStep].id;
        const content = contents[type];

        try {
            const res = await fetch(`${API_URL}/api/documents/save`, {
                method: 'POST',
                headers: getHeaders(token),
                body: JSON.stringify({ type, content })
            });
            const data = await res.json();
            if (res.ok) {
                alert('تم حفظ المستند بنجاح');
            } else {
                alert(data.message || 'فشل في حفظ المستند');
            }
        } catch (err) {
            alert('تعذر الاتصال بالخادم');
        } finally {
            setIsSaving(false);
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const isLastStep = currentStep === steps.length - 1;
    const currentContent = contents[steps[currentStep].id];

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden lg:static" dir="rtl">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <PageHeader title="إنشاء وثائق المشروع" onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-4 md:p-8 flex flex-col items-center overflow-auto pt-16 md:pt-24">
                    <div className="bg-white w-full max-w-4xl border border-gray-200 rounded-xl shadow-lg p-6 md:p-10 transition-all duration-300">
                        {/* Step Header */}
                        <div className="mb-8 text-right flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#090832] mb-3">
                                    {steps[currentStep].title}
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    {steps[currentStep].description}
                                </p>
                            </div>
                            <div className="text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
                                {currentStep + 1} / {steps.length}
                            </div>
                        </div>

                        {/* AI Content Display Area */}
                        <div className="mb-10 text-right">
                            <label className="block text-gray-700 font-semibold mb-3 text-lg">
                                الوثيقة المولدة من الذكاء الاصطناعي
                            </label>
                            <div className="w-full min-h-[300px] md:min-h-[400px] h-auto p-4 md:p-6 border-2 border-gray-100 rounded-xl bg-gray-50/50 text-lg text-gray-800 flex flex-col overflow-y-auto shadow-inner relative group">
                                {isLoading ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-xl">
                                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                                        <p className="text-indigo-900 font-bold animate-pulse text-xl">جاري إنشاء الوثيقة بذكاء...</p>
                                    </div>
                                ) : !currentContent ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                                            <Play className="w-10 h-10 text-indigo-600 fill-indigo-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">ابدأ إنشاء {steps[currentStep].title}</h3>
                                        <p className="text-gray-500 mb-8 max-w-xs">اضغط على الزر أدناه ليقوم الذكاء الاصطناعي بصياغة المحتوى بناءً على فكرة مشروعكم.</p>
                                        <PrimaryButton
                                            onClick={() => generateDoc()}
                                            size="lg"
                                            className="px-10"
                                            icon={Play}
                                        >
                                            ابدأ الآن
                                        </PrimaryButton>
                                    </div>
                                ) : (
                                    <p className="leading-relaxed whitespace-pre-wrap animate-fade-in">
                                        {currentContent}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {currentContent && (
                            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-8 animate-fade-in">
                                <PrimaryButton
                                    onClick={handleSave}
                                    className="min-w-[120px] md:min-w-[140px]"
                                    size='lg'
                                    icon={Save}
                                    disabled={isSaving || isLoading}
                                >
                                    {isSaving ? 'جاري الحفظ...' : 'حفظ'}
                                </PrimaryButton>

                                <PrimaryButton
                                    onClick={() => setIsRegenModalOpen(true)}
                                    className="bg-[#585C9A] hover:bg-[#4A4E85] min-w-[120px] md:min-w-[140px]"
                                    size='lg'
                                    icon={RefreshCcw}
                                    disabled={isLoading}
                                >
                                    إعادة الإنشاء
                                </PrimaryButton>

                                {!isLastStep && (
                                    <PrimaryButton
                                        onClick={handleNext}
                                        className="min-w-[120px] md:min-w-[140px] bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
                                        size='lg'
                                        icon={ChevronLeft}
                                    >
                                        المستند التالي
                                    </PrimaryButton>
                                )}
                            </div>
                        )}

                        {/* Step Progress Indicators */}
                        <div className="mt-8 md:mt-12 flex justify-center gap-2 md:gap-3">
                            {steps.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentStep(index)}
                                    className={`h-2 md:h-2.5 rounded-full transition-all duration-300 ${index === currentStep ? 'w-8 md:w-10 bg-[#585C9A]' : 'w-2 md:w-2.5 bg-gray-200'
                                        }`}
                                    title={_.title}
                                />
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Regeneration Modal */}
            {isRegenModalOpen && (
                <RegenerateDocModal
                    onClose={() => setIsRegenModalOpen(false)}
                    onSubmit={(notes) => generateDoc(notes)}
                    title={steps[currentStep].title}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
}

interface RegenerateDocModalProps {
    onClose: () => void;
    onSubmit: (notes: string) => void;
    title: string;
    isLoading: boolean;
}

const RegenerateDocModal = ({ onClose, onSubmit, title, isLoading }: RegenerateDocModalProps) => {
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(notes);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md shadow-2xl rounded-2xl overflow-hidden mx-auto" dir="rtl">
                {/* Header Modal */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <RefreshCcw className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h2 className="text-xl text-gray-900 font-bold">إعادة إنشاء {title}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 font-bold">✕</button>
                </div>

                {/* Form Modal */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 text-right">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">اكتب ملاحظاتك للذكاء الاصطناعي لتحسين المحتوى</label>
                        <textarea
                            required
                            rows={4}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-right bg-gray-50 shadow-inner"
                            placeholder="مثال: يرجى التركيز أكثر على الجانب التقني أو تغيير صياغة الأهداف..."
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <PrimaryButton
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={isLoading}
                            icon={RefreshCcw}
                        >
                            {isLoading ? 'جاري الإنشاء...' : 'إعادة إنشاء الآن'}
                        </PrimaryButton>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-bold w-full"
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
