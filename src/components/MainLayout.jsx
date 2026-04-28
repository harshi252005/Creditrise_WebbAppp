import React from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {children}
        
        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};

export default MainLayout;
