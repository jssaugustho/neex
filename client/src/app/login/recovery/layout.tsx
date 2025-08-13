"use client";

import TransitionWrapper from "@/components/transitionWrapper";
import { RecoveryProvider } from "@/contexts/recovery.context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TransitionWrapper motionKey="recovery">
      <RecoveryProvider>{children}</RecoveryProvider>
    </TransitionWrapper>
  );
}
