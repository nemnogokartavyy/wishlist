import React from "react";
import styles from "./styles/Spinner.module.css";
const Spinner: React.FC = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
};
export default Spinner;