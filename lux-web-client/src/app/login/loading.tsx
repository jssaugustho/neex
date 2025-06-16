"use client";

import styles from "./loading.module.css";

export default function DashboardLoading() {
  return (
    <div className={styles.containerLoading}>
      <i className="fi fi-ss-loading"></i>
    </div>
  );
}
