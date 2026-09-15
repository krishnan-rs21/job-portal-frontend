import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState, AppDispatch } from "../store";
import {
  fetchJobDetails,
  applyForJob,
  clearApplyStatus,
  fetchUserApplications,
} from "../store/slices/applicationsSlice";
import { formatDate, titleInitials } from "../utils/format";
import {
  AlertIcon,
  ArrowLeftIcon,
  BriefcaseIcon,
  CalendarIcon,
  ChartIcon,
  CheckCircleIcon,
  ClockIcon,
  LayersIcon,
  MapPinIcon,
  WalletIcon,
} from "../components/Icons";

const JobDetailsPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentJob, applyStatus, detailsStatus, history, error } = useSelector(
    (state: RootState) => state.applications,
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(clearApplyStatus());
    if (uuid) dispatch(fetchJobDetails(uuid));
  }, [dispatch, uuid]);

  useEffect(() => {
    if (user) dispatch(fetchUserApplications());
  }, [dispatch, user]);

  const existingApplication = history.find((app) => app.job?.uuid === uuid);
  const alreadyApplied =
    Boolean(existingApplication) ||
    applyStatus === "succeeded" ||
    (applyStatus === "failed" && error === "Already applied");

  const handleApply = async () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/jobs/${uuid}`)}`);
      return;
    }
    if (!uuid) return;
    const result = await dispatch(applyForJob(uuid));
    if (applyForJob.fulfilled.match(result)) {
      dispatch(fetchUserApplications());
    }
  };

  if (detailsStatus === "failed" && !currentJob) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <BriefcaseIcon className="h-7 w-7" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">{t("jobs.notFound")}</h1>
        <p className="mt-2 text-slate-500">{t("jobs.notFoundHint")}</p>
        <Link to="/jobs" className="btn-primary mt-6">
          {t("jobs.backToJobs")}
        </Link>
      </div>
    );
  }

  if (!currentJob || currentJob.uuid !== uuid) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
        <div className="card h-40 animate-pulse bg-slate-100" />
        <div className="card h-72 animate-pulse bg-slate-100" />
      </div>
    );
  }

  const categoryName = currentJob.category;

  const overview = [
    { icon: MapPinIcon, label: t("jobs.location"), value: currentJob.location },
    { icon: ClockIcon, label: t("jobs.type"), value: currentJob.type },
    { icon: ChartIcon, label: t("jobs.experience"), value: currentJob.experience },
    { icon: LayersIcon, label: t("jobs.category"), value: categoryName },
    { icon: WalletIcon, label: t("jobs.salary"), value: currentJob.salaryRange },
    {
      icon: CalendarIcon,
      label: t("jobs.posted"),
      value: currentJob.createdAt ? formatDate(currentJob.createdAt) : undefined,
    },
  ].filter((item) => item.value);

  const applyCard = (
    <div className="card p-6">
      {alreadyApplied ? (
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircleIcon className="h-6 w-6" />
          </div>
          <p className="mt-3 font-semibold text-slate-900">{t("jobs.applied")}</p>
          <p className="mt-1 text-sm text-slate-500">
            {existingApplication
              ? t("jobs.appliedOn", { date: formatDate(existingApplication.createdAt) })
              : t("jobs.appliedHint")}
          </p>
          <Link to="/my-applications" className="btn-secondary mt-4 w-full">
            {t("jobs.viewApplications")}
          </Link>
        </div>
      ) : (
        <>
          <h3 className="font-semibold text-slate-900">{t("jobs.interested")}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {user ? t("jobs.applyHint") : t("jobs.loginToApply")}
          </p>
          <button
            className="btn-primary mt-5 w-full py-3"
            disabled={applyStatus === "submitting"}
            onClick={handleApply}
          >
            {applyStatus === "submitting" && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {applyStatus === "submitting"
              ? t("jobs.submitting")
              : user
                ? t("jobs.applyNow")
                : t("jobs.signInToApply")}
          </button>
          {applyStatus === "failed" && (
            <p className="mt-3 flex items-start gap-1.5 text-sm text-rose-600">
              <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
              {error && error !== "Application failed" ? error : t("jobs.applicationFailed")}
            </p>
          )}
          {!user && (
            <p className="mt-4 text-center text-sm text-slate-500">
              {t("auth.noAccount")}{" "}
              <Link
                to={`/signup?redirect=${encodeURIComponent(`/jobs/${uuid}`)}`}
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {t("nav.signup")}
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/jobs"))}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        {t("jobs.backToJobs")}
      </button>

      <div className="card mt-4 p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xl font-bold text-white">
            {titleInitials(currentJob.title)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{currentJob.title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="chip">
                <MapPinIcon className="h-3.5 w-3.5" />
                {currentJob.location}
              </span>
              <span className="chip">
                <ClockIcon className="h-3.5 w-3.5" />
                {currentJob.type}
              </span>
              <span className="chip">
                <ChartIcon className="h-3.5 w-3.5" />
                {currentJob.experience}
              </span>
              {currentJob.salaryRange && (
                <span className="chip bg-emerald-50 text-emerald-700">
                  <WalletIcon className="h-3.5 w-3.5" />
                  {currentJob.salaryRange}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="lg:hidden">{applyCard}</div>
          <div className="card p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate-900">{t("jobs.description")}</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">
              {currentJob.description}
            </p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="hidden lg:block">{applyCard}</div>
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900">{t("jobs.overview")}</h3>
            <dl className="mt-4 space-y-4">
              {overview.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">{label}</dt>
                    <dd className="text-sm font-medium text-slate-900">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobDetailsPage;
