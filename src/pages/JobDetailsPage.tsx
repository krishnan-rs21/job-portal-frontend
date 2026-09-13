import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState, AppDispatch } from "../store";
import {
  fetchJobDetails,
  applyForJob,
} from "../store/slices/applicationsSlice";

const JobDetailsPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentJob, applyStatus } = useSelector(
    (state: RootState) => state.applications,
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (uuid) dispatch(fetchJobDetails(uuid));
  }, [dispatch, uuid]);

  const handleApply = () => {
    if (!user) {
      navigate(`/login?redirect=/jobs/${uuid}`);
      return;
    }
    if (uuid) dispatch(applyForJob(uuid));
  };

  if (!currentJob) return <p>{t("jobs.loading")}</p>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">{currentJob.title}</h1>
      <p>
        {currentJob.location} | {currentJob.type}
      </p>
      <p className="mt-4">{currentJob.description}</p>

      <button
        className="mt-4 p-2 bg-blue-500 text-white disabled:bg-gray-400"
        disabled={applyStatus === "submitting" || applyStatus === "succeeded"}
        onClick={handleApply}
      >
        {applyStatus === "submitting"
          ? t("jobs.submitting")
          : applyStatus === "succeeded"
            ? t("jobs.applied")
            : t("jobs.applyNow")}
      </button>
      {applyStatus === "failed" && (
        <p className="text-red-500">{t("jobs.applicationFailed")}</p>
      )}
    </div>
  );
};

export default JobDetailsPage;
