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

type VisitFilterParams = {
  search?: string;
  status?: "SIGNED_IN" | "SIGNED_OUT";
  from?: string;
  to?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

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
  const [metrics, setMetrics] = useState({
    totalVisitors: 0,
    signedInCount: 0,
    signedOutCount: 0,
    yesterdayCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const normalizeVisitors = useCallback((list: any[]) => {
    return list.map((item: any) => ({
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
  }, []);

  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await VisitService.getAllVisitors();
      const list = Array.isArray(res) ? res : [];
      setVisitors(normalizeVisitors(list));
    } catch (err) {
      console.error("Visitor fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [normalizeVisitors]);

  const fetchMetrics = useCallback(async () => {
    try {
      const [todayMetrics, yesterdayRes] = await Promise.all([
        VisitService.getMetricsData(),
        VisitService.getYesterdayMetrics(),
      ]);

      setMetrics({
        totalVisitors: todayMetrics?.totalVisitors || 0,
        signedInCount: todayMetrics?.signedInCount || 0,
        signedOutCount: todayMetrics?.signedOutCount || 0,
        yesterdayCount:
          typeof yesterdayRes === "number"
            ? yesterdayRes
            : yesterdayRes?.data || 0,
      });
    } catch (err) {
      console.error("Metrics fetch error:", err);
    }
  }, []);

  const filterVisitors = useCallback(
    async (params?: VisitFilterParams) => {
      try {
        setLoading(true);
        const res = await VisitService.filter(params);
        const list = Array.isArray(res) ? res : [];
        setVisitors(normalizeVisitors(list));
      } catch (err) {
        console.error("Filter error:", err);
      } finally {
        setLoading(false);
      }
    },
    [normalizeVisitors],
  );

  useEffect(() => {
    fetchVisitors();
    fetchMetrics();
  }, [fetchVisitors, fetchMetrics]);

  return {
    visitors,
    metrics,
    loading,
    refresh: fetchVisitors,
    filterVisitors,
  };
};
