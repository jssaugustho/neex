"use client";

import TransitionWrapper from "@/components/transitionWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TransitionWrapper motionKey="verify-session">{children}</TransitionWrapper>
  );
}
