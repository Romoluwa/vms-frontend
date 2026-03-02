"use client";

import type { PropsWithChildren } from "react";

export default function AppProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}
