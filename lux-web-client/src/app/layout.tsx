"use client";

import "../style/variables.css";
import "../style/globals.css";

import { Montserrat } from "next/font/google";

import { AuthProvider } from "@/contexts/auth.context";
import { ReactElement } from "react";
import { QueryProvider } from "@/contexts/queryClient";

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
  return (
    <html lang="en">
      <head>
        <title>Lux CRM © Geração de Demanda</title>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/3.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css"
        ></link>
      </head>
      <body className={`${montserrat.className}`}>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
