import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { bindAccessTokenGetter, bindAuthHandlers } from "../services/apiClient";
import jobsReducer from "./slices/jobsSlice";
import applicationsReducer from "./slices/applicationsSlice";

const AUTH_STORAGE_KEY = "job-portal-auth";

interface AuthState {
  accessToken: string | null;
  refreshToken?: string | null;
  user: { uuid: string; name: string; email: string; role: string } | null;
}

const loadAuthState = (): AuthState => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { accessToken: null, refreshToken: null, user: null };
    const parsed = JSON.parse(raw) as AuthState;
    return {
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
      user: parsed.user ?? null,
    };
  } catch {
    return { accessToken: null, refreshToken: null, user: null };
  }
};

const persistAuthState = (state: AuthState) => {
  try {
    if (!state.accessToken || !state.user) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } catch {
    return;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthState(),
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken ?? state.refreshToken ?? null;
      state.user = action.payload.user;
      persistAuthState({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      });
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      persistAuthState({ accessToken: null, refreshToken: null, user: null });
    },
  },
});

export interface LookupOption {
  uuid: string;
  name: string;
}

interface MetaState {
  categories: string[];
  experienceLevels: string[];
  employmentTypes: string[];
  categoryOptions: LookupOption[];
  experienceLevelOptions: LookupOption[];
  employmentTypeOptions: LookupOption[];
}

const asOptions = (value: unknown): LookupOption[] => (Array.isArray(value) ? value : []);

const metaSlice = createSlice({
  name: "meta",
  initialState: {
    categories: [],
    experienceLevels: [],
    employmentTypes: [],
    categoryOptions: [],
    experienceLevelOptions: [],
    employmentTypeOptions: [],
  } as MetaState,
  reducers: {
    setMeta: (state, action: PayloadAction<Partial<MetaState>>) => {
      state.categoryOptions = asOptions(action.payload?.categoryOptions);
      state.experienceLevelOptions = asOptions(action.payload?.experienceLevelOptions);
      state.employmentTypeOptions = asOptions(action.payload?.employmentTypeOptions);
      state.categories = Array.isArray(action.payload?.categories) ? action.payload.categories : [];
      state.experienceLevels = Array.isArray(action.payload?.experienceLevels)
        ? action.payload.experienceLevels
        : [];
      state.employmentTypes = Array.isArray(action.payload?.employmentTypes)
        ? action.payload.employmentTypes
        : [];
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

bindAuthHandlers({
  getRefreshToken: () => store.getState().auth.refreshToken ?? null,
  onTokensRefreshed: ({ accessToken, refreshToken }) => {
    const { user } = store.getState().auth;
    store.dispatch(setAuth({ accessToken, refreshToken, user }));
  },
  onSessionExpired: () => {
    store.dispatch(clearAuth());
    const { pathname, search } = window.location;
    if (pathname !== "/login") {
      window.location.href = `/login?redirect=${encodeURIComponent(pathname + search)}&expired=1`;
    }
  },
});
