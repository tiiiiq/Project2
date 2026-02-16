import Sidebar from '../../components/Sidebar';
import ProjectForm from '../../components/project/ProjectForm';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">بيانات المشروع</h1>
            <p className="text-gray-600 mt-2"></p>
          </div>
          <ProjectForm />
        </div>
      </main>
    </div>
  );
}