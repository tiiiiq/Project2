'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Info, Save, RefreshCw, Lightbulb, CheckCircle2 } from 'lucide-react';
import PrimaryButton from '../buttons/PrimaryButton';
import { API_URL, getHeaders } from '@/config/api';

const ProjectForm = () => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    teamMembers: '1',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const pId = localStorage.getItem('project_id');
    const token = localStorage.getItem('token');
    if (pId && token) {
      setProjectId(pId);
      fetch(`${API_URL}/api/projects/${pId}`, {
        headers: getHeaders(token)
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.data.project) {
          const p = data.data.project;
          setFormData({
            projectName: p.title || '',
            description: p.description || '',
            teamMembers: '1', // Hardcoded as per layout for now
            startDate: p.start_date ? new Date(p.start_date).toISOString().split('T')[0] : '',
            endDate: p.end_date ? new Date(p.end_date).toISOString().split('T')[0] : '',
          });
        }
      })
      .catch(err => console.error('Error fetching project:', err));
    }
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setIsLoading(true);

    const token = localStorage.getItem('token');
    
    if (!projectId || !token) {
      setErrorMsg('Project ID or Token not found. Please relogin.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify({
          title: formData.projectName,
          description: formData.description,
          start_date: formData.startDate,
          end_date: formData.endDate
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg('تم حفظ بيانات المشروع بنجاح!');
      } else {
        setErrorMsg(data.message || 'حدث خطأ أثناء الحفظ');
      }
    } catch (err: any) {
      console.error('Update project error:', err);
      setErrorMsg(`تعذر الاتصال بالخادم (${API_URL}). ${err.message || ''}`);
    } finally {
      setIsLoading(false);
    }
  };

  const selectIdea = (idea: typeof projectIdeas[0]) => {
    setFormData({
      ...formData,
      projectName: idea.title,
      description: idea.description
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
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
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* اسم المشروع */}
            <div>
              <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                <span>اسم المشروع</span>
                <Info className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="w-full p-3 border outline-0 border-gray-300 rounded-lg focus:ring-1 focus:ring-[#090832] focus:border-[#090832] transition-all"
                required
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-md font-medium text-gray-700">رقم المشروع</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-[#090832]">#{projectId || '---'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* الوصف */}
          <div>
            <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
              <span>الوصف</span>
              <Info className="w-4 h-4 text-gray-400" />
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#090832] focus:border-[#090832] transition-all"
              required
            />
          </div>


   
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* عدد أعضاء الفريق */}
            <div>
              <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                <span>عدد أعضاء الفريق</span>
                <Users className="w-4 h-4 text-gray-400" />
              </label>
              <div className="relative">
                <select
                  name="teamMembers"
                  value={formData.teamMembers}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#090832] focus:border-[#090832] appearance-none bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* تاريخ بدء المشروع */}
            <div>
              <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                <span>تاريخ بدء المشروع</span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#090832] focus:border-[#090832] transition-all"
                  required
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* موعد تسليم المشروع */}
            <div>
              <label className="flex items-center gap-2 text-md font-medium text-gray-700 mb-2">
                <span>موعد تسليم المشروع</span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#090832] focus:border-[#090832] transition-all"
                  required
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>


        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-gray-200">
   

      <PrimaryButton 
            type="submit"     
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ'}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;