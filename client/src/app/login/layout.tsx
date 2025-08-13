"use client";

import { AuthRedirect, useAuth } from "@/contexts/auth.context";
import LoginTheme from "@/components/loginTheme/loginTheme";
import TransitionWrapper from "../../components/transitionWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthRedirect>
      <LoginTheme>{children}</LoginTheme>
    </AuthRedirect>
  );
}
