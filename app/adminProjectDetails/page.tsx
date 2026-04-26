'use client';

import SidebarAdmin from '@/components/SidebarAdmin';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { API_URL, getHeaders } from '@/config/api';
import Link from 'next/link';
import { 
  Users, 
  User as UserIcon, 
  FileText, 
  ChevronLeft, 
  Calendar, 
  Mail, 
  ShieldCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface ProjectDetail {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  supervisor_entity?: {
    User?: {
      full_name: string;
      email: string;
    };
  };
  Students: Array<{
    id: number;
    type: string;
    User: {
      full_name: string;
      email: string;
    };
  }>;
  ProjectDocument?: {
    id: number;
    title: string;
    created_at: string;
  };
}

function AdminProjectDetailsContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const projectId = searchParams.get('id');

  useEffect(() => {
    if (projectId) {
      console.log('Fetching project with ID:', projectId);
      fetchProjectDetails(projectId);
    } else {
      console.warn('No project ID found in URL params');
      setIsLoading(false);
    }
  }, [projectId]);

  const fetchProjectDetails = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorStatus('يجب تسجيل الدخول أولاً');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/projects/${id}`, {
        headers: getHeaders(token),
      });
      const data = await res.json();
      
      if (res.ok) {
        setProject(data.data.project);
      } else {
        setErrorStatus(data.message || 'فشل تحميل بيانات المشروع');
      }
    } catch (err) {
      console.error('Error fetching project details:', err);
      setErrorStatus('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-gray-500 font-bold">جاري تحميل تفاصيل المشروع...</p>
        </div>
      </div>
    );
  }

  if (errorStatus || !project) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4" dir="rtl">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{errorStatus || 'المشروع غير موجود'}</h2>
          <p className="text-gray-500 mb-8 font-medium">تأكد من صحة الرابط أو حاول العودة للوحة التحكم واختيار المشروع مرة أخرى.</p>
          <Link 
            href="/adminDashboard" 
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
          >
            <ArrowRight className="w-4 h-4" /> العودة للوحة التحكم
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden" dir="rtl">
      <SidebarAdmin isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <PageHeaderSupervisor title="تفاصيل المشروع" onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <Link href="/adminDashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 mb-4 transition-colors font-bold">
                  <ChevronLeft className="w-4 h-4 rotate-180" /> عودة للوحة التحكم
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title || 'مشروع بدون عنوان'}</h1>
                <p className="text-gray-600 leading-relaxed max-w-2xl">{project.description || 'لا يوجد وصف متاح لهذا المشروع حالياً.'}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-bold">تاريخ البدء: {project.start_date ? new Date(project.start_date).toLocaleDateString('ar-SA') : 'غير محدد'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                     <FileText className="w-5 h-5" />
                     <span className="text-sm font-bold">المستندات: {project.ProjectDocument ? 'مكتمل' : 'غير متوفر'}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex flex-col gap-3">
                <Link 
                  href={`/documents?projectId=${project.id}`}
                  className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                  <FileText className="w-5 h-5" />
                  عرض المستندات
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Supervisor Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">المشرف المسؤول</h3>
                  </div>

                  {project.supervisor_entity?.User ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-sm text-gray-400 font-bold mb-1">الاسم الكامل</p>
                        <p className="font-bold text-gray-900">{project.supervisor_entity.User.full_name}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-sm text-gray-400 font-bold mb-1">البريد الإلكتروني</p>
                        <p className="text-sm font-medium text-gray-700">{project.supervisor_entity.User.email}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic text-center py-8 font-bold">لم يتم تعيين مشرف بعد</p>
                  )}
                </div>
              </div>

              {/* Team Members Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">فريق المشروع ({project.Students ? project.Students.length : 0})</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.Students && project.Students.map((student) => (
                      <div key={student.id} className="flex items-center gap-4 p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-colors">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          student.type === 'student leader' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <UserIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{student.User.full_name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              student.type === 'student leader' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {student.type === 'student leader' ? 'قائد الفريق' : 'عضو'}
                            </span>
                            <span className="text-[11px] text-gray-400 flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {student.User.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminProjectDetailsPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <AdminProjectDetailsContent />
    </Suspense>
  );
}
