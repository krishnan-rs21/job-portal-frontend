import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { bindAccessTokenGetter } from "../services/apiClient";
import jobsReducer from "./slices/jobsSlice";
import applicationsReducer from "./slices/applicationsSlice";

interface AuthState {
  accessToken: string | null;
  user: { uuid: string; name: string; email: string; role: string } | null;
}

const authSlice = createSlice({
  name: "auth",
  initialState: { accessToken: null, user: null } as AuthState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
});

interface MetaState {
  categories: string[];
  experienceLevels: string[];
  employmentTypes: string[];
}

const metaSlice = createSlice({
  name: "meta",
  initialState: {
    categories: [],
    experienceLevels: [],
    employmentTypes: [],
  } as MetaState,
  reducers: {
    setMeta: (state, action: PayloadAction<MetaState>) => {
      state.categories = action.payload.categories;
      state.experienceLevels = action.payload.experienceLevels;
      state.employmentTypes = action.payload.employmentTypes;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export const { setMeta } = metaSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    meta: metaSlice.reducer,
    jobs: jobsReducer,
    applications: applicationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

bindAccessTokenGetter(() => store.getState().auth.accessToken);
