import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import BirthdayReminders from "./components/BirthdayReminders";

import styles from "./styles/Root.module.css";

function Root() {
  const isAuth = localStorage.getItem("token");

  return (
    <>
      <Header />
      {isAuth ? (
        <main className={styles.main}>
          <BirthdayReminders />
          <Outlet />
        </main>
      ) : (
        <main className={styles.main}>
          <Outlet />
        </main>
      )}
      <Footer />
    </>
  );
}

export default Root;
