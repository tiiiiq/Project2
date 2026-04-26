'use client';

import SidebarAdmin from '@/components/SidebarAdmin';
import PageHeaderSupervisor from '@/components/PageHeaderSupervisor'; // Reuse header or create similar
import { useState, useEffect } from 'react';
import { API_URL, getHeaders } from '@/config/api';
import Link from 'next/link';
import { BarChart3, Briefcase, CheckCircle2, Layout, ArrowLeftRight } from 'lucide-react';

interface ProjectStat {
  id: number;
  title: string;
  supervisorName: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
}

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProjectStats();
  }, []);

  const fetchProjectStats = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/admin/projects`, {
        headers: getHeaders(token!),
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data.data.projects);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden" dir="rtl">
      <SidebarAdmin isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <PageHeaderSupervisor title="لوحة تحكم كاملة للمشاريع" onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">متابعة كافة المشاريع</h1>
              <p className="text-gray-500">نظرة شاملة على تقدم العمل وتوزيع المهام في كافة المجموعات.</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد مشاريع مسجلة بعد</h3>
                <p className="text-gray-500">بمجرد قيام الطلاب بإنشاء مجموعاتهم وتكليف المهام، ستظهر هنا.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{project.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="font-bold">المشرف:</span>
                              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">{project.supervisorName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-xs text-gray-400 font-bold mb-1">المهام الكلية</p>
                              <p className="text-lg font-bold text-gray-900">{project.totalTasks}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-400 font-bold mb-1">المنجزة</p>
                              <p className="text-lg font-bold text-green-600">{project.completedTasks}</p>
                            </div>
                            <div className="h-10 w-px bg-gray-100 mx-2 hidden md:block"></div>
                            <Link 
                              href={`/adminProjectDetails?id=${project.id}`}
                              className="px-6 py-2 bg-[#090832] text-white rounded-xl font-bold hover:bg-[#1a1945] transition-colors"
                            >
                              تفاصيل المشروع
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-gray-700">نسبة الإنجاز الكلية (بناءً على المهام الفرعية)</span>
                          <span className={`text-sm font-bold ${
                            project.progress >= 75 ? 'text-green-600' :
                            project.progress >= 25 ? 'text-orange-600' :
                            'text-red-600'
                          }`}>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ease-out rounded-full ${
                              project.progress >= 75 ? 'bg-green-500' :
                              project.progress >= 25 ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
