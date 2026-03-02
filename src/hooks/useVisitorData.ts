"use client";

import { useState } from "react";

export interface Visitor {
  id: string;
  name: string;
  entryTime: string;
  whoToSee: string;
  purpose: string;
  status: "signed_in" | "signed_out";
  exitTime?: string;
  laptopModel?: string;
  laptopSerialNumber?: string;
  signature?: string;
  department?: string;
}

const MOCK_DATA: Visitor[] = [
  {
    id: "1",
    name: "Jane Doe",
    entryTime: "10:00 am",
    whoToSee: "Mr. Adams",
    department: "Products and applications",
    purpose: "General Inquiry",
    status: "signed_in",
  },
  {
    id: "2",
    name: "John Smith",
    entryTime: "11:00 am",
    whoToSee: "Ms. Johnson",
    department: "Products and applications",
    purpose: "Delivery",
    status: "signed_out",
    exitTime: "1:00 pm",
  },
  {
    id: "3",
    name: "Emily Davis",
    entryTime: "11:30 am",
    whoToSee: "Dr. Brown",
    department: "Products and applications",
    purpose: "Maintenance",
    status: "signed_in",
  },
];

export const useVisitorData = () => {
  const [data] = useState<Visitor[]>(MOCK_DATA);

  // Directly calculate stats for your DataCards
  const checkedInCount = data.filter((v) => v.status === "signed_in").length;
  const checkedOutCount = data.filter((v) => v.status === "signed_out").length;
  const totalCount = data.length;

  return {
    visitors: data,
    stats: {
      checkedInCount,
      checkedOutCount,
      totalCount,
    },
    loading: false,
  };
};
