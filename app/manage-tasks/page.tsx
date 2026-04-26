'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, CheckSquare, List } from 'lucide-react';
import SidebarSupervisor from '@/components/SidebarSupervisor';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { API_URL, getHeaders } from '@/config/api';

interface Project {
  id: number;
  title: string;
}

interface User {
  full_name: string;
}

interface Student {
  id: number;
  User: User;
}

interface Task {
  id: number;
  title: string;
  description: string;
  start_date: string | null;
  deadline: string | null;
  status: string;
  parent_id: number | null;
  student_id: number | null;
  Student?: Student;
}

export default function ManageSubTasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const [mainTasks, setMainTasks] = useState<Task[]>([]);
  const [subTasks, setSubTasks] = useState<Task[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks();
      fetchMembers();
    } else {
      setMainTasks([]);
      setSubTasks([]);
      setStudents([]);
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/supervisor/projects`, {
        headers: getHeaders(token!),
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data.data.projects);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const fetchMembers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/projects/${selectedProjectId}/members`, {
        headers: getHeaders(token!),
      });
      const data = await res.json();
      if (res.ok) {
        setStudents(data.data.members || []);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/tasks/project/${selectedProjectId}`, {
        headers: getHeaders(token!),
      });
      const data = await res.json();
      if (res.ok) {
        const tasks: Task[] = data.data.tasks;
        setMainTasks(tasks); // main tasks returned directly
        // Subtasks are nested inside main tasks due to how getProjectTasks is structured
        let allSub: Task[] = [];
        tasks.forEach(mt => {
          if ((mt as any).subtasks) {
            allSub = [...allSub, ...(mt as any).subtasks.map((st: Task) => ({ ...st, mainTaskName: mt.title }))];
          }
        });
        setSubTasks(allSub);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذه المهمة الفرعية؟')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token!),
      });
      if (res.ok) {
        fetchTasks();
      } else {
        alert('فشل في حذف المهمة');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    if (!selectedProjectId) {
      alert('يرجى اختيار مشروع أولاً');
      return;
    }
    if (mainTasks.length === 0) {
      alert('يجب إضافة مهام رئيسية أولاً لإضافة مهام فرعية تابعة لها');
      return;
    }
    setEditTask(null);
    setIsModalOpen(true);
  };

  const handleSaveSubTask = async (taskData: any) => {
    const token = localStorage.getItem('token');
    try {
      if (editTask) {
        const res = await fetch(`${API_URL}/api/tasks/${editTask.id}`, {
          method: 'PUT',
          headers: getHeaders(token!),
          body: JSON.stringify(taskData)
        });
        if (res.ok) {
          fetchTasks();
        } else {
          alert('فشل في تعديل المهمة');
        }
      } else {
        const res = await fetch(`${API_URL}/api/tasks`, {
          method: 'POST',
          headers: getHeaders(token!),
          body: JSON.stringify({ ...taskData, projectId: selectedProjectId })
        });
        if (res.ok) {
          fetchTasks();
        } else {
          alert('فشل في إضافة المهمة');
        }
      }
    } catch (err) {
      console.error('Error saving task:', err);
      alert('حدث خطأ');
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden font-sans" dir="rtl">
      <SidebarSupervisor isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <PageHeaderSupervisor title="إدارة المهام الفرعية" onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-2xl font-bold text-gray-800">المهام الفرعية</h1>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-none focus:outline-none focus:ring-2 focus:ring-[#9BB1D9] text-gray-700 min-w-[250px]"
              >
                <option value="">-- اختر المشروع --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>

              <PrimaryButton
                onClick={handleAdd}
                icon={Plus}
                size="lg"
                className="whitespace-nowrap rounded-none"
              >
                إضافة مهمة فرعية
              </PrimaryButton>
            </div>
          </div>

          <div className="bg-white border-gray-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-white border-b border-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">#</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">اسم المهمة</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">المهمة الرئيسية</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">الشخص المسؤول</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">المدة</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">الموعد النهائي</th>
                    <th className="px-6 py-4 text-right text-sm text-gray-900 font-bold whitespace-nowrap">الحالة</th>
                    <th className="px-6 py-4 text-center text-sm text-gray-900 font-bold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">جاري التحميل...</td>
                    </tr>
                  ) : subTasks.length > 0 ? (
                    subTasks.map((task, index) => (
                      <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600 font-bold">{index + 1}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-gray-900">{task.title}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 font-bold whitespace-nowrap">
                            {(task as any).mainTaskName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-bold">
                          {task.Student?.User?.full_name || 'غير محدد'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{task.duration || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {task.deadline ? new Date(task.deadline).toLocaleDateString('ar-SA') : 'غير محدد'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs px-2 py-1 font-bold whitespace-nowrap inline-block w-fit ${task.status === 'completed' ? 'text-green-600 bg-green-50' :
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
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(task)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-none transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-none transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7}>
                        <div className="text-center py-12">
                          <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">
                            {selectedProjectId ? 'لا توجد مهام فرعية مضافة' : 'يرجى اختيار مشروع لعرض مهامه'}
                          </p>
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

      {isModalOpen && (
        <SubTaskModal
          onClose={() => setIsModalOpen(false)}
          task={editTask}
          mainTasks={mainTasks}
          students={students}
          onSave={handleSaveSubTask}
        />
      )}
    </div>
  );
}

const SubTaskModal = ({ onClose, task, mainTasks, students, onSave }: {
  onClose: () => void,
  task: Task | null,
  mainTasks: Task[],
  students: Student[],
  onSave: (task: any) => void
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    parentId: task?.parent_id ? String(task.parent_id) : String(mainTasks[0]?.id || ''),
    studentId: task?.student_id ? String(task.student_id) : '',
    duration: task?.duration || '',
    status: task?.status || 'todo',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md shadow-2xl rounded-none animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#585C9A] rounded-none flex items-center justify-center text-white">
              <List className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-black">{task ? 'تعديل مهمة فرعية' : 'إضافة مهمة فرعية'}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">اسم المهمة الفرعية</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-none focus:outline-none focus:ring-2 focus:ring-[#585C9A] transition-all text-right"
              placeholder="مثال: الواجهة الأمامية"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">المهمة الرئيسية</label>
            <select
              required
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-none focus:outline-none focus:ring-2 focus:ring-[#585C9A] transition-all text-right bg-white"
            >
              <option value="">-- اختر المهمة --</option>
              {mainTasks.map(mt => (
                <option key={mt.id} value={mt.id}>{mt.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">الشخص المسؤول (اختياري)</label>
            <select
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-none focus:outline-none focus:ring-2 focus:ring-[#585C9A] transition-all text-right bg-white"
            >
              <option value="">-- غير محدد --</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.User.full_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">المدة</label>
            <input
              type="text"
              required
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-none focus:outline-none focus:ring-2 focus:ring-[#585C9A] transition-all text-right"
              placeholder="مثال: 3 أيام"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">الحالة</label>
            <select
              required
              disabled
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-none bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none transition-all text-right"
            >
              <option value="todo">لم يتم البدء</option>
              <option value="started">بدء التنفيذ</option>
              <option value="in_progress">جاري التنفيذ</option>
              <option value="completed">تم التنفيذ</option>
            </select>
            <p className="text-xs text-red-500 mt-2 font-bold">* الطالب المسؤول هو الوحيد المخول بتحديث حالة هذه المهمة.</p>
          </div>

          <div className="flex gap-4 pt-4">
            <PrimaryButton type="submit" size="lg" className="flex-1 rounded-none">حفظ</PrimaryButton>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-none hover:bg-gray-50 transition-all font-bold"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
