import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobsList } from "../store/slices/jobsSlice";
import type { RootState, AppDispatch } from "../store";
import { useSearchParams } from "react-router-dom";
import JobCard from "../components/JobCard";
import { useCategoryOptions } from "../hooks/useCategoryOptions";
import {
  AlertIcon,
  BriefcaseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "../components/Icons";

const JobsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { list, status, error } = useSelector((state: RootState) => state.jobs);
  const { experienceLevels, experienceLevelOptions } = useSelector(
    (state: RootState) => state.meta,
  );
  const categories = useCategoryOptions();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const experience = searchParams.get("experience") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const [searchInput, setSearchInput] = useState(search);
  const [lastSearch, setLastSearch] = useState(search);

  if (search !== lastSearch) {
    setLastSearch(search);
    setSearchInput(search);
  }

  const categoryUuid = categories.find((c) => c.name === category)?.uuid;
  const categoryResolved = !category || categoryUuid !== undefined;
  const experienceLevelUuid = experienceLevelOptions.find((e) => e.name === experience)?.uuid;
  const experienceResolved = !experience || experienceLevelUuid !== undefined;

  useEffect(() => {
    if (!categoryResolved || !experienceResolved) return;
    dispatch(fetchJobsList({ search, categoryUuid, experienceLevelUuid, page }));
  }, [dispatch, search, categoryUuid, categoryResolved, experienceLevelUuid, experienceResolved, page]);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      if (!("page" in updates)) next.delete("page");
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    if (searchInput.trim() === search) return;
    const timer = setTimeout(() => updateParams({ search: searchInput.trim() }), 400);
    return () => clearTimeout(timer);
  }, [searchInput, search, updateParams]);

  const goToPage = (nextPage: number) => {
    updateParams({ page: String(nextPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasFilters = Boolean(search || category || experience);
  const totalPages = list.meta.totalPages || 1;

  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-slate-900">{t("jobs.title")}</h1>
          <p className="mt-2 text-slate-500">{t("jobs.subtitle")}</p>
          <div className="relative mt-6 max-w-2xl">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t("jobs.searchPlaceholder")}
              className="input py-3 pl-11 text-base"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
        <aside className="lg:col-span-1">
          <div className="card space-y-6 p-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">{t("jobs.filters")}</h2>
              {hasFilters && (
                <button
                  onClick={() => setSearchParams({})}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {t("jobs.reset")}
                </button>
              )}
            </div>

            <div>
              <p className="label">{t("jobs.category")}</p>
              <div className="space-y-1">
                <button
                  onClick={() => updateParams({ category: "" })}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    !category ? "bg-indigo-50 font-medium text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t("jobs.allCategories")}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.uuid}
                    onClick={() => updateParams({ category: c.name })}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                      category === c.name
                        ? "bg-indigo-50 font-medium text-indigo-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="truncate">{c.name}</span>
                    {c.count > 0 && <span className="text-xs text-slate-400">{c.count}</span>}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="experience" className="label">
                {t("jobs.experience")}
              </label>
              <select
                id="experience"
                value={experience}
                onChange={(e) => updateParams({ experience: e.target.value })}
                className="input"
              >
                <option value="">{t("jobs.allExperience")}</option>
                {experienceLevels.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              {status === "succeeded" && t("jobs.resultsCount", { count: list.meta.total })}
            </p>
          </div>

          {status === "failed" && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <AlertIcon className="h-5 w-5 shrink-0" />
              {error || t("errors.serverError")}
            </div>
          )}

          <div className="space-y-4">
            {status === "loading" &&
              list.jobs.length === 0 &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card h-36 animate-pulse bg-slate-100" />
              ))}

            {list.jobs.length === 0 && status === "succeeded" && (
              <div className="card p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <BriefcaseIcon className="h-7 w-7" />
                </div>
                <p className="mt-4 font-semibold text-slate-900">{t("jobs.noJobs")}</p>
                <p className="mt-1 text-sm text-slate-500">{t("jobs.noJobsHint")}</p>
                {hasFilters && (
                  <button onClick={() => setSearchParams({})} className="btn-secondary mt-5">
                    {t("jobs.reset")}
                  </button>
                )}
              </div>
            )}

            <div className={`space-y-4 transition ${status === "loading" ? "opacity-60" : ""}`}>
              {list.jobs.map((job) => (
                <JobCard key={job.uuid} job={job} />
              ))}
            </div>
          </div>

          {list.meta.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                className="btn-secondary"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
              >
                <ChevronLeftIcon className="h-4 w-4" />
                {t("jobs.prev")}
              </button>
              <span className="text-sm text-slate-600">
                {t("jobs.pageOf", { page, totalPages })}
              </span>
              <button
                className="btn-secondary"
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
              >
                {t("jobs.next")}
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default JobsPage;
