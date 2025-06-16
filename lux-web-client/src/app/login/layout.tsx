"use client";

import { useAuth } from "@/contexts/auth.context/auth.context";
import LoginTheme from "@/components/loginTheme/loginTheme";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session } = useAuth();

  return <LoginTheme>{children}</LoginTheme>;
}
