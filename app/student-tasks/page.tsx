'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import PageHeader from '@/components/PageHeader';
import { API_URL, getHeaders } from '@/config/api';

interface StudentTask {
  id: number;
  title: string;
  duration: string;
  start_date: string | null;
  deadline: string | null;
  status: 'todo' | 'started' | 'in_progress' | 'completed';
  parent?: {
    title: string;
    status: string;
  };
  Student?: {
    User?: {
      full_name: string;
    };
  };
}

export default function StudentTasksPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<StudentTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/tasks/student`, {
        headers: getHeaders(token!),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(data.data.tasks);
      }
    } catch (err) {
      console.error('Error fetching student tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === 'completed') return;

    let newStatus: 'todo' | 'started' | 'in_progress' | 'completed' = 'todo';
    if (task.status === 'todo') newStatus = 'started';
    else if (task.status === 'started') newStatus = 'in_progress';
    else if (task.status === 'in_progress') newStatus = 'completed';

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: getHeaders(token!),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'تم التنفيذ';
      case 'in_progress': return 'جاري التنفيذ';
      case 'started': return 'بدء التنفيذ';
      default: return 'لم يتم البدء';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in_progress': return 'text-blue-600 bg-blue-50';
      case 'started': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden lg:static" dir="rtl">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <PageHeader title="المهام" onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white border-gray-900 overflow-hidden shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-white border-b border-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">#</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">المهمة</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">المهمة الرئيسية</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">الشخص المسؤول</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">المدة</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">الموعد النهائي</th>
                    <th className="px-6 py-4 text-center text-sm text-gray-900 font-bold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">جاري التحميل...</td>
                    </tr>
                  ) : tasks.length > 0 ? (
                    tasks.map((task, index) => (
                      <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600 font-bold">{index + 1}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-900">{task.title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 font-bold whitespace-nowrap">
                            {task.parent?.title || '-'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-bold">
                          {task.Student?.User?.full_name || 'غير محدد'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-bold">{task.duration || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-bold">
                          {task.deadline ? new Date(task.deadline).toLocaleDateString('ar-SA') : 'غير محدد'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col gap-1 items-center">
                            <button
                              onClick={() => toggleStatus(task.id)}
                              disabled={task.status === 'completed' || (task.parent?.status === 'todo')}
                              className={`text-xs px-3 py-1 font-bold rounded-none transition-all ${getStatusColor(task.status)} ${task.status === 'completed' || task.parent?.status === 'todo' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:opacity-80 underline'}`}
                            >
                              {getStatusText(task.status)}
                            </button>
                            {task.parent?.status === 'todo' && (
                              <span className="text-[10px] text-orange-500 font-bold mt-1 max-w-[120px] text-center leading-tight">
                                لا يمكن البدء قبل تفعيل المهمة الرئيسية
                              </span>
                            )}
                            {task.deadline && new Date() > new Date(task.deadline) && task.status !== 'completed' && (
                              <span className="text-xs px-2 py-1 font-bold whitespace-nowrap inline-block w-fit text-red-600 bg-red-100 mt-1">
                                🔴 متأخرة
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7}>
                        <div className="text-center py-12">
                          <p className="text-gray-500">لا توجد مهام فرعية مضافة للمشروع حالياً.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
