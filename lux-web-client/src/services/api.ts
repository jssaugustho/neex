"use client";

import axios, {
  Axios,
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useRouter } from "next/navigation";

let fingerprint: string | null;

const loadFingrerprint = async () => {
  if (fingerprint) return fingerprint;

  const fp = await FingerprintJS.load();

  const result = await fp.get();

  fingerprint = result.visitorId;
  return result.visitorId;
};

export default function initApi(endSession: () => void): AxiosInstance {
  const api = axios.create({
    baseURL: process.env.BACK_END_URL || "http://localhost:3000/core",
    withCredentials: true,
  });

  api.interceptors.request.use(
    async (config) => {
      const locale = navigator.language || "pt-br";
      config.headers.set("Accept-Language", locale);

      const timeZone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo";
      config.headers.set("X-Timezone", timeZone);

      const visitorId = await loadFingrerprint();
      config.headers.set("Fingerprint", visitorId);

      config.headers.set("Content-Type", "application/json");

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  type FailedRequest = {
    resolve: (value: AxiosResponse) => void;
    reject: (error: AxiosError) => void;
    originalRequest: AxiosRequestConfig & {
      _retry: boolean;
    };
  };

  let failedQueue: FailedRequest[] = [];
  let isRefreshing = false;

  async function processQueue(error: AxiosError | null) {
    for (const { resolve, reject, originalRequest } of failedQueue) {
      if (error) {
        reject(error);
      } else {
        api(originalRequest)
          .then((response) => {
            resolve(response);
          })
          .catch((e) => {
            reject(e);
          });
      }
    }

    failedQueue = [];
  }

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      console.log(error);

      const originalRequest = error.config as AxiosRequestConfig & {
        _retry: boolean;
      };

      if ((error.response?.data as any)?.status === "TokenError") {
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          if (isRefreshing) {
            return new Promise<AxiosResponse>((resolve, reject) => {
              failedQueue.push({
                originalRequest,
                resolve,
                reject,
              });
            });
          }

          isRefreshing = true;
          console.log("Refreshing token...");

          return new Promise<AxiosResponse>(async (resolve, reject) => {
            api
              .post(
                "/refresh",
                {
                  remember: localStorage.getItem("session@remember") === "true",
                },
                {
                  withCredentials: true,
                },
              )
              .then(async (response) => {
                if (response.data?.status === "Ok") {
                  processQueue(null);

                  resolve(await api(originalRequest));
                  console.log("Refresh token success.");
                } else {
                  reject(new AxiosError("Refresh Token Error."));
                }
              })
              .catch(async (err: AxiosError) => {
                console.log("Refresh token failed.");
                processQueue(err as AxiosError);

                if (err?.code !== "ERR_NETWORK") {
                  endSession();
                }

                reject(err);
              })
              .finally(() => {
                isRefreshing = false;
              });
          });
        }
      }

      return Promise.reject(error);
    },
  );

  return api;
}
