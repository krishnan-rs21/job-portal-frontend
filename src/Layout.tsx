import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-grow">
        <ErrorBoundary resetKey={location.pathname + location.search}>{children}</ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
