import React from "react";
import { useTranslation } from "react-i18next";
import { BriefcaseIcon, CheckCircleIcon } from "./Icons";

const AuthShell: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => {
  const { t } = useTranslation();
  const perks = [t("auth.perk1"), t("auth.perk2"), t("auth.perk3")];

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20 lg:px-8">
      <div className="hidden lg:block">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <BriefcaseIcon />
        </div>
        <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900">{t("auth.heroTitle")}</h2>
        <p className="mt-4 max-w-md text-lg text-slate-500">{t("auth.heroSubtitle")}</p>
        <ul className="mt-8 space-y-4">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-3 text-slate-700">
              <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
              {perk}
            </li>
          ))}
        </ul>
      </div>
      <div className="card mx-auto w-full max-w-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
};

export default AuthShell;
