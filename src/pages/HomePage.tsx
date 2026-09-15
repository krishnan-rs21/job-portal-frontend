import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchLandingData } from "../store/slices/jobsSlice";
import type { RootState, AppDispatch } from "../store";
import { Link, useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import { useCategoryOptions } from "../hooks/useCategoryOptions";
import {
  BriefcaseIcon,
  ChevronRightIcon,
  LayersIcon,
  MapPinIcon,
  SearchIcon,
  SparklesIcon,
  UserIcon,
} from "../components/Icons";

const CATEGORY_TONES = [
  "bg-indigo-50 text-indigo-600",
  "bg-emerald-50 text-emerald-600",
  "bg-amber-50 text-amber-600",
  "bg-rose-50 text-rose-600",
  "bg-sky-50 text-sky-600",
  "bg-violet-50 text-violet-600",
];

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { landing, landingStatus } = useSelector((state: RootState) => state.jobs);
  const { user } = useSelector((state: RootState) => state.auth);
  const categories = useCategoryOptions();
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchLandingData());
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    navigate(query ? `/jobs?search=${encodeURIComponent(query)}` : "/jobs");
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-indigo-200">
              <SparklesIcon className="h-3.5 w-3.5" />
              {t("home.badge")}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("home.heroTitle")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">{t("home.heroSubtitle")}</p>

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-10 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-indigo-900/30 sm:flex-row"
            >
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("home.searchPlaceholder")}
                  className="w-full rounded-xl border-0 bg-transparent py-3 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <button type="submit" className="btn-primary rounded-xl px-6 py-3">
                {t("home.search")}
              </button>
            </form>

            <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <BriefcaseIcon className="h-4 w-4 text-indigo-300" />
                {t("home.statJobs")}
              </span>
              <span className="flex items-center gap-2">
                <LayersIcon className="h-4 w-4 text-indigo-300" />
                {t("home.statCategories", { count: categories.length })}
              </span>
              <span className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-indigo-300" />
                {t("home.statRemote")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t("home.browseCategories")}</h2>
            <p className="mt-1 text-slate-500">{t("home.browseCategoriesSubtitle")}</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.length === 0 &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-24 animate-pulse bg-slate-100" />
            ))}
          {categories.map((cat, index) => (
            <Link
              to={`/jobs?category=${encodeURIComponent(cat.name)}`}
              key={cat.uuid}
              className="card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  CATEGORY_TONES[index % CATEGORY_TONES.length]
                }`}
              >
                <LayersIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900 group-hover:text-indigo-600">
                  {cat.name}
                </p>
                <p className="text-sm text-slate-500">
                  {t("home.openPositions", { count: cat.count })}
                </p>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{t("home.featuredJobs")}</h2>
              <p className="mt-1 text-slate-500">{t("home.featuredJobsSubtitle")}</p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              {t("home.viewAllJobs")}
              <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {landingStatus === "loading" &&
              landing.featuredJobs.length === 0 &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card h-36 animate-pulse bg-slate-100" />
              ))}
            {landingStatus !== "loading" && landing.featuredJobs.length === 0 && (
              <div className="card col-span-full p-10 text-center text-slate-500">
                {landingStatus === "failed" ? t("errors.serverError") : t("jobs.noJobs")}
                {landingStatus === "failed" && (
                  <div className="mt-4">
                    <button onClick={() => dispatch(fetchLandingData())} className="btn-secondary">
                      {t("errors.retry")}
                    </button>
                  </div>
                )}
              </div>
            )}
            {landing.featuredJobs.map((job) => (
              <JobCard key={job.uuid} job={job} />
            ))}
          </div>
        </div>
      </section>

      {!user && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-12 text-center sm:px-12">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-white/10" />
            <div className="relative">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white">
                <UserIcon />
              </div>
              <h2 className="mt-4 text-3xl font-bold text-white">{t("home.ctaTitle")}</h2>
              <p className="mx-auto mt-3 max-w-xl text-indigo-100">{t("home.ctaSubtitle")}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/signup" className="btn bg-white px-6 py-3 text-indigo-700 hover:bg-indigo-50">
                  {t("nav.signup")}
                </Link>
                <Link
                  to="/login"
                  className="btn border border-white/30 px-6 py-3 text-white hover:bg-white/10"
                >
                  {t("nav.login")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
