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

  let theme = sessionStorage.getItem("session@theme");
  let definedTheme = (
    theme !== "dark" && theme !== "light" ? preferredTheme : theme
  ) as "dark" | "light";

  let sessionId = sessionStorage.getItem("session@id");

  let userName = sessionStorage.getItem("user@name");
  let userLastName = sessionStorage.getItem("user@lastName");
  let userEmail = sessionStorage.getItem("user@email");
  let userId = sessionStorage.getItem("user@id");
  let userEmailVerified = Boolean(sessionStorage.getItem("user@emailVerified"));
  let userPhone = sessionStorage.getItem("user@phone");

  if (
    definedTheme &&
    sessionId &&
    userName &&
    userLastName &&
    userEmail &&
    userId &&
    userPhone &&
    typeof userEmailVerified === "boolean"
  )
    return {
      theme: definedTheme,
      sessionId,
      userName,
      userLastName,
      userEmail,
      userId,
      userPhone,
      signed: true,
    };

  return {
    theme: definedTheme,
    signed: false,
  };
}
