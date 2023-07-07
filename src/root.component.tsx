import React from "react";
import styles from "./root.scss";

const Root: React.FC = () => {
  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>OpenMRS Draw App</h3>
      <p className={styles.content}>
        <span>
          This is a an OpenMRS frontend module for annotating clinical images.
        </span>
      </p>
    </div>
  );
};

export default Root;
