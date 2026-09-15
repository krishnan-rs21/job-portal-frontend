import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BriefcaseIcon } from './Icons';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <BriefcaseIcon className="h-4 w-4" />
              </span>
              <span className="font-bold text-slate-900">
                Job<span className="text-indigo-600">Portal</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-500">{t('footer.tagline')}</p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <p className="font-semibold text-slate-900">{t('footer.explore')}</p>
              <ul className="mt-3 space-y-2 text-slate-500">
                <li>
                  <Link to="/jobs" className="hover:text-indigo-600">{t('nav.jobs')}</Link>
                </li>
                <li>
                  <Link to="/my-applications" className="hover:text-indigo-600">{t('nav.applications')}</Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{t('footer.account')}</p>
              <ul className="mt-3 space-y-2 text-slate-500">
                <li>
                  <Link to="/login" className="hover:text-indigo-600">{t('nav.login')}</Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-indigo-600">{t('nav.signup')}</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
