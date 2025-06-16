"use client";

import axios, { AxiosInstance } from "axios";

export default function initApi(): AxiosInstance {
  const api = axios.create({
    baseURL: process.env.BACK_END_URL,
  });

  return api;
}
