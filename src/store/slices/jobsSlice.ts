import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import apiClient, { getErrorMessage } from "../../services/apiClient";

export interface Job {
  uuid: string;
  title: string;
  description: string;
  location: string;
  type: string;
  experience: string;
  category: string | null;
  categoryUuid: string | null;
  employmentTypeUuid: string | null;
  experienceLevelUuid: string | null;
  salaryRange?: string | null;
  isActive?: boolean;
  createdAt?: string;
}

export interface CategoryCount {
  uuid: string;
  name: string;
  jobCount: number;
}

interface JobsState {
  landing: { featuredJobs: Job[]; categoryCounts: CategoryCount[] };
  landingStatus: "idle" | "loading" | "succeeded" | "failed";
  list: {
    jobs: Job[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: JobsState = {
  landing: { featuredJobs: [], categoryCounts: [] },
  landingStatus: "idle",
  list: { jobs: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } },
  status: "idle",
  error: null,
};

export const fetchLandingData = createAsyncThunk(
  "jobs/fetchLanding",
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/jobs/landing");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch landing data"));
    }
  },
  {
    condition: (_, { getState }) =>
      (getState() as { jobs: JobsState }).jobs.landingStatus !== "loading",
  },
);

export const fetchJobsList = createAsyncThunk(
  "jobs/fetchList",
  async (params: Record<string, string | number | undefined>, { rejectWithValue }) => {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== "" && value !== undefined),
      );
      const response = await apiClient.get("/jobs", { params: cleanParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch jobs"));
    }
  },
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLandingData.pending, (state) => {
        state.landingStatus = "loading";
      })
      .addCase(fetchLandingData.fulfilled, (state, action) => {
        state.landing = {
          featuredJobs: Array.isArray(action.payload?.featuredJobs) ? action.payload.featuredJobs : [],
          categoryCounts: Array.isArray(action.payload?.categoryCounts) ? action.payload.categoryCounts : [],
        };
        state.landingStatus = "succeeded";
      })
      .addCase(fetchLandingData.rejected, (state) => {
        state.landingStatus = "failed";
      })
      .addCase(fetchJobsList.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJobsList.fulfilled, (state, action) => {
        const payload = action.payload;
        const data = payload?.data;
        state.list.jobs = Array.isArray(data) ? data : Array.isArray(data?.jobs) ? data.jobs : [];
        state.list.meta = payload?.meta ?? data?.meta ?? state.list.meta;
        state.status = "succeeded";
      })
      .addCase(fetchJobsList.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || action.error.message || "Failed";
      });
  },
});

export default jobsSlice.reducer;
