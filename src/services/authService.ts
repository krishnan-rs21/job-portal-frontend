import apiClient, { AUTH_BASE_URL } from "./apiClient";

export interface LoginUser {
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const toSessionUser = (user: LoginUser) => ({
  uuid: user.uuid,
  email: user.email,
  role: user.role,
  name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email.split("@")[0],
});

export const loginRequest = async (email: string, password: string) => {
  const response = await apiClient.post(
    "/auth/login",
    { email, password },
    { baseURL: AUTH_BASE_URL },
  );
  const payload = response.data?.data ?? response.data;
  const accessToken: string | undefined = payload?.accessToken;
  const refreshToken: string | undefined = payload?.refreshToken;
  const user: LoginUser | undefined = payload?.user;
  if (!accessToken || !user) {
    throw new Error("Invalid login response");
  }
  return {
    accessToken,
    refreshToken: refreshToken ?? null,
    user: toSessionUser(user),
  };
};

export const registerRequest = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const response = await apiClient.post("/auth/register", data, { baseURL: AUTH_BASE_URL });
  return response.data?.data;
};

export const logoutRequest = async () => {
  try {
    await apiClient.post("/auth/logout", null, { baseURL: AUTH_BASE_URL });
  } catch {
    return;
  }
};
