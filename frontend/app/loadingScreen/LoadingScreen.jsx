import * as React from "react";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  return (
    <div className={styles.loadingContainer}>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/50719b16836d2347bb81bab854531367b7bc4d05e8f90499f86c4c24d0db4fb2?placeholderIfAbsent=true&apiKey=89ea648570324a1aa1020e20f2ec4be4"
        className={styles.loadingSpinner}
        alt="Loading indicator"
      />
    </div>
  );
}
