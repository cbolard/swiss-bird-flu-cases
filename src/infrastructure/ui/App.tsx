import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '@/infrastructure/ui/pages/Dashboard';
import SwissSidebar from '@/infrastructure/ui/components/SwissSidebar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="relative h-screen w-screen bg-swiss-bg overflow-hidden font-sans text-swiss-text selection:bg-swiss-red selection:text-white">
        {/* Map Layer */}
        <div className="absolute inset-0 z-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>

        {/* Sidebar */}
        <div className="absolute top-0 left-0 z-10 h-full w-80 bg-white/90 backdrop-blur-md border-r border-gray-100 p-6 shadow-[5px_0_30px_rgba(0,0,0,0.02)]">
          <SwissSidebar />
        </div>

        {/* Time Slider (Bottom Center) */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 w-[500px] bg-white/90 backdrop-blur-md rounded-full px-8 py-4 shadow-lg border border-gray-100 flex items-center gap-4">
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground">JAN</span>
          <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden relative cursor-pointer group">
            <div className="absolute top-0 left-0 h-full bg-swiss-red w-1/3 transition-all duration-300 ease-out"></div>
            <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-white border-2 border-swiss-red rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground">DEC</span>
        </div>
      </div>
    </Router>
  );
};

export default App;
