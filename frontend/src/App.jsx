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

export default function App() {
  const { currentView, activeTab, setActiveTab } = useApp();

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
    switch (activeTab) {
      case 'classroom':   return <ClassroomAttendancePage />;
      case 'hostel':      return <HostelAttendancePage />;
      case 'disciplinary':return <DisciplinaryPage />;
      case 'students':    return <StudentsPage />;
      default:            return <ClassroomAttendancePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderPage()}
      </main>
      <ToastContainer />
    </div>
  );
}