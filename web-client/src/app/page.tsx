"use client";

import { useAuth } from "@/contexts/auth.context";
import { useLayoutEffect } from "react";
import { useAppRouter } from "@/contexts/navigation.context";

import Loader from "../components/loader/loader";

export default function Home() {
  const { push } = useAppRouter();

  const { session } = useAuth();

  useLayoutEffect(() => {
    if (session.signed) push("/dashboard");

    if (!session.signed) push("/login");
  }, [session.signed, session.empty]);

  return <Loader />;
}
