'use client';

import Sidebar from '@/components/Sidebar';
import SidebarSupervisor from '@/components/SidebarSupervisor';
import SidebarAdmin from '@/components/SidebarAdmin';
import PageHeader from '@/components/PageHeader';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { useState, useEffect } from 'react';
import {
    FileText,
    Target,
    Layers,
    Clock,
    ShieldAlert,
    BookOpen,
    Download,
    FileType,
    FileJson,
    X,
    Loader2
} from 'lucide-react';
import { API_URL, getHeaders } from '@/config/api';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';
import { useSearchParams } from 'next/navigation';

const documentCategoriesTemplate = [
    {
        id: 'abstract',
        title: 'Abstract',
        label: 'ملخص المشروع',
        icon: FileText,
        color: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    {
        id: 'objectives',
        title: 'Objectives',
        label: 'أهداف المشروع',
        icon: Target,
        color: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
    },
    {
        id: 'scope',
        title: 'Scope',
        label: 'نطاق المشروع',
        icon: Layers,
        color: 'bg-purple-50',
        iconColor: 'text-purple-600',
    },
    {
        id: 'timeline',
        title: 'Timeline',
        label: 'الجدول الزمني',
        icon: Clock,
        color: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
    },
    {
        id: 'risks',
        title: 'Risks & Advice',
        label: 'المخاطر والنصائح',
        icon: ShieldAlert,
        color: 'bg-orange-50',
        iconColor: 'text-orange-600',
    },
    {
        id: 'resources',
        title: 'Educational Resources',
        label: 'المصادر التعليمية',
        icon: BookOpen,
        color: 'bg-cyan-50',
        iconColor: 'text-cyan-600',
    }
];

export default function DocumentsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
    const [documents, setDocuments] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const projectIdParam = searchParams.get('projectId');

    useEffect(() => {
        const fetchDocs = async () => {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    setUserRole(user.role);
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            }

            if (!token) return;
            try {
                const url = projectIdParam 
                    ? `${API_URL}/api/documents?projectId=${projectIdParam}`
                    : `${API_URL}/api/documents`;

                const res = await fetch(url, {
                    headers: getHeaders(token)
                });
                const data = await res.json();
                if (res.ok) {
                    setDocuments(data.data.documents);
                }
            } catch (err) {
                console.error('Error fetching documents:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDocs();
    }, []);

    const documentCategories = documentCategoriesTemplate.map(doc => {
        return {
            ...doc,
            content: documents ? documents[doc.id] : 'لا يوجد محتوى متاح حالياً.'
        };
    });

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden lg:static" dir="rtl">
            {userRole === 'supervisor' ? (
                <SidebarSupervisor isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            ) : userRole === 'admin' ? (
                <SidebarAdmin isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            ) : (
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            )}

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {userRole === 'supervisor' ? (
                    <PageHeaderSupervisor title="مستندات المشروع" onMenuClick={() => setIsSidebarOpen(true)} />
                ) : (
                    <PageHeader title="مستندات المشروع" onMenuClick={() => setIsSidebarOpen(true)} />
                )}

                <main className="flex-1 p-4 md:p-8 overflow-y-auto pt-16 md:pt-20">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-8 text-right px-2">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#090832] mb-2">وثائق المشروع الأساسية</h1>
                            <p className="text-gray-500">استعرض وقم بتحميل كافة الوثائق التي تم إنشاؤها لمشروعك</p>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                                <p className="text-gray-600">جاري تحميل المستندات...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {documentCategories.map((doc) => (
                                    <button
                                        key={doc.id}
                                        onClick={() => setSelectedDoc(doc)}
                                        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-5 transition-all duration-300 hover:shadow-md hover:border-[#9BB1D9] group"
                                    >
                                        <div className={`w-20 h-20 ${doc.color} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
                                            <doc.icon className={`w-10 h-10 ${doc.iconColor}`} />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-xl font-bold text-[#090832] mb-1">{doc.label}</h3>
                                            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{doc.title}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Document View Modal */}
            {selectedDoc && (
                <DocumentViewModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
            )}
        </div>
    );
}

interface DocumentViewModalProps {
    doc: any;
    onClose: () => void;
}

const DocumentViewModal = ({ doc, onClose }: DocumentViewModalProps) => {
    
    const handleDownloadPDF = async () => {
        const element = document.getElementById('document-content-to-print');
        if (!element) return;

        try {
            const html2canvas = (await import('html2canvas-pro')).default;
            const { jsPDF } = await import('jspdf');

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const margin = 10; // 10mm margin
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth() - (margin * 2);
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', margin, margin, pdfWidth, pdfHeight);
            pdf.save(`${doc.title}_${doc.label}.pdf`);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
        }
    };

    const handleDownloadWord = async () => {
        try {
            const sections = [
                {
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: doc.label,
                                    bold: true,
                                    size: 32,
                                }),
                            ],
                            alignment: AlignmentType.CENTER,
                            bidirectional: true,
                            spacing: { after: 400 },
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: doc.content || '',
                                    size: 24,
                                }),
                            ],
                            alignment: AlignmentType.RIGHT,
                            bidirectional: true,
                        }),
                    ],
                },
            ];

            const wordDoc = new Document({
                sections: sections,
            });

            const blob = await Packer.toBlob(wordDoc);
            saveAs(blob, `${doc.title}_${doc.label}.docx`);
        } catch (error) {
            console.error('Word Generation Error:', error);
            alert('حدث خطأ أثناء إنشاء ملف Word. يرجى المحاولة مرة أخرى.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl shadow-2xl animate-fade-in flex flex-col max-h-[90vh]" dir="rtl">
                {/* Header Modal */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#9BB1D9] rounded-lg flex items-center justify-center">
                            <doc.icon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl text-black font-bold">عرض {doc.label}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 text-xl block">✕</button>
                </div>

                {/* Download Options */}
                <div className="px-6 py-5 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-start">
                    <PrimaryButton
                        size="sm"
                        onClick={handleDownloadPDF}
                    >
                        <Download className="w-4 h-4 ml-1" />
                        PDF تنزيل
                    </PrimaryButton>
                    <PrimaryButton
                        size="sm"
                        onClick={handleDownloadWord}
                    >
                        <Download className="w-4 h-4 ml-1" />
                        Word تنزيل
                    </PrimaryButton>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 text-right">
                    <div id="document-content-to-print" className="bg-gray-50 border border-gray-200 p-6 rounded-lg min-h-[300px]">
                        <h2 className="text-xl font-bold mb-4 text-[#090832] border-b pb-2">{doc.label}</h2>
                        <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                            {doc.content || 'هذا المستند لا يحتوي على بيانات حالياً.'}
                        </p>
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="p-6 border-t border-gray-200 flex justify-end">
                    <PrimaryButton
                        size="lg"
                        onClick={onClose}
                    >
                        إغلاق
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
};
