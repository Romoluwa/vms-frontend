// services/visitService.ts

import { AdminCreateAccountValues } from "@/schemas/visitorSchema";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const ADMIN_TOKEN_KEY = "adminAccessToken";
const REFRESH_TOKEN_KEY = "adminRefreshToken";

const API = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// ----------------------------------------------------
// REQUEST INTERCEPTOR
// ----------------------------------------------------

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------------------------------------------
// REFRESH TOKEN LOGIC (RACE CONDITION SAFE)
// ----------------------------------------------------

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

// ----------------------------------------------------
// RESPONSE INTERCEPTOR
// ----------------------------------------------------

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if ((status !== 401 && status !== 403) || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem("admin_user");
      window.location.href = "/admin/login";
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return API(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const response = await axios.post(`${baseURL}/api/v1/admin/refresh`, {
        refreshToken,
      });

      const newAccessToken = response.data.accessToken;

      localStorage.setItem(ADMIN_TOKEN_KEY, newAccessToken);

      processQueue(null, newAccessToken);

      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

      return API(originalRequest);
    } catch (err) {
      processQueue(err, null);

      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem("admin_user");

      window.location.href = "/admin/login";

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export default class VisitService {
  static async filter(params?: {
    search?: string;
    status?: "SIGNED_IN" | "SIGNED_OUT";
    from?: string;
    to?: string;
    pageNo?: number;
    pageSize?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }) {
    try {
      const response = await API.get(`/admin`, { params });
      return response.data?.data ?? [];
    } catch (error) {
      console.error("Failed to fetch visits:", error);
      return [];
    }
  }

  // ----------------------------------------------------
  // GET METHODS
  // ----------------------------------------------------

  static async fetchDepartments() {
    try {
      const response = await API.get(`/departments`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  static async searchActiveVisits(visitorName: string) {
    try {
      const response = await API.get(
        `/visits/active?visitorName=${visitorName}`,
      );
      return response.data?.data ?? [];
    } catch (error) {
      console.error(error);
    }
  }

  static async getAllVisits(params?: any) {
    try {
      return await this.filter(params);
    } catch (error) {
      console.error("Failed to fetch visits:", error);
      return [];
    }
  }

  static async getAllVisitors(pageNo?: number, pageSize?: number) {
    try {
      return await this.getAllVisits({ pageNo, pageSize });
    } catch (error) {
      console.error("Failed to fetch visitors:", error);
      return [];
    }
  }

  static async searchByVisitorName(query: string) {
    try {
      return await this.getAllVisits({ search: query });
    } catch (error) {
      console.error("Search API failed:", error);
      return [];
    }
  }

  static async getMetricsData() {
    try {
      const today = new Date().toISOString().slice(0, 10);

      const response = await API.get(`/admin/metrics`, {
        params: { date: today },
      });

      return response.data?.data ?? {};
    } catch (error: any) {
      console.error("Metrics request failed:", error?.response?.data);
      return {};
    }
  }

  static async getYesterdayMetrics() {
    try {
      const response = await API.get(`/admin/metrics/yesterday`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch yesterday metrics:", error.message);
      return 0;
    }
  }

  static async getVisitById(visitId: string) {
    try {
      const response = await API.get(`/admin/${visitId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch visit details:", error);
      throw error;
    }
  }

  // ----------------------------------------------------
  // POST METHODS
  // ----------------------------------------------------

  static async signIn(data: any) {
    try {
      const response = await API.post(`/visits/sign-in`, data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  static async signOut(visitId: string, data: any) {
    try {
      const response = await API.post(`/visits/${visitId}/sign-out`, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Sign out failed";
      throw new Error(message);
    }
  }

  // ----------------------------------------------------
  // ADMIN LOGIN
  // ----------------------------------------------------

  static async AdminSignIn(data: { email: string; password: string }) {
    try {
      const response = await API.post(`/admin/login`, data);

      if (response.data?.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, response.data.token);

        if (response.data.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
        }

        localStorage.setItem("admin_user", JSON.stringify(response.data.admin));
      }

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message.toUpperCase());
    }
  }

  // ----------------------------------------------------
  // LOGOUT
  // ----------------------------------------------------

  static async logout() {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (refreshToken) {
        await API.post(`/api/v1/admin/token/invalidate`, { refreshToken });
      }

      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem("admin_user");

      const response = await API.post(`/admin/logout`);

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Logout failed";
      throw new Error(message);
    }
  }

  static async registerAdmin(data: AdminCreateAccountValues) {
    try {
      const response = await API.post("/admin/register", data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "REGISTRATION FAILED";
      throw new Error(message.toUpperCase());
    }
  }
}
