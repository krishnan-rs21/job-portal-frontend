import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { Job } from "../store/slices/jobsSlice";
import { ChartIcon, ClockIcon, MapPinIcon, WalletIcon } from "./Icons";
import { titleInitials, timeAgo } from "../utils/format";

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const { t } = useTranslation();
  const categoryName = job.category;

  return (
    <Link
      to={`/jobs/${job.uuid}`}
      className="card group flex flex-col gap-4 p-5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:flex-row sm:items-start"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
        {titleInitials(job.title)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-indigo-600">
              {job.title}
            </h3>
            {categoryName && <p className="mt-0.5 text-sm text-slate-500">{categoryName}</p>}
          </div>
          {job.createdAt && (
            <span className="shrink-0 text-xs text-slate-400">{timeAgo(job.createdAt, t)}</span>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="chip">
            <MapPinIcon className="h-3.5 w-3.5" />
            {job.location}
          </span>
          <span className="chip">
            <ClockIcon className="h-3.5 w-3.5" />
            {job.type}
          </span>
          <span className="chip">
            <ChartIcon className="h-3.5 w-3.5" />
            {job.experience}
          </span>
          {job.salaryRange && (
            <span className="chip bg-emerald-50 text-emerald-700">
              <WalletIcon className="h-3.5 w-3.5" />
              {job.salaryRange}
            </span>
          )}
        </div>
        {job.description && (
          <p className="mt-3 line-clamp-2 text-sm text-slate-600">{job.description}</p>
        )}
      </div>
    </Link>
  );
};

export default JobCard;
