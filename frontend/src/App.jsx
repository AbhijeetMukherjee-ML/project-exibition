import React from 'react';
import { useApp } from './context/AppContext';

import Navbar from './components/layout/Navbar';
import HomePage from './components/pages/HomePage';
import ToastContainer from './components/common/ToastContainer';

// Core AI pages
import ClassroomAttendancePage from './components/pages/ClassroomAttendancePage';
import HostelAttendancePage from './components/pages/HostelAttendancePage';
import DisciplinaryPage from './components/pages/DisciplinaryPage';
import StudentsPage from './components/pages/StudentsPage';
import StudentDashboard from './components/pages/StudentDashboard';

export default function App() {
  const { currentView, activeTab, setActiveTab, userRole } = useApp();

  // ── HOME ──────────────────────────────────────────────────
  if (currentView === 'home') {
    return (
      <>
        <HomePage />
        <ToastContainer />
      </>
    );
  }

  // ── PORTAL ────────────────────────────────────────────────
  const renderPage = () => {
    if (userRole === 'student') return <StudentDashboard />;
    switch (activeTab) {
      case 'classroom':   return <ClassroomAttendancePage />;
      case 'hostel':      return <HostelAttendancePage />;
      case 'disciplinary':return <DisciplinaryPage />;
      case 'students':    return <StudentsPage />;
      default:            return <ClassroomAttendancePage />;
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 flex flex-col font-sans min-h-screen text-slate-900 dark:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 lg:px-8 max-w-7xl mx-auto px-4 py-6 sm:px-6 w-full">
        {renderPage()}
      </main>
      <ToastContainer />
    </div>
  );
}