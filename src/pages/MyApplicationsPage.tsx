import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState, AppDispatch } from "../store";
import { fetchUserApplications } from "../store/slices/applicationsSlice";
import { Link } from "react-router-dom";

const MyApplicationsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { history } = useSelector((state: RootState) => state.applications);

  useEffect(() => {
    dispatch(fetchUserApplications());
  }, [dispatch]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{t("apps.title")}</h1>
      {history.length === 0 ? (
        <div className="mt-4">
          <p>{t("apps.noApps")}</p>
          <Link to="/jobs" className="text-blue-500">
            {t("apps.browseJobs")}
          </Link>
        </div>
      ) : (
        <table className="mt-4 w-full border">
          <thead>
            <tr>
              <th>{t("apps.jobTitle")}</th>
              <th>{t("apps.status")}</th>
              <th>{t("apps.date")}</th>
            </tr>
          </thead>
          <tbody>
            {history.map((app) => (
              <tr key={app.uuid}>
                <td>{app.job.title}</td>
                <td>{app.status}</td>
                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyApplicationsPage;
