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
  const {
    currentView,
    userRole,
    activeTab,
    setActiveTab,
    students,
    logs,
    fines
  } = useApp();

  // ============================================================
  // DASHBOARD COUNTS
  // ============================================================

  const pendingFinesCount = fines.filter(
    fine => fine.status !== 'Served / Paid'
  ).length;

  const curfewAlertsCount = logs.filter(
    log => log.curfewAlert === true
  ).length;

  const presentCount = students.filter(
    student => student.present === true
  ).length;

  // ============================================================
  // ADMIN NAVIGATION FEATURES
  // ============================================================

  const features = [
    {
      id: 'database',
      label: 'Database',
      icon: Database,
      count: students.length
    },

    {
      id: 'attendance',
      label: 'Face Attendance',
      icon: ScanFace,
      badge: presentCount > 0 ? `${presentCount} Present` : 'AI',
      badgeColor:
        'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
    },

    {
      id: 'camera',
      label: 'CCTV',
      icon: Video,
      badge: 'LIVE',
      badgeColor:
        'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
    },

    {
      id: 'logs',
      label: 'Hostel Entry & Exit',
      icon: History,
      badge:
        curfewAlertsCount > 0
          ? `${curfewAlertsCount} Alerts`
          : null,
      badgeColor:
        'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
    },

    {
      id: 'fines',
      label: 'Fine & Actions',
      icon: Scale,
      badge:
        pendingFinesCount > 0
          ? `${pendingFinesCount} Pending`
          : null,
      badgeColor:
        'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
    }
  ];

  // ============================================================
  // ADMIN PAGE ROUTER
  // ============================================================

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

  // ============================================================
  // HOME
  // ============================================================

  if (currentView === 'home') {
    return (
      <>
        <HomePage />
        <ToastContainer />
      </>
    );
  }

  // ============================================================
  // SMART CLASSROOM
  // ============================================================

  if (currentView === 'classroom') {
    return (
      <>
        <ClassroomApp />
        <ToastContainer />
      </>
    );
  }

  // ============================================================
  // PORTAL
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">

      {/* ========================================================
          TOP NAVBAR
      ======================================================== */}

      <Navbar />

      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* ======================================================
            ADMIN PORTAL
        ====================================================== */}

        {userRole === 'admin' ? (
          <div className="space-y-6">

            {/* --------------------------------------------------
                ADMIN HEADER
            -------------------------------------------------- */}

            <div className="space-y-4 text-center">

              <div className="space-y-1">

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase font-mono text-slate-900 dark:text-white">
                  ADMIN
                </h1>

                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Central Management Console & Campus Surveillance Operations
                </p>

              </div>

              {/* ------------------------------------------------
                  ADMIN NAVIGATION
              ------------------------------------------------ */}

              <div className="w-full max-w-5xl mx-auto">

                <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">

                  {features.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`
                          flex items-center justify-center gap-2
                          py-2 px-3 sm:px-4
                          rounded-lg
                          text-xs font-semibold
                          transition-all duration-200
                          cursor-pointer
                          whitespace-nowrap
                          ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                          }
                        `}
                      >

                        <Icon className="w-4 h-4 shrink-0" />

                        <span>
                          {item.label}
                        </span>

                        {/* Database count */}
                        {item.count !== undefined && (
                          <span
                            className={`
                              text-[11px]
                              font-mono
                              px-1.5
                              py-0.5
                              rounded
                              font-medium
                              ${
                                isActive
                                  ? 'bg-blue-700 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }
                            `}
                          >
                            {item.count}
                          </span>
                        )}

                        {/* Status badge */}
                        {item.badge && (
                          <span
                            className={`
                              text-[10px]
                              font-mono
                              px-1.5
                              py-0.5
                              rounded
                              font-bold
                              ${item.badgeColor}
                            `}
                          >
                            {item.badge}
                          </span>
                        )}

                      </button>
                    );
                  })}

                </div>

              </div>

            </div>

            {/* --------------------------------------------------
                ACTIVE ADMIN MODULE
            -------------------------------------------------- */}

            <section className="pt-1">
              {renderAdminPage()}
            </section>

          </div>
        ) : (

          /* ====================================================
             STUDENT PORTAL
          ==================================================== */

          <div className="space-y-6">

            <StudentDashboard />

          </div>
        )}

      </main>

      {/* ========================================================
          GLOBAL TOAST NOTIFICATIONS
      ======================================================== */}

      <ToastContainer />

    </div>
  );
}