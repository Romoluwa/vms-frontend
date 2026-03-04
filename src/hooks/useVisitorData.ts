"use client";

import { useState, useCallback, useEffect } from "react";
import VisitService from "@/services/apidefinitions/visitService";

export interface Visitor {
  id: string;
  name: string;
  entryTime: string;
  whoToSee: string;
  purpose: string;
  status: string;
  exitTime: string;
}

// 1. MOVE THIS TO THE TOP to fix the "Cannot find name" error
export const formatDateTime = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";
  const dPart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const tPart = date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
  return `${dPart} • ${tPart}`;
};

export const useVisitorData = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  // Added yesterdayCount to state for your Welcome Card
  const [metrics, setMetrics] = useState({
    totalVisitors: 0,
    signedInCount: 0,
    signedOutCount: 0,
    yesterdayCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (query?: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      // Fetch List
      const res = query?.trim()
        ? await VisitService.searchByVisitorName(query)
        : await VisitService.getAllVisitors();
      const list = Array.isArray(res) ? res : res?.data || [];

      const normalized = list.map((item: any) => ({
        id: item.id,
        name:
          item.visitor?.fullName ||
          item.fullName ||
          item.visitorName ||
          item.name ||
          "Unknown Visitor",
        entryTime: formatDateTime(
          item.signInTime || item.entryTime || item.createdAt,
        ),
        whoToSee: item.hostName || item.whoToSee || "—",
        purpose: item.purpose || "—",
        status: item.status || "SIGNED_IN",
        exitTime: formatDateTime(item.signOutTime || item.exitTime),
      }));
      setVisitors(normalized);

      // 2. Fetch both Metrics endpoints in parallel
      const [todayMetrics, yesterdayRes] = await Promise.all([
        VisitService.getMetricsData(),
        VisitService.getYesterdayMetrics(),
      ]);

      setMetrics({
        totalVisitors: todayMetrics?.totalVisitors || 0,
        signedInCount: todayMetrics?.signedInCount || 0,
        signedOutCount: todayMetrics?.signedOutCount || 0,
        // Pulling count from your new endpoint
        yesterdayCount:
          typeof yesterdayRes === "number"
            ? yesterdayRes
            : yesterdayRes?.data || 0,
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    visitors,
    metrics,
    loading,
    refresh: fetchData,
    handleSearch: (q: string) => fetchData(q),
  };
};
