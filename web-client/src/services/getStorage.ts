"use client";

import { iSession } from "@/@types/session";

export default function getStorage(): iSession {
  if (!window)
    return {
      theme: null,
      signed: false,
    };

  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const preferredTheme = media.matches ? "dark" : "light";

  let theme = localStorage.getItem("session@theme");
  let definedTheme = (
    theme !== "dark" && theme !== "light" ? preferredTheme : theme
  ) as "dark" | "light";

  let emailVerified = localStorage.getItem("session@mailVerified") === "true";
  let email = localStorage.getItem("session@email");
  let remember = localStorage.getItem("session@remember") === "true";
  let signed = localStorage.getItem("session@signed") === "true";

  if (
    typeof remember === "boolean" &&
    typeof emailVerified === "boolean" &&
    typeof signed === "boolean" &&
    email
  )
    return {
      theme: definedTheme,
      remember,
      signed,
      email,
    };

  return {
    theme: definedTheme,
    signed,
  };
}
