"use client";

import React from "react";
import { OtherProvider } from "./other.context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OtherProvider>{children}</OtherProvider>;
}
