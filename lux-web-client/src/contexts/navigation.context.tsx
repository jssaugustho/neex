"use client";

import { TopLoading } from "@/components/topLoading";
import { AxiosError } from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  SetStateAction,
  TransitionStartFunction,
  useContext,
  useState,
  useTransition,
} from "react";

type NavigationContextType = {
  router: AppRouterInstance;
  isPending: boolean;
  push: (url: string) => void;
  startTransition: TransitionStartFunction;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const safePush = (url: string) => {
    startTransition(() => {
      router.push(url);
    });
  };

  return (
    <NavigationContext.Provider
      value={{
        router,
        isPending,
        push: safePush,
        startTransition,
      }}
    >
      <TopLoading loading={isPending} />
      {children}
    </NavigationContext.Provider>
  );
};

export const useAppRouter = () =>
  useContext(NavigationContext) as NavigationContextType;
