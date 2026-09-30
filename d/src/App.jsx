import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import HomePage from './components/pages/HomePage';
import DatabasePage from './components/pages/DatabasePage';
import CameraFeedPage from './components/pages/CameraFeedPage';
import LogsPage from './components/pages/LogsPage';
import FinesDisciplinaryPage from './components/pages/FinesDisciplinaryPage';
import FaceAttendancePage from './components/pages/FaceAttendancePage';
import StudentDashboard from './components/pages/StudentDashboard';
import ClassroomApp from './components/classroom/ClassroomApp';
import ToastContainer from './components/common/ToastContainer';
import {
  Database,
  Video,
  History,
  Scale,
  ScanFace
} from 'lucide-react';

export default function App() {
  const { currentView, userRole, activeTab, setActiveTab, students, logs, fines } = useApp();

  const pendingFinesCount = fines.filter(f => f.status !== "Served / Paid").length;
  const curfewAlertsCount = logs.filter(l => l.curfewAlert).length;
  const presentCount = students.filter(s => s.present).length;

  const features = [
    {
      id: 'database',
      label: 'Database',
      icon: Database,
      count: `${students.length}`,
    },
    {
      id: 'attendance',
      label: 'Face Attendance',
      icon: ScanFace,
      badge: presentCount > 0 ? `${presentCount} Present` : 'AI',
      badgeColor: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
    },
    {
      id: 'camera',
      label: 'CCTV',
      icon: Video,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
    },
    {
      id: 'logs',
      label: 'Hostel Entry & Exit',
      icon: History,
      badge: curfewAlertsCount > 0 ? `${curfewAlertsCount} Alerts` : null,
      badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
    },
    {
      id: 'fines',
      label: 'Fine & Actions',
      icon: Scale,
      badge: pendingFinesCount > 0 ? `${pendingFinesCount} Pending` : null,
      badgeColor: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
    }
  ];

  const renderAdminPage = () => {
    switch (activeTab) {
      case 'database':
        return <DatabasePage />;
      case 'attendance':
        return <FaceAttendancePage />;
      case 'camera':
        return <CameraFeedPage />;
      case 'logs':
        return <LogsPage />;
      case 'fines':
        return <FinesDisciplinaryPage />;
      default:
        return <DatabasePage />;
    }
  };

  if (currentView === 'home') {
    return (
      <>
        <HomePage />
        <ToastContainer />
      </>
    );
  }

  if (currentView === 'classroom') {
    return <ClassroomApp />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Status Bar with Theme Switcher & Home Exit */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {userRole === 'admin' ? (
          /* =================== ADMIN VIEW (CENTERED) =================== */
          <div className="space-y-6">
            
            {/* Centered ADMIN Header & Navigation Tabs */}
            <div className="space-y-4 text-center">
              
              {/* Centered ADMIN Title */}
              <div className="space-y-1 pb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase font-mono text-center text-slate-900 dark:text-white">
                  ADMIN
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Central Management Console & Campus Surveillance Operations
                </p>
              </div>

              {/* Centered Horizontal Feature Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-3xl mx-auto shadow-sm">
                {features.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                      
                      {item.count && (
                        <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded font-medium ${
                          isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {item.count}
                        </span>
                      )}

                      {item.badge && (
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Content Module */}
            <div className="pt-2">
              {renderAdminPage()}
            </div>
          </div>
        ) : (
          /* =================== STUDENT VIEW =================== */
          <div className="space-y-6">
            <StudentDashboard />
          </div>
        )}

      </main>

      {/* Floating System Notifications */}
      <ToastContainer />
    </div>
  );
}
