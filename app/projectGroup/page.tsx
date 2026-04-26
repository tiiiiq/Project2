// app/team/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { UserPlus, User as UserIcon, Trash2, Edit, CheckCircle2, AlertCircle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import PageHeader from '@/components/PageHeader';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { API_URL, getHeaders } from '@/config/api';

interface StudentMember {
  id: number;
  user_id: number;
  project_id: number;
  type: string;
  User: {
    id: number;
    full_name: string;
    email: string;
  };
}

export default function TeamPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: 'أحمد محمد',
      universityEmail: 'ahmed.mohamed@university.edu',
      university: 'جامعة الملك سعود',
      joinDate: '2024-01-15',
    },
    {
      id: 2,
      name: 'سارة عبدالله',
      universityEmail: 'sara.abdullah@university.edu',
      university: 'جامعة الملك عبدالعزيز',
      joinDate: '2024-02-20',
    },
    {
      id: 3,
      name: 'tariq.com',
      universityEmail: 'tariq@university.edu',
      university: 'الاسم الجامعي',
      joinDate: '2024-03-10',
    },
  ]);

  const filteredStudents = students.filter(student => {
    const fullName = student.User?.full_name || '';
    const email = student.User?.email || '';
    const search = searchTerm.toLowerCase();

    return fullName.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search);
  });

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden lg:static" dir="rtl">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <PageHeader title="فرق المشروع" onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-8 overflow-y-auto">
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          <div className="flex flex-row-reverse justify-between items-center mb-8">
            {isLeader && (
              <PrimaryButton
                onClick={() => setIsModalOpen(true)}
                type="button"
                size="lg"
              >
                اضافة طالب
              </PrimaryButton>
            )}

            <div className="relative w-64">
              <input
                type="text"
                placeholder="بحث عن عضو..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#090832] outline-none"
              />
            </div>
          </div>

          <div className="bg-white border-gray-900 overflow-hidden shadow-sm rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-white border-b border-gray-900">
                  <tr>
                    <th className="px-6 py-4 text-sm text-gray-900 font-bold whitespace-nowrap">#</th>
                    <th className="px-6 py-4 text-sm text-gray-900 font-bold whitespace-nowrap">اسم الطالب</th>
                    <th className="px-6 py-4 text-sm text-gray-900 font-bold whitespace-nowrap">الايميل</th>
                    <th className="px-6 py-4 text-sm text-gray-900 font-bold whitespace-nowrap">الرتبة</th>
                    <th className="px-6 py-4 text-center text-sm text-gray-900 font-bold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500 font-bold">جاري التحميل...</td>
                    </tr>
                  ) : filteredStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600 font-bold">{index + 1}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900 font-bold">{student.User.full_name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-bold">{student.User.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${student.type === 'student leader' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                          {student.type === 'student leader' ? 'قائد الفريق' : 'عضو'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          {isLeader && student.type !== 'student leader' && (
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!isLoading && filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <UserIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-bold">لا يوجد أعضاء مضافون</p>
              </div>
            )}
          </div>

          {/* Supervisor Section */}
          <div className="mt-12 bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden p-6">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#585C9A] rounded-lg flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">بيانات مشرف المشروع</h2>
              </div>
              {supervisor && isLeader && !isEditingSupervisor && (
                <button
                  onClick={() => setIsEditingSupervisor(true)}
                  className="flex items-center gap-2 text-[#585C9A] hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors font-bold text-sm"
                >
                  <Edit className="w-4 h-4" />
                  تعديل البيانات
                </button>
              )}
            </div>

            {supervisor && !isEditingSupervisor ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">اسم المشرف</label>
                  <p className="text-lg font-bold text-gray-900">{supervisor.User.full_name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">الايميل</label>
                  <p className="text-lg font-bold text-gray-900">{supervisor.User.email}</p>
                </div>
              </div>
            ) : isLeader ? (
              <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300">
                <h3 className="text-sm font-bold text-gray-600 mb-4">
                  {isEditingSupervisor ? 'تعديل بيانات المشرف:' : 'تعيين مشرف للمشروع:'}
                </h3>
                <SupervisorForm
                  key={isEditingSupervisor ? 'edit' : 'assign'}
                  projectId={localStorage.getItem('project_id') || ''}
                  initialData={isEditingSupervisor ? {
                    fullName: supervisor?.User.full_name || '',
                    email: supervisor?.User.email || ''
                  } : undefined}
                  onCancel={isEditingSupervisor ? () => setIsEditingSupervisor(false) : undefined}
                  onSuccess={() => {
                    setSuccessMsg(isEditingSupervisor ? 'تم تحديث بيانات المشرف بنجاح' : 'تم تعيين المشرف بنجاح');
                    setIsEditingSupervisor(false);
                    fetchMembers();
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-500 italic p-4">
                <AlertCircle className="w-4 h-4" />
                <span>لم يتم تعيين مشرف حتى الآن. ينبغي على قائد الفريق إضافة بيانات المشرف.</span>
              </div>
            )}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <AddMemberModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setSuccessMsg('تم إضافة العضو بنجاح');
            fetchMembers();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

const SupervisorForm = ({ projectId, onSuccess, initialData, onCancel }: {
  projectId: string,
  onSuccess: () => void,
  initialData?: { fullName: string, email: string },
  onCancel?: () => void
}) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/supervisor`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
      } else {
        setErrorMsg(data.message || 'حدث خطأ أثناء تعيين المشرف');
      }
    } catch (err: any) {
      setErrorMsg(`تعذر الاتصال بالخادم. ${err.message || ''}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-4">
      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-gray-600 mb-1">الاسم الكامل للمشرف</label>
        <input
          type="text"
          required
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#585C9A] outline-none"
          placeholder="مثلاً: د. أحمد محمد"
        />
      </div>
      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-gray-600 mb-1">الايميل</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#585C9A] outline-none"
          placeholder="supervisor@university.edu"
        />
      </div>
      <PrimaryButton type="submit" size="md" disabled={isSubmitting} className="mb-[2px]">
        {isSubmitting ? 'جاري الحفظ...' : (initialData ? 'تحديث البيانات' : 'تعيين المشرف')}
      </PrimaryButton>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mb-[2px] px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold transition-colors"
        >
          إلغاء
        </button>
      )}
      {errorMsg && <p className="text-red-600 text-xs mt-1 w-full md:w-auto">{errorMsg}</p>}
    </form>
  );
};

const AddMemberModal = ({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const projectId = localStorage.getItem('project_id');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/members`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
      } else {
        setErrorMsg(data.message || 'حدث خطأ أثناء الإضافة');
      }
    } catch (err: any) {
      setErrorMsg(`تعذر الاتصال بالخادم (${API_URL}). ${err.message || ''}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md shadow-2xl animate-fade-in">
        {/* Header Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#9BB1D9] rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-black">إضافة طالب جديد</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#9BB1D9] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">الايميل الجامعي</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#9BB1D9] outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">كلمة مرور افتراضية</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#9BB1D9] outline-none transition-all"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <PrimaryButton type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'جاري الإضافة...' : 'حفظ'}
            </PrimaryButton>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-bold transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};