import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { setAuth } from "../store";
import type { AppDispatch, RootState } from "../store";
import { loginRequest } from "../services/authService";
import { getErrorMessage } from "../services/apiClient";
import AuthShell from "../components/AuthShell";
import PasswordInput from "../components/PasswordInput";
import { AlertIcon, CheckCircleIcon, MailIcon } from "../components/Icons";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const safeRedirect = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/jobs";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = safeRedirect(searchParams.get("redirect"));
  const justRegistered = searchParams.get("registered") === "1";
  const sessionExpired = searchParams.get("expired") === "1";

  if (user && !loading) {
    return <Navigate to={redirect} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError(t("auth.invalidEmail"));
      return;
    }
    if (!password) {
      setError(t("auth.passwordRequired"));
      return;
    }
    setLoading(true);
    try {
      const { accessToken, refreshToken, user } = await loginRequest(email.trim(), password);
      dispatch(setAuth({ accessToken, refreshToken, user }));
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, t("errors.serverError")));
      setLoading(false);
    }
  };

  const signupLink = `/signup${
    searchParams.get("redirect") ? `?redirect=${encodeURIComponent(redirect)}` : ""
  }`;

  return (
    <AuthShell title={t("auth.loginTitle")} subtitle={t("auth.loginSubtitle")}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {justRegistered && !error && (
          <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" />
            {t("auth.registered")}
          </div>
        )}
        {sessionExpired && !error && !justRegistered && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            {t("auth.sessionExpired")}
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        <div>
          <label htmlFor="email" className="label">
            {t("auth.email")}
          </label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input pl-9"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="password" className="label">
            {t("auth.password")}
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={loading}
            required
          />
        </div>
        <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {loading ? t("auth.signingIn") : t("nav.login")}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        {t("auth.noAccount")}{" "}
        <Link to={signupLink} className="font-semibold text-indigo-600 hover:text-indigo-700">
          {t("nav.signup")}
        </Link>
      </p>
    </AuthShell>
  );
};

export default LoginPage;
