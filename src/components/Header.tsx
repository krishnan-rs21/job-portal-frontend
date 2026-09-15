import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { clearAuth } from '../store';
import type { AppDispatch, RootState } from '../store';
import { resetApplications } from '../store/slices/applicationsSlice';
import { logoutRequest } from '../services/authService';
import { BriefcaseIcon, CloseIcon, FileTextIcon, LogoutIcon, MenuIcon } from './Icons';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(location.pathname);
  const menuRef = useRef<HTMLDivElement>(null);

  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMobileOpen(false);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleLogout = async () => {
    await logoutRequest();
    dispatch(clearAuth());
    dispatch(resetApplications());
    navigate('/');
  };

  const navItems = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/jobs', label: t('nav.jobs'), end: false },
    ...(user ? [{ to: '/my-applications', label: t('nav.applications'), end: false }] : []),
  ];

  const initials = (user?.name || user?.email || 'U')
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const redirectQuery =
    location.pathname !== '/login' && location.pathname !== '/signup'
      ? `?redirect=${encodeURIComponent(location.pathname + location.search)}`
      : '';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <BriefcaseIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Job<span className="text-indigo-600">Portal</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 py-1 pl-1 pr-3 transition hover:bg-slate-50"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
                  {initials}
                </span>
                <span className="max-w-[10rem] truncate text-sm font-medium text-slate-700">
                  {user.name || user.email}
                </span>
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
                >
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <Link
                    to="/my-applications"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <FileTextIcon className="h-4 w-4" />
                    {t('nav.applications')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <LogoutIcon className="h-4 w-4" />
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to={`/login${redirectQuery}`} className="btn-ghost">
                {t('nav.login')}
              </Link>
              <Link to={`/signup${redirectQuery}`} className="btn-primary">
                {t('nav.signup')}
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="space-y-1">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 border-t border-slate-100 pt-4">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                </div>
                <button onClick={handleLogout} className="btn-secondary">
                  <LogoutIcon className="h-4 w-4" />
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to={`/login${redirectQuery}`} className="btn-secondary">
                  {t('nav.login')}
                </Link>
                <Link to={`/signup${redirectQuery}`} className="btn-primary">
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
