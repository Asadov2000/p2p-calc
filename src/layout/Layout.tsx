import React from 'react';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: 'calculator' | 'history' | 'statistics';
  onPageChange?: (page: 'calculator' | 'history' | 'statistics') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="min-h-screen bg-[#F7F7FB] dark:bg-black text-black dark:text-white flex flex-col">
      <main className="flex-1 px-4 pb-28">{children}</main>
      <Footer currentPage={currentPage} onPageChange={onPageChange} />
    </div>
  );
};

export default Layout;
