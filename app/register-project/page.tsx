'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PrimaryButton from '@/components/buttons/PrimaryButton';
import { API_URL, getHeaders } from '@/config/api';

export default function RegisterProjectPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/register-project`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        localStorage.setItem('student', JSON.stringify(data.data.student));
        localStorage.setItem('project_id', data.data.project.id);
        
        router.push('/leaderDashboard');
      } else {
        setError(data.message || `حدث خطأ في عملية التسجيل (HTTP ${response.status})`);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(`تعذر الاتصال بالخادم (HTTP 127.0.0.1:5000). ${err.message || ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans" dir="rtl">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[300px] w-full flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/s3.jpg')" }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[#1e233d]/70 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight drop-shadow-md">
                سجّل مشروع تخرجك الآن في المنصة واستفد من خصائصها لنجاح مشروعك أنت وفريقك
            </h1>
        </div>
      </section>

      {/* Registration Form Section */}
      <main className="flex-1 flex flex-col items-center justify-start pt-12 px-4 pb-20">
        <div className="w-full max-w-lg bg-white p-8 md:p-12 shadow-sm border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 text-sm font-bold">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 text-right pr-1 italic">
                الايميل الجامعي
              </label>
              <input
                type="email"
                required
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-[#585C9A]/10 focus:border-[#585C9A] transition-all text-base rounded-[2px]"
                placeholder="example@university.edu"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700 text-right pr-1 italic">
                كلمة المرور
              </label>
              <input
                type="password"
                required
                value={password}
                disabled={loading}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-gray-200 py-3 px-4 text-right focus:outline-none focus:ring-2 focus:ring-[#585C9A]/10 focus:border-[#585C9A] transition-all text-base rounded-[2px]"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <PrimaryButton
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full py-3 text-lg font-bold bg-[#585C9A] hover:bg-[#4a4e82] transition-colors rounded-[2px] shadow-sm tracking-wide disabled:opacity-50"
              >
                {loading ? 'جاري التسجيل...' : 'تسجيل'}
              </PrimaryButton>
            </div>
            
            <p className="text-center text-sm text-gray-600 pt-4">
                لديك حساب بالفعل؟ <Link href="/login" className="text-blue-600 font-bold hover:underline">تسجيل الدخول</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
