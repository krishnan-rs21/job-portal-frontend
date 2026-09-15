import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMeta } from "./store";
import type { AppDispatch } from "./store";
import { fetchLandingData } from "./store/slices/jobsSlice";
import apiClient from "./services/apiClient";

const MetadataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    apiClient
      .get("/meta/config")
      .then((res) => {
        dispatch(setMeta(res.data.data));
      })
      .catch(() => undefined);
    dispatch(fetchLandingData());
  }, [dispatch]);

  return <>{children}</>;
};

export default MetadataProvider;
