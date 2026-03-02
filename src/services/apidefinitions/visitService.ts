import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
console.log(baseURL, "This is the baseurl");

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      const message = error.response?.data?.message || "Server Error";
      console.error("API Error intercepted:", message);
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
}
