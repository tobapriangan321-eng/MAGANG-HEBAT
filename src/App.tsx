/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { DashboardView } from './views/DashboardView';
import { LogbookView } from './views/LogbookView';
import { TasksView } from './views/TasksView';
import { AttendanceView } from './views/AttendanceView';
import { JournalView } from './views/JournalView';
import { AchievementsView } from './views/AchievementsView';
import { ProfileView } from './views/ProfileView';
import { MentorReviewView } from './views/MentorReviewView';
import { AdminManagementView } from './views/AdminManagementView';
import { SettingsView } from './views/SettingsView';

const AppContent: React.FC = () => {
  const { activeView } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'logbook':
        return <LogbookView />;
      case 'tasks':
        return <TasksView />;
      case 'attendance':
        return <AttendanceView />;
      case 'journal':
        return <JournalView />;
      case 'achievements':
        return <AchievementsView />;
      case 'profile':
        return <ProfileView />;
      case 'mentor-review':
        return <MentorReviewView />;
      case 'admin-panel':
        return <AdminManagementView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating Feedback Alerts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
