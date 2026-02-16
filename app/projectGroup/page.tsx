// app/team/page.tsx
'use client';

import { useState } from 'react';
import { Search, UserPlus, Mail, User, Trash2, Edit } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import PrimaryButton from '@/components/buttons/PrimaryButton';

// واجهة بيانات الطالب
interface Student {
  id: number;
  name: string;
  universityEmail: string;
  university: string;
  joinDate: string;
}

export default function TeamPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // بيانات تجريبية للطلاب
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

  // فلترة الطلاب حسب البحث
  const filteredStudents = students.filter(student => 
    student.name.includes(searchTerm) || 
    student.universityEmail.includes(searchTerm)
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      {/* الهيدر مع العنوان وزر الإضافة */}
         <main className="flex-1 p-8">
      <div className="flex flex-row-reverse justify-between items-center mb-8">
            <PrimaryButton 
             onClick={() => setIsModalOpen(true)}
            type="submit"     
            size="lg"
          >
          اضافة طالب
          </PrimaryButton>
      </div>

      {/* جدول الطلاب */}
      <div className="bg-white   border-gray-900 overflow-hidden">
        <table className="w-full">
          <thead className="bg-white border-b border-gray-900">
            <tr>
              <th className="px-6 py-4 text-right text-sm  text-gray-900">#</th>
              <th className="px-6 py-4 text-right text-sm  text-gray-900">اسم الطالب</th>
              <th className="px-6 py-4 text-right text-sm  text-gray-900">الايميل</th>
              <th className="px-6 py-4 text-center text-sm  text-gray-900">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student, index) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
             
                    <span className="text-sm font-medium text-gray-900">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.universityEmail}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* رسالة عند عدم وجود نتائج */}
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا يوجد طلاب مطابقين للبحث</p>
          </div>
        )}
      </div>
      </main>

      {/* Modal إضافة عضو جديد */}
      {isModalOpen && (
        <AddMemberModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
    
  );
}

// مكون Modal إضافة عضو جديد
const AddMemberModal = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    universityEmail: '',
    university: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
 
    console.log('New member:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white  w-full max-w-md shadow-2xl animate-fade-in">
        {/* Header Modal */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#9BB1D9] rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl  text-black">إضافة طالب جديد</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Modal */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* حقل البريد الجامعي */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
       
             الايميل
            </label>
            <input
              type="email"
              required
              value={formData.universityEmail}
              onChange={(e) => setFormData({...formData, universityEmail: e.target.value})}
      
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9BB1D9] focus:border-transparent transition-all"
            />
          </div>

          {/* حقل اسم الطالب */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            الاسم الكامل
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
           
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9BB1D9] focus:border-transparent transition-all"
            />
          </div>

          {/* حقل الجامعة */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            
              كلمة المرور
            </label>
            <input
              type="password"
              required
              value={formData.university}
              onChange={(e) => setFormData({...formData, university: e.target.value})}
         
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9BB1D9] focus:border-transparent transition-all"
            />
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-6">
        <PrimaryButton 
            type="submit"     
            size="lg"
          >
             حفظ
          </PrimaryButton>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};