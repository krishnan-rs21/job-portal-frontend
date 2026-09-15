import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-indigo-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{t("notFound.title")}</h1>
      <p className="mt-2 text-slate-500">{t("notFound.subtitle")}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/" className="btn-primary">
          {t("nav.home")}
        </Link>
        <Link to="/jobs" className="btn-secondary">
          {t("nav.jobs")}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
