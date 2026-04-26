'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import PageHeader from '@/components/PageHeader';
import { API_URL, getHeaders } from '@/config/api';

interface MainTask {
  id: number;
  title: string;
  description: string;
  duration: string;
  start_date: string | null;
  deadline: string | null;
  status: 'todo' | 'started' | 'in_progress' | 'completed';
}

export default function StudentMainTasksPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<MainTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/tasks/student-project`, {
        headers: getHeaders(token!),
      });
      const data = await res.json();
      if (res.ok) {
        // Only keep Main Tasks (parent_id is null)
        const mainTasks = data.data.tasks.filter((t: any) => !t.parent_id);
        setTasks(mainTasks);
      }
    } catch (err) {
      console.error('Error fetching main tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden lg:static" dir="rtl">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <PageHeader title="المهام الرئيسية" onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white border-gray-900 overflow-hidden shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-white border-b border-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">#</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">اسم المهمة</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">الوصف</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">المدة</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">الموعد النهائي</th>
                    <th className="px-6 py-4 text-center text-sm text-gray-900 font-bold whitespace-nowrap">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">جاري التحميل...</td>
                    </tr>
                  ) : tasks.length > 0 ? (
                    tasks.map((task, index) => (
                      <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600 font-bold">{index + 1}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-900">{task.title}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{task.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-bold">{task.duration || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-bold">
                          {task.deadline ? new Date(task.deadline).toLocaleDateString('ar-SA') : 'غير محدد'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col gap-1 items-center">
                            <span className={`text-xs px-2 py-1 font-bold whitespace-nowrap inline-block w-fit ${
                              task.status === 'completed' ? 'text-green-600 bg-green-50' : 
                              task.status === 'in_progress' ? 'text-blue-600 bg-blue-50' : 
                              task.status === 'started' ? 'text-orange-600 bg-orange-50' : 
                              'text-gray-600 bg-gray-50'
                            }`}>
                              {task.status === 'completed' ? 'تم التنفيذ' : 
                               task.status === 'in_progress' ? 'جاري التنفيذ' : 
                               task.status === 'started' ? 'بدء التنفيذ' : 
                               'لم يتم البدء'}
                            </span>
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
                      <td colSpan={6}>
                        <div className="text-center py-12">
                          <p className="text-gray-500">لا توجد مهام رئيسية مضافة للمشروع حتى الآن.</p>
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
