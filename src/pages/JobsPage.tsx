import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobsList } from "../store/slices/jobsSlice";
import { RootState, AppDispatch } from "../store";
import { useSearchParams, Link } from "react-router-dom";

const JobsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { list, status } = useSelector((state: RootState) => state.jobs);
  const { categories, experienceLevels } = useSelector(
    (state: RootState) => state.meta,
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const experience = searchParams.get("experience") || "";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    dispatch(fetchJobsList({ search, categoryId: category, experience, page }));
  }, [dispatch, search, category, experience, page]);

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) =>
          setSearchParams({
            ...Object.fromEntries(searchParams),
            search: e.target.value,
          })
        }
        placeholder={t("jobs.searchPlaceholder")}
      />
      <select
        value={category}
        onChange={(e) =>
          setSearchParams({
            ...Object.fromEntries(searchParams),
            category: e.target.value,
          })
        }
      >
        <option value="">{t("jobs.allCategories")}</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select
        value={experience}
        onChange={(e) =>
          setSearchParams({
            ...Object.fromEntries(searchParams),
            experience: e.target.value,
          })
        }
      >
        <option value="">{t("jobs.allExperience")}</option>
        {experienceLevels.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
      <button onClick={() => setSearchParams({})}>{t("jobs.reset")}</button>

      {status === "loading" && <p>{t("jobs.loading")}</p>}
      {list.jobs.length === 0 && status === "succeeded" && (
        <p>{t("jobs.noJobs")}</p>
      )}

      <div className="grid grid-cols-1 gap-4">
        {list.jobs.map((job) => (
          <div key={job.uuid} className="border p-4">
            <h3>{job.title}</h3>
            <Link to={`/jobs/${job.uuid}`}>{t("jobs.viewDetails")}</Link>
          </div>
        ))}
      </div>

      {list.meta.totalPages > 1 && (
        <div>
          <button
            disabled={page === 1}
            onClick={() =>
              setSearchParams({
                ...Object.fromEntries(searchParams),
                page: (page - 1).toString(),
              })
            }
          >
            {t("jobs.prev")}
          </button>
          <span>
            {page} / {list.meta.totalPages}
          </span>
          <button
            disabled={page === list.meta.totalPages}
            onClick={() =>
              setSearchParams({
                ...Object.fromEntries(searchParams),
                page: (page + 1).toString(),
              })
            }
          >
            {t("jobs.next")}
          </button>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
