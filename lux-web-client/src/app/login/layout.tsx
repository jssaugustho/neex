"use client";

import { useAuth } from "@/contexts/auth.context";
import LoginTheme from "@/app/login/components/loginTheme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LoginTheme>{children}</LoginTheme>;
}
