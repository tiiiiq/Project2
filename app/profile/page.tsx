'use client';

import {
  User,
  Mail,
  Heart,
  Briefcase,
  Sparkles,
  Lock,
  Camera,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import PageHeader from '@/components/PageHeader';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { Users } from 'lucide-react';
import { API_URL, getHeaders } from '@/config/api';

export default function ProfilePage() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    specialization: '',
    skills: '', // will be comma separated
    interests: '', // matching text area
    curiosities_and_changes: '',
    password: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_URL}/api/student/profile`, {
        headers: getHeaders(token)
      })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.status === 'success' && data.data.user) {
          const user = data.data.user;
          const student = user.Student || {};
          setFormData(prev => ({
            ...prev,
            username: user.username || '',
            email: user.email || '',
            full_name: user.full_name || '',
            specialization: student.specialization || '',
            skills: student.skills || '',
            interests: student.interests || '',
            curiosities_and_changes: student.curiosities_and_changes || '',
            password: '' // Don't prefill password
          }));
        }
      })
      .catch(err => console.error('Error fetching profile:', err));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMsg('Token not found. Please relogin.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/student/profile`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({
          full_name: formData.full_name,
          specialization: formData.specialization,
          skills: formData.skills,
          interests: formData.interests,
          curiosities_and_changes: formData.curiosities_and_changes,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg('تم حفظ بيانات البروفايل بنجاح!');
        setFormData(prev => ({ ...prev, password: '' })); // Clear password on success
      } else {
        setErrorMsg(data.message || 'حدث خطأ أثناء الحفظ');
      }
    } catch (err: any) {
      console.error('Update profile error:', err);
      setErrorMsg(`تعذر الاتصال بالخادم (${API_URL}). ${err.message || ''}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden lg:static" dir="rtl">
     

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <PageHeader title="الملف الشخصي" onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto ">
            {/* عنوان الصفحة */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#090832] mb-2">الملف الشخصي</h1>
              <p className="text-gray-500">عرض وتعديل معلوماتك الشخصية</p>
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* ===== الشريط الجانبي الأيمن ===== */}
              <div className="col-span-12 lg:col-span-4">
                {/* بطاقة البروفايل */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                  <div className="flex flex-col items-center text-center">
                    {/* صورة البروفايل */}
                    <div className="relative mb-4">
                      <div className="w-28 h-28  bg-[#585C9A] rounded-2xl flex items-center justify-center shadow-lg">
                        <User className="w-14 h-14 text-white" />
                      </div>
                      <button className="absolute -bottom-2 -left-2 w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors">
                        <Camera className="w-4 h-4 text-[#090832]" />
                      </button>
                    </div>

                    <h2 className="text-xl font-bold text-[#090832] mb-1">{formData.username || 'اسم المستخدم'}</h2>
                    <p className="text-gray-500 text-sm mb-4">{formData.full_name || 'الاسم الكامل'}</p>

                    <div className="w-full pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">الإيميل الجامعي</span>
                        <span className="text-sm font-medium text-[#090832]">{formData.email || 'university@edu.com'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* قائمة التنقل الجانبية الداخلية */}
                <div className="bg-[#090832] text-gray-50 rounded-2xl shadow-sm border border-gray-100 p-4">
                  <nav className="space-y-1">
                    {[
                      { icon: User, label: 'الرئيسية', href: '/leaderDashboard' },
                      { icon: Briefcase, label: 'المشروع', href: '/project' },
                      { icon: Users, label: 'فريق المشروع', href: '/projectGroup' },
                      { icon: Heart, label: 'غرفة الدردشة', href: '/chat' },
                    ].map((item, index) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={index}
                          href={item.href}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${isActive
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 border-r-4 border-blue-500'
                            : 'text-gray-50 hover:bg-blue-950 '
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronLeft className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* ===== المحتوى الرئيسي ===== */}
              <div className="col-span-12 lg:col-span-8">
                {successMsg && (
                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">{successMsg}</span>
                  </div>
                )}
                {errorMsg && (
                  <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 text-red-700 font-medium">
                    {errorMsg}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  {/* قسم التخصص */}
                  <div className="bg-white shadow-sm border border-gray-100 p-6 mb-6 rounded-2xl">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                      <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9BB1D9] transition-all rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">التخصص</label>
                      <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9BB1D9] transition-all rounded-xl" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">المهارات</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {formData.skills.split(',').filter(s => s.trim()).map((skill, index) => (
                          <span key={index} className="px-4 py-2 bg-[#9BB1D9]/10 text-[#090832] rounded-lg text-sm">{skill.trim()}</span>
                        ))}
                      </div>
                      <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="أدخل المهارات مفصولة بفاصلة (,)..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9BB1D9] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">اهتماماتك في التكنولوجيا</label>
                      <textarea rows={3} name="interests" value={formData.interests} onChange={handleChange} placeholder="اكتب اهتماماتك هنا..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9BB1D9] transition-all" />
                    </div>
                  </div>
                </div>

                {/* قسم الأشياء التي تثير فضولك */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-[#9BB1D9] rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-[#090832]">الأشياء التي تثير فضولك</h3>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">واشياء ترغب في تغييرها</label>
                      <textarea rows={3} name="curiosities_and_changes" value={formData.curiosities_and_changes} onChange={handleChange} placeholder="تطوير أدوات تعلم تفاعلية، تحسين تجربة المستخدم في التطبيقات التعليمية..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9BB1D9] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور (اتركها فارغة إذا لم ترد التغيير)</label>
                      <div className="relative">
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="أدخل كلمة المرور الجديدة" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9BB1D9] transition-all" />
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <PrimaryButton type="submit" size="lg" disabled={isLoading}>
                    {isLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                  </PrimaryButton>
                </div>
              </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
