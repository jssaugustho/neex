"use client";

import { Montserrat } from "next/font/google";
import { ReactElement, useLayoutEffect } from "react";

import LoginTheme from "../../components/loginTheme/loginTheme";
import { AuthGuard } from "@/contexts/auth.context";
import { useAppRouter } from "@/contexts/navigation.context";
import { useUser } from "@/hooks/useUser";

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Lux CRM © Geração de Demanda",
// };

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactElement;
}>) {
  const { push } = useAppRouter();

  return (
    <AuthGuard checkEmailVerification={false}>
      <LoginTheme>{children}</LoginTheme>
    </AuthGuard>
  );
}
