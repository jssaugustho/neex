"use client";

import axios, { AxiosInstance } from "axios";

import FingerprintJS from "@fingerprintjs/fingerprintjs";

let fingerprint: string | null;

const loadFingrerprint = async () => {
  if (fingerprint) return fingerprint;

  const fp = await FingerprintJS.load();

  const result = await fp.get();

  fingerprint = result.visitorId;
  return result.visitorId;
};

export default function initApi(): AxiosInstance {
  const api = axios.create({
    baseURL: process.env.BACK_END_URL || "http://localhost:3000/core",
  });

  api.interceptors.request.use(
    async (config) => {
      const sessionId = sessionStorage.getItem("session@id");

      if (sessionId) config.headers.set("Session", sessionId);

      const locale = navigator.language || "pt-br";
      config.headers.set("Accept-Language", locale);

      const timeZone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo";
      config.headers.set("X-Timezone", timeZone);

      const visitorId = await loadFingrerprint();
      config.headers.set("Fingerprint", visitorId);

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return api;
}
