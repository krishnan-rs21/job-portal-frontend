import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between">
      <nav>
        <Link to="/" className="mr-4">{t('nav.home')}</Link>
        <Link to="/jobs" className="mr-4">{t('nav.jobs')}</Link>
        <Link to="/my-applications">{t('nav.applications')}</Link>
      </nav>
      <div>
        <button>{t('nav.login')}</button>
      </div>
    </header>
  );
};

export default Header;
