import React from 'react';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: 'calculator' | 'history' | 'statistics';
  onPageChange?: (page: 'calculator' | 'history' | 'statistics') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  return (
    <div className="page mesh-gradient">
      <main className="container pb-28">{children}</main>
      <Footer currentPage={currentPage} onPageChange={onPageChange} />
    </div>
  );
};

export default Layout;
