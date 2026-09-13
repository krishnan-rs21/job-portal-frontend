import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../services/apiClient";

interface Application {
  uuid: string;
  status: string;
  createdAt: string;
  job: { title: string; uuid: string };
}

interface ApplicationsState {
  currentJob: any | null;
  history: Application[];
  applyStatus: "idle" | "submitting" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ApplicationsState = {
  currentJob: null,
  history: [],
  applyStatus: "idle",
  error: null,
};

export const fetchJobDetails = createAsyncThunk(
  "applications/fetchJob",
  async (uuid: string) => {
    const response = await apiClient.get(`/jobs/${uuid}`);
    return response.data.data;
  },
);

export const applyForJob = createAsyncThunk(
  "applications/apply",
  async (uuid: string) => {
    const response = await apiClient.post(`/jobs/${uuid}/apply`);
    return response.data.data;
  },
);

export const fetchUserApplications = createAsyncThunk(
  "applications/fetchHistory",
  async () => {
    const response = await apiClient.get("/users/me/applications");
    return response.data.data;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobDetails.fulfilled, (state, action) => {
        state.currentJob = action.payload;
      })
      .addCase(applyForJob.pending, (state) => {
        state.applyStatus = "submitting";
      })
      .addCase(applyForJob.fulfilled, (state) => {
        state.applyStatus = "succeeded";
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.applyStatus = "failed";
        state.error = action.error.message || "Submission failed";
      })
      .addCase(fetchUserApplications.fulfilled, (state, action) => {
        state.history = action.payload;
      });
  },
});

export const { clearApplyStatus } = applicationsSlice.actions;
export default applicationsSlice.reducer;
