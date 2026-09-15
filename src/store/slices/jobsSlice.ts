import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import apiClient from "../../services/apiClient";

interface Job {
  uuid: string;
  title: string;
  description: string;
  location: string;
  type: string;
  experience: string;
  categoryId: number;
}

interface JobsState {
  landing: { featuredJobs: Job[]; categoryCounts: any[] };
  list: {
    jobs: Job[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: JobsState = {
  landing: { featuredJobs: [], categoryCounts: [] },
  list: { jobs: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } },
  status: "idle",
  error: null,
};

export const fetchLandingData = createAsyncThunk(
  "jobs/fetchLanding",
  async () => {
    const response = await apiClient.get("/jobs/landing");
    return response.data.data;
  },
);

export const fetchJobsList = createAsyncThunk(
  "jobs/fetchList",
  async (params: any) => {
    const response = await apiClient.get("/jobs", { params });
    return response.data;
  },
);

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLandingData.fulfilled, (state, action) => {
        state.landing = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchJobsList.fulfilled, (state, action) => {
        state.list.jobs = action.payload.data;
        state.list.meta = action.payload.meta;
        state.status = "succeeded";
      })
      .addMatcher(isPending(fetchLandingData, fetchJobsList), (state) => {
        state.status = "loading";
      })
      .addMatcher(isRejected(fetchLandingData, fetchJobsList), (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed";
      });
  },
});

export default jobsSlice.reducer;
