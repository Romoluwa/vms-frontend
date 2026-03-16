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

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ----------------------------------------------------
// REFRESH TOKEN QUEUE
// ----------------------------------------------------

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// ----------------------------------------------------
// RESPONSE INTERCEPTOR (FIXED)
// ----------------------------------------------------

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isAdminRequest =
      typeof originalRequest?.url === "string" &&
      originalRequest.url.includes("/admin");


    const isLoginRequest =
      originalRequest.url.includes("/admin/login") &&
      originalRequest.method === "post";

    if (
      isLoginRequest ||
      !isAdminRequest ||
      (status !== 401 && status !== 403) ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem("admin_user");
      if (typeof window !== "undefined") window.location.href = "/admin";
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
      const response = await axios.post(`${baseURL}/admin/refresh`, {
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
      if (typeof window !== "undefined") window.location.href = "/admin";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

// ----------------------------------------------------
// VISIT SERVICE CLASS
// ----------------------------------------------------

export default class VisitService {
  static async AdminSignIn(data: { email: string; password: string }) {
    try {
      const response = await axios.post(`${baseURL}/admin/login`, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data?.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, response.data.token);

        if (response.data.refreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refreshToken);
        }

        localStorage.setItem("admin_user", JSON.stringify(response.data.admin));
      }

      return response.data;
    } catch (error: any) {
      console.error("ADMIN_SIGNIN_ERROR:", error.response?.data);
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message.toUpperCase());
    }
  }

  static async logout() {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (refreshToken) {
        // Use standard API instance here
        await API.post(`/admin/token/invalidate`, { refreshToken });
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

  // --- FETCH / GET METHODS ---

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

  static async fetchDepartments() {
    try {
      const response = await API.get(`/departments`);
      return response.data;
    } catch (error) {
      console.error("Department fetch error:", error);
    }
  }

  static async searchActiveVisits(visitorName: string) {
    try {
      const response = await API.get(
        `/visits/active?visitorName=${visitorName}`,
      );
      return response.data?.data ?? [];
    } catch (error) {
      console.error("Active visits search error:", error);
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

  static async getVisitById(visitId: string) {
    try {
      const response = await API.get(`/admin/${visitId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch visit details:", error);
      throw error;
    }
  }

  // --- METRICS METHODS ---

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

  // --- VISITOR ACTION METHODS ---

  static async signIn(data: any) {
    try {
      const response = await API.post(`/visits/sign-in`, data);
      return response.data;
    } catch (error) {
      console.error("Visitor sign-in error:", error);
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
}
