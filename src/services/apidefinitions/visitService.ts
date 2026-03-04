import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
console.log(baseURL, "This is the baseurl");
const ADMIN_TOKEN_KEY = "adminAccessToken";

const API = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "unknown-url";
    const message = error.response?.data?.message || "Server Error";
    const isMetrics400 = status === 400 && url?.includes("/admin/metrics");

    if (isMetrics400) {
      console.warn(`API Warning [${status}] ${url}:`, message);
    } else {
      console.error(`API Error [${status}] ${url}:`, message);
    }

    return Promise.reject(error);
  },
);
export default class VisitService {
  //get methods
  static async fetchDepartments() {
    try {
      const response = await API.get(`/departments`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  static async searchActiveVisits(visitorName: string) {
    try {
      const response = await API.get(
        `/visits/active?visitorName=${visitorName}`,
      );

      return response.data.data; // return only array
    } catch (error) {
      console.log(error);
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
      const details = error?.response?.data;
      console.error("Metrics request failed:", details || error.message);
      return {};
    }
  }
  static async getAllVisitors(pageNo?: number, pageSize?: number) {
    try {
      const params: Record<string, number> = {};
      if (typeof pageNo === "number" && pageNo > 0) params.pageNo = pageNo;
      if (typeof pageSize === "number" && pageSize > 0)
        params.pageSize = pageSize;

      const response = await API.get(`/admin`, {
        params: Object.keys(params).length ? params : undefined,
      });
      return response.data?.data ?? response.data ?? [];
    } catch (error) {
      console.error("Failed to fetch visitors:", error);
      return [];
    }
  }
  static async searchByVisitorName(query: string) {
    try {
      const response = await API.get("/admin/visits", {
        params: { name: query },
      });
      return response.data;
    } catch (error) {
      // This catches "Server Error" or "Unauthorized"
      console.error("Search API failed:", error);
      return []; // Returns empty array so the app doesn't break
    }
  }
  static async getYesterdayMetrics() {
    try {
      const response = await API.get(`/admin/metrics/yesterday`);
      // Based on common API patterns, it likely returns a number or an object with a count
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch yesterday's metrics:", error.message);
      return 0; // Fallback so the Welcome Card doesn't break
    }
  }
  // Post methods
  static async signIn(data: any) {
    try {
      const response = await API.post(`/visits/sign-in`, data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  static async signOut(visitId: string, data: any) {
    try {
      const response = await API.post(`/visits/${visitId}/sign-out`, data);
      return response.data;
    } catch (error: any) {
      // Extract backend message if available
      const message = error.response?.data?.message || "Sign out failed";
      throw new Error(message); // ✅ critical
    }
  }
  static async AdminSignIn(data: { email: string; password: string }) {
    try {
      const response = await API.post(`/admin/login`, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
    }
  }
  static async logout() {
    try {
      const response = await API.post(`/admin/logout`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Logout failed";
      throw new Error(message);
    }
  }
}
