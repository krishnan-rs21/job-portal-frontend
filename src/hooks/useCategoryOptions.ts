import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export interface CategoryOption {
  uuid: string;
  name: string;
  count: number;
}

export const useCategoryOptions = (): CategoryOption[] => {
  const { categoryOptions } = useSelector((state: RootState) => state.meta);
  const { categoryCounts } = useSelector((state: RootState) => state.jobs.landing);

  return useMemo(() => {
    const countFor = (uuid: string) => categoryCounts.find((c) => c.uuid === uuid)?.jobCount ?? 0;
    const source = categoryOptions.length > 0 ? categoryOptions : categoryCounts;
    return source.map((c) => ({ uuid: c.uuid, name: c.name, count: countFor(c.uuid) }));
  }, [categoryOptions, categoryCounts]);
};
