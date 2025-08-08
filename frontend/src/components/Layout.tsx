import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout component
 * Provides consistent header, footer, and content structure
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isAuthenticated={isAuthenticated} user={user} />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
