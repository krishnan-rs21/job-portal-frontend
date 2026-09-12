import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMeta } from "./store";
import apiClient from "./services/apiClient";

const MetadataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    apiClient.get("/meta/config").then((res) => {
      dispatch(setMeta(res.data.data));
    });
  }, [dispatch]);

  return <>{children}</>;
};

export default MetadataProvider;
