import "../style/variables.css";
import "../style/globals.css";

import { Montserrat } from "next/font/google";

import { AuthProvider } from "@/contexts/auth.context";
import { ReactElement } from "react";
import { QueryProvider } from "@/contexts/queryClient";
import { SendEmailProvider } from "../contexts/sendEmail.context";

import type { Metadata } from "next";
import { AnimatePresence } from "framer-motion";
import { NavigationProvider } from "@/contexts/navigation.context";

export const metadata: Metadata = {
  title: "Lux CRM © Geração de Demanda",
};

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
    <html lang="pt-BR">
      <head>
        <title>Lux CRM © Geração de Demanda</title>
        <link
          rel="stylesheet"
          href="https://cdn-uicons.flaticon.com/3.0.0/uicons-regular-rounded/css/uicons-regular-rounded.css"
        ></link>
      </head>
      <body className={`${montserrat.className}`}>
        <QueryProvider>
          <NavigationProvider>
            <AuthProvider>
              <SendEmailProvider>{children}</SendEmailProvider>
            </AuthProvider>
          </NavigationProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
