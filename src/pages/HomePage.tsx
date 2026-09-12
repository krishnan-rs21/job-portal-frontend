import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchLandingData } from "../store/slices/jobsSlice";
import { RootState, AppDispatch } from "../store";
import { Link, useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { landing } = useSelector((state: RootState) => state.jobs);
  const { categories } = useSelector((state: RootState) => state.meta);

  useEffect(() => {
    dispatch(fetchLandingData());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-4xl font-bold">{t("home.heroTitle")}</h1>
      <input
        type="text"
        placeholder={t("home.searchPlaceholder")}
        onKeyDown={(e) => {
          if (e.key === "Enter")
            navigate(`/jobs?search=${e.currentTarget.value}`);
        }}
      />

      <div className="grid grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link to={`/jobs?category=${cat}`} key={cat}>
            {cat}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {landing.featuredJobs.map((job) => (
          <div key={job.uuid} className="border p-4">
            <h3>{job.title}</h3>
            <p>
              {job.type} - {job.location}
            </p>
            <Link to={`/jobs/${job.uuid}`}>{t("home.viewDetails")}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
