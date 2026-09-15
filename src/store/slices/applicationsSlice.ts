import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient, { getErrorMessage } from "../../services/apiClient";
import type { Job } from "./jobsSlice";

interface Application {
  uuid: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  job: Job;
}

interface ApplicationsState {
  currentJob: Job | null;
  detailsStatus: "idle" | "loading" | "succeeded" | "failed";
  history: Application[];
  historyStatus: "idle" | "loading" | "succeeded" | "failed";
  applyStatus: "idle" | "submitting" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ApplicationsState = {
  currentJob: null,
  detailsStatus: "idle",
  history: [],
  historyStatus: "idle",
  applyStatus: "idle",
  error: null,
};

export const fetchJobDetails = createAsyncThunk(
  "applications/fetchJob",
  async (uuid: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/jobs/${uuid}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch job"));
    }
  },
);

export const applyForJob = createAsyncThunk(
  "applications/apply",
  async (uuid: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/jobs/${uuid}/apply`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Application failed"));
    }
  },
);

export const fetchUserApplications = createAsyncThunk(
  "applications/fetchHistory",
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/users/me/applications");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch applications"));
    }
  },
);

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    clearApplyStatus: (state) => {
      state.applyStatus = "idle";
      state.error = null;
    },
    resetApplications: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobDetails.pending, (state, action) => {
        if (state.currentJob?.uuid !== action.meta.arg) {
          state.currentJob = null;
        }
        state.detailsStatus = "loading";
      })
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.currentJob = action.payload;
        state.detailsStatus = "succeeded";
      })
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.currentJob = null;
        state.detailsStatus = "failed";
        state.error = (action.payload as string) || "Failed";
      })
      .addCase(applyForJob.pending, (state) => {
        state.applyStatus = "submitting";
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state) => {
        state.applyStatus = "succeeded";
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.applyStatus = "failed";
        state.error = (action.payload as string) || action.error.message || "Submission failed";
      })
      .addCase(fetchUserApplications.pending, (state) => {
        state.historyStatus = "loading";
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.history = Array.isArray(action.payload) ? action.payload : [];
        state.historyStatus = "succeeded";
      })
      .addCase(fetchUserApplications.rejected, (state) => {
        state.historyStatus = "failed";
      });
  },
});

export const { clearApplyStatus, resetApplications } = applicationsSlice.actions;
export default applicationsSlice.reducer;
