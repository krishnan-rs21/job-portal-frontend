import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { setAuth } from "../store";
import type { AppDispatch, RootState } from "../store";
import { loginRequest, registerRequest } from "../services/authService";
import { getErrorMessage } from "../services/apiClient";
import AuthShell from "../components/AuthShell";
import PasswordInput from "../components/PasswordInput";
import { AlertIcon, MailIcon, UserIcon } from "../components/Icons";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignupErrors = Partial<Record<keyof SignupForm, string>>;

const safeRedirect = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : "/jobs";

const passwordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

const STRENGTH_COLORS = ["bg-slate-200", "bg-rose-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"];

const SignupPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState<SignupForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<SignupErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = safeRedirect(searchParams.get("redirect"));

  if (user && !loading) {
    return <Navigate to={redirect} replace />;
  }

  const update = (key: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next: SignupErrors = {};
    if (!form.firstName.trim()) next.firstName = t("auth.required");
    if (!form.lastName.trim()) next.lastName = t("auth.required");
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = t("auth.invalidEmail");
    if (form.password.length < 8) next.password = t("auth.passwordMin");
    if (form.confirmPassword !== form.password) next.confirmPassword = t("auth.passwordMismatch");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    const email = form.email.trim();
    setLoading(true);
    try {
      await registerRequest({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email,
        password: form.password,
      });
    } catch (err) {
      const message = getErrorMessage(err, t("errors.serverError"));
      setError(message === "Registration failed" ? t("auth.registrationFailed") : message);
      setLoading(false);
      return;
    }

    try {
      const { accessToken, refreshToken, user } = await loginRequest(email, form.password);
      dispatch(setAuth({ accessToken, refreshToken, user }));
      navigate(redirect, { replace: true });
    } catch {
      navigate(
        `/login?registered=1&email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirect)}`,
        { replace: true },
      );
    }
  };

  const strength = passwordStrength(form.password);
  const fieldError = (key: keyof SignupForm) =>
    errors[key] ? <p className="mt-1 text-xs text-rose-600">{errors[key]}</p> : null;

  return (
    <AuthShell title={t("auth.signupTitle")} subtitle={t("auth.signupSubtitle")}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="label">
              {t("auth.firstName")}
            </label>
            <div className="relative">
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="firstName"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                className={`input pl-9 ${errors.firstName ? "border-rose-400" : ""}`}
                autoComplete="given-name"
                disabled={loading}
              />
            </div>
            {fieldError("firstName")}
          </div>
          <div>
            <label htmlFor="lastName" className="label">
              {t("auth.lastName")}
            </label>
            <input
              id="lastName"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className={`input ${errors.lastName ? "border-rose-400" : ""}`}
              autoComplete="family-name"
              disabled={loading}
            />
            {fieldError("lastName")}
          </div>
        </div>
        <div>
          <label htmlFor="email" className="label">
            {t("auth.email")}
          </label>
          <div className="relative">
            <MailIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              className={`input pl-9 ${errors.email ? "border-rose-400" : ""}`}
              autoComplete="email"
              disabled={loading}
            />
          </div>
          {fieldError("email")}
        </div>
        <div>
          <label htmlFor="password" className="label">
            {t("auth.password")}
          </label>
          <PasswordInput
            id="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder={t("auth.passwordPlaceholder")}
            autoComplete="new-password"
            disabled={loading}
            hasError={Boolean(errors.password)}
          />
          {form.password && (
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className={`h-1 flex-1 rounded-full ${
                    strength >= level ? STRENGTH_COLORS[strength] : "bg-slate-200"
                  }`}
                />
              ))}
            </div>
          )}
          {fieldError("password")}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="label">
            {t("auth.confirmPassword")}
          </label>
          <PasswordInput
            id="confirmPassword"
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            autoComplete="new-password"
            disabled={loading}
            hasError={Boolean(errors.confirmPassword)}
          />
          {fieldError("confirmPassword")}
        </div>
        <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {loading ? t("auth.creatingAccount") : t("auth.createAccount")}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        {t("auth.haveAccount")}{" "}
        <Link
          to={`/login${searchParams.get("redirect") ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          {t("nav.login")}
        </Link>
      </p>
    </AuthShell>
  );
};

export default SignupPage;
