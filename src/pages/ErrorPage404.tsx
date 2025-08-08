import { useRouteError, isRouteErrorResponse } from "react-router-dom";

import styles from "./styles/ErrorPage404.module.css";

function ErrorPage404() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className={styles.block}>
        <h1 className={styles.title}>
          {error.status} {error.statusText}
        </h1>
        <p className={styles.text}>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className={styles.block}>
        <h1 className={styles.title}>{error.message}</h1>
      </div>
    );
  } else {
    return (
      <div className={styles.block}>
        <h1 className={styles.title}>Unknown error</h1>
      </div>
    );
  }
}

export default ErrorPage404;
