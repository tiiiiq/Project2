'use client';

import { useState, useEffect } from 'react';
import SidebarSupervisor from '@/components/SidebarSupervisor';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';
import { ChevronDown, ChevronUp, User, Clock, CheckCircle, Sparkles, Send, Save, MessageSquare, OctagonX, Loader2 } from 'lucide-react';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { API_URL, getHeaders } from '@/config/api';

interface Task {
    id: number | string;
    title: string;
    description: string;
    duration: string;
    studentName?: string;
    isSubtask?: boolean;
    subtasks?: Task[];
    isOpen?: boolean;
}

export default function AITasksPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
    
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isAssigning, setIsAssigning] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch(`${API_URL}/api/supervisor/projects`, {
                    headers: getHeaders(token)
                });
                const data = await res.json();
                if (res.ok) {
                    setProjects(data.data.projects);
                    if (data.data.projects.length > 0) {
                        setSelectedProjectId(data.data.projects[0].id.toString());
                    }
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setIsLoadingProjects(false);
            }
        };
        fetchProjects();
    }, []);

    const handleGenerateTasks = async (eventOrNotes?: string | React.MouseEvent) => {
        if (!selectedProjectId) {
            alert('يرجى اختيار مشروع أولاً');
            return;
        }

        const notes = typeof eventOrNotes === 'string' ? eventOrNotes : undefined;

        const token = localStorage.getItem('token');
        setIsGenerating(true);
        try {
            const res = await fetch(`${API_URL}/api/ai/generate-tasks`, {
                method: 'POST',
                headers: getHeaders(token!),
                body: JSON.stringify({ 
                    projectId: selectedProjectId,
                    modificationNotes: notes,
                    currentTasks: notes ? tasks : undefined
                })
            });
            const data = await res.json();
            if (res.ok) {
                // Add id and isOpen to generated tasks
                const structuredTasks = data.data.tasks.map((task: any, index: number) => ({
                    ...task,
                    id: Date.now() + index,
                    isOpen: true,
                    subtasks: task.subtasks?.map((sub: any, subIndex: number) => ({
                        ...sub,
                        id: Date.now() + index + subIndex + 1
                    }))
                }));
                setTasks(structuredTasks);
            } else {
                alert(data.message || 'فشل في توليد المهام');
            }
        } catch (err) {
            console.error('Error generating tasks:', err);
            alert('حدث خطأ أثناء التواصل مع الذكاء الاصطناعي');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAssignTasks = async () => {
        if (tasks.length === 0) {
            alert('يرجى توليد المهام أولاً');
            return;
        }

        const token = localStorage.getItem('token');
        setIsAssigning(true);
        try {
            const res = await fetch(`${API_URL}/api/ai/assign-tasks`, {
                method: 'POST',
                headers: getHeaders(token!),
                body: JSON.stringify({ 
                    projectId: selectedProjectId,
                    tasks: tasks
                })
            });
            const data = await res.json();
            if (res.ok) {
                setTasks(data.data.tasks);
            } else {
                alert(data.message || 'فشل في توزيع المهام');
            }
        } catch (err) {
            console.error('Error assigning tasks:', err);
            alert('حدث خطأ أثناء توزيع المهام');
        } finally {
            setIsAssigning(false);
        }
    };

    const handleSaveTasks = async () => {
        if (tasks.length === 0) {
            alert('لا توجد مهام لحفظها');
            return;
        }

        const token = localStorage.getItem('token');
        setIsSaving(true);
        try {
            const res = await fetch(`${API_URL}/api/tasks/bulk`, {
                method: 'POST',
                headers: getHeaders(token!),
                body: JSON.stringify({ 
                    projectId: selectedProjectId,
                    tasks: tasks
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert('تم حفظ وتوزيع المهام بنجاح');
            } else {
                alert(data.message || 'فشل في حفظ المهام');
            }
        } catch (err) {
            console.error('Error saving tasks:', err);
            alert('حدث خطأ أثناء حفظ المهام');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleTask = (id: number | string) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, isOpen: !task.isOpen } : task
        ));
    };

    return (
        <div className="h-screen bg-[#f1f5f9] flex overflow-hidden font-sans" dir="rtl">
            <SidebarSupervisor isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <PageHeaderSupervisor title="إنشاء المهام وتوزيعها" onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 p-4 md:p-10 overflow-hidden flex flex-col">
                    <div className="bg-white rounded-[4px] shadow-sm flex-1 flex flex-col overflow-hidden max-w-6xl mx-auto w-full">
                        <div className="p-6 border-b border-gray-100 flex-none flex flex-col md:flex-row justify-between items-center gap-4">
                            <h2 className="text-xl font-bold text-[#1e293b]">انشاء المهام وتوزيعها بالذكاء الاصطناعي</h2>
                            
                            <div className="w-full md:w-64">
                                <select 
                                    value={selectedProjectId}
                                    onChange={(e) => setSelectedProjectId(e.target.value)}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#9BB1D9]"
                                >
                                    {isLoadingProjects ? (
                                        <option>جاري تحميل المشاريع...</option>
                                    ) : (
                                        projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-gray-50/30">
                            <div className="max-w-4xl mx-auto space-y-4">
                                {isGenerating ? (
                                    <div className="flex flex-col items-center justify-center py-20">
                                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                                        <p className="text-gray-600 font-bold">جاري تحليل المشروع وتوليد المهام المناسبة...</p>
                                    </div>
                                ) : tasks.length === 0 ? (
                                    <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
                                        <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-bold">لم يتم توليد أي مهام بعد. اضغط على "توليد المهام" للبدء.</p>
                                    </div>
                                ) : (
                                    tasks.map((task) => (
                                        <div key={task.id} className="space-y-3">
                                            {/* Main Task Card */}
                                            <div 
                                                className="bg-white border rounded-[8px] p-4 flex items-center justify-between cursor-pointer hover:border-blue-200 transition-colors shadow-sm"
                                                onClick={() => toggleTask(task.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                        <CheckCircle size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-[#1e293b]">{task.title}</h3>
                                                        <p className="text-sm text-gray-500">{task.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6 text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} />
                                                        <span className="text-sm font-medium">{task.duration}</span>
                                                    </div>
                                                    {task.isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </div>
                                            </div>

                                            {/* Subtasks */}
                                            {task.isOpen && task.subtasks && (
                                                <div className="pr-12 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    {task.subtasks.map((subtask) => (
                                                        <div key={subtask.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 group">
                                                            <div className="flex-1 w-full bg-white border border-gray-100 rounded-[8px] p-4 flex items-center justify-between group-hover:border-blue-100 transition-all shadow-sm">
                                                                <div>
                                                                    <h4 className="font-bold text-[#334155]">{subtask.title}</h4>
                                                                    <p className="text-xs text-gray-400 mt-1">{subtask.description}</p>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-500 mr-4">
                                                                    <Clock size={14} />
                                                                    <span className="text-xs font-medium">{subtask.duration}</span>
                                                                </div>
                                                            </div>
                                                            <div className="w-full sm:w-40 text-right px-2 sm:px-0">
                                                                {subtask.studentName ? (
                                                                    <div className="flex items-center justify-end gap-2 text-[#475569]">
                                                                        <User size={14} />
                                                                        <span className="text-sm font-bold">{subtask.studentName}</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-gray-400 italic">بانتظار التوزيع...</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Buttons Footer */}
                        <div className="p-6 md:p-8 flex-none flex flex-wrap justify-between items-center bg-white gap-4 border-t border-gray-100">
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleGenerateTasks}
                                    disabled={isGenerating || isAssigning || isSaving}
                                    className="bg-[#4b5563] hover:bg-[#374151] disabled:opacity-50 text-white px-8 py-3 rounded-[4px] font-bold shadow-md transition-all flex items-center gap-2 transform active:scale-95 text-sm md:text-base"
                                >
                                    {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                    توليد المهام
                                </button>
                                <button 
                                    onClick={handleAssignTasks}
                                    disabled={isGenerating || isAssigning || isSaving || tasks.length === 0}
                                    className="bg-[#3b4361] hover:bg-[#2b3149] disabled:opacity-50 text-white px-8 py-3 rounded-[4px] font-bold shadow-md transition-all flex items-center gap-2 transform active:scale-95 text-sm md:text-base"
                                >
                                    {isAssigning ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                    توزيع المهام
                                </button>
                            </div>
                            <div className="flex gap-4">
                                <PrimaryButton 
                                    onClick={() => setIsModifyModalOpen(true)}
                                    icon={MessageSquare}
                                    className="px-8"
                                    disabled={isGenerating || isAssigning || isSaving || tasks.length === 0}
                                >
                                    طلب تعديل
                                </PrimaryButton>
                                <PrimaryButton 
                                    onClick={handleSaveTasks}
                                    icon={isSaving ? Loader2 : Save}
                                    className={`px-8 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isGenerating || isAssigning || isSaving || tasks.length === 0}
                                >
                                    {isSaving ? 'جاري الحفظ...' : 'حفظ'}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modify Tasks Modal */}
            {isModifyModalOpen && (
                <ModifyTasksModal 
                    onClose={() => setIsModifyModalOpen(false)} 
                    onSubmit={(note) => {
                        handleGenerateTasks(note);
                        setIsModifyModalOpen(false);
                    }}
                />
            )}
        </div>
    );
}

const ModifyTasksModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (note: string) => void }) => {
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(note);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md shadow-2xl rounded-none overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header Modal */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 flex items-center justify-center">
                            <OctagonX className="w-6 h-6 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-black font-sans">طلب تعديل المهام</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 text-xl font-bold">✕</button>
                </div>

                {/* Form Modal */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">اكتب ملاحظتك للتعديل هنا</label>
                        <textarea
                            required
                            rows={4}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none focus:ring-2 focus:ring-[#9BB1D9] focus:border-transparent outline-none transition-all resize-none text-right font-sans"
                            placeholder="مثال: يرجى تقليل مدة المهام الفرعية أو إعادة توزيعها..."
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <PrimaryButton type="submit" size="lg" className="flex-1 order-2 sm:order-1 font-sans rounded-none">إرسال الطلب</PrimaryButton>
                        <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-none hover:bg-gray-50 transition-all font-semibold font-sans order-1 sm:order-2">إلغاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
