import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState, AppDispatch } from "../store";
import { fetchUserApplications } from "../store/slices/applicationsSlice";
import { Link } from "react-router-dom";
import { formatDate, titleInitials } from "../utils/format";
import {
  AlertIcon,
  CalendarIcon,
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  MapPinIcon,
} from "../components/Icons";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  REVIEWING: "bg-sky-50 text-sky-700 ring-sky-600/20",
  ACCEPTED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

const STATUS_KEYS = ["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"];

const MyApplicationsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { history, historyStatus } = useSelector((state: RootState) => state.applications);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    dispatch(fetchUserApplications());
  }, [dispatch]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: history.length };
    STATUS_KEYS.forEach((key) => {
      map[key] = history.filter((app) => app.status === key).length;
    });
    return map;
  }, [history]);

  const visible = useMemo(
    () =>
      [...history]
        .filter((app) => filter === "ALL" || app.status === filter)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [history, filter],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("apps.title")}</h1>
          <p className="mt-1 text-slate-500">{t("apps.subtitle")}</p>
        </div>
        <Link to="/jobs" className="btn-secondary">
          {t("apps.browseJobs")}
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {["ALL", ...STATUS_KEYS].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`card px-4 py-3 text-left transition ${
              filter === key ? "border-indigo-500 ring-2 ring-indigo-500/20" : "hover:border-slate-300"
            }`}
          >
            <p className="text-xs font-medium text-slate-500">{t(`apps.statuses.${key}`)}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{counts[key] ?? 0}</p>
          </button>
        ))}
      </div>

      {historyStatus === "failed" && (
        <div className="mt-6 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertIcon className="h-5 w-5 shrink-0" />
          {t("errors.serverError")}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {historyStatus === "loading" &&
          history.length === 0 &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-24 animate-pulse bg-slate-100" />
          ))}

        {historyStatus !== "loading" && visible.length === 0 && historyStatus !== "failed" && (
          <div className="card p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <FileTextIcon className="h-7 w-7" />
            </div>
            <p className="mt-4 font-semibold text-slate-900">
              {filter === "ALL" ? t("apps.noApps") : t("apps.noAppsFiltered")}
            </p>
            {filter === "ALL" && (
              <Link to="/jobs" className="btn-primary mt-5">
                {t("apps.browseJobs")}
              </Link>
            )}
          </div>
        )}

        {visible.map((app) => (
          <Link
            key={app.uuid}
            to={app.job?.uuid ? `/jobs/${app.job.uuid}` : "#"}
            className="card group flex items-center gap-4 p-5 transition hover:border-indigo-200 hover:shadow-md"
          >
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white sm:flex">
              {titleInitials(app.job?.title ?? "")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-900 group-hover:text-indigo-600">
                {app.job?.title}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                {app.job?.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPinIcon className="h-3.5 w-3.5" />
                    {app.job.location}
                  </span>
                )}
                {app.job?.type && (
                  <span className="inline-flex items-center gap-1">
                    <ClockIcon className="h-3.5 w-3.5" />
                    {app.job.type}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {t("apps.appliedOn", { date: formatDate(app.createdAt) })}
                </span>
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                STATUS_STYLES[app.status] ?? "bg-slate-100 text-slate-600 ring-slate-500/20"
              }`}
            >
              {t(`apps.statuses.${app.status}`, { defaultValue: app.status })}
            </span>
            <ChevronRightIcon className="hidden h-5 w-5 text-slate-300 group-hover:text-indigo-500 sm:block" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyApplicationsPage;
