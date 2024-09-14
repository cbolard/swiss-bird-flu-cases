// src/infrastructure/ui/App.tsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from '@/infrastructure/ui/components/Sidebar';
import Header from '@/infrastructure/ui/components/Header';
import ActivityFeed from '@/infrastructure/ui/components/ActivityFeed';

import Dashboard from '@/infrastructure/ui/pages/Dashboard';
import About from '@/infrastructure/ui/pages/About';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen flex-col bg-gray-900">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="xl:pl-72">
          <Header setSidebarOpen={setSidebarOpen} />

          <main className="lg:pr-96">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
              <div className="h-[calc(100vh-200px)] bg-gray-900 rounded-lg overflow-hidden">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </div>
            </div>
          </main>

          <ActivityFeed />
        </div>
      </div>
    </Router>
  );
};

export default App;
