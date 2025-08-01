import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
import styles from "./styles/Header.module.css";
import classnames from "classnames";
import { decodeToken } from "../utils/auth";
import logo from '../image/logo.png';

function Header() {
  const [token, setToken] = useState<string | null>(null);
  const [userMail, setUserMail] = useState<string | null>(null);
  const [burgerActive, setBurgerActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setBurgerActive(false);
  }, [location.pathname]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    setToken(savedToken);
  }, []);

  useEffect(() => {
    const decoded = decodeToken();
    if (decoded?.email) {
      setUserMail(decoded.email);
    } else {
      setUserMail(null);
    }
  }, [token]);

  useEffect(() => {
    if (burgerActive) {
      document.body.classList.add(styles["stop-scroll"]);
    } else {
      document.body.classList.remove(styles["stop-scroll"]);
    }
  }, [burgerActive]);

  // useEffect(() => {
  //   if (token) {
  //     try {
  //       const decoded: any = jwtDecode(token);
  //       if (decoded.email) setUserMail(decoded.email);
  //     } catch (err) {
  //       console.error("Ошибка декодирования токена:", err);
  //     }
  //   } else {
  //     setUserMail(null);
  //   }
  // }, [token]);

  function logout() {
    localStorage.removeItem("token");
        localStorage.removeItem("birthdayRemindersClosed");

    setToken(null);
    navigate("/");
  }

  function toggleBurger() {
    setBurgerActive((prev) => !prev);
  }

  function onNavItemClick() {
    setBurgerActive(false);
  }

  return (

    <header className={classnames(styles.header)}>

      <Link to="/" className={styles["logo-link"]}>
        <img className={styles.logo} src={logo} alt="Logo" />
      </Link>

      {token ? (

        <>

          <button
            className={classnames(styles.burger, {
              [styles["burger-active"]]: burgerActive,
            })}
            onClick={toggleBurger}
            aria-label="Открыть меню"
            aria-expanded={burgerActive}
            aria-controls="nav"
          >

            <span className={styles["burger-line"]} />

          </button>

          <div
            className={classnames(styles["header-block"], {
              [styles["header-block-visible"]]: burgerActive,
            })}
          >

            <nav id="nav" className={classnames(styles.nav)}>

              <ul className={styles.list}>

                <li className={styles.item}>

                  <Link
                    to="/wishlist"
                    className={styles.link}
                    onClick={onNavItemClick}
                  >
                    Мои вишлист
                  </Link>

                </li>

                <li className={styles.item}>

                  <Link
                    to="/friends"
                    className={styles.link}
                    onClick={onNavItemClick}
                  >
                    Мои друзья
                  </Link>

                </li>

              </ul>

            </nav>

            <div className={styles["logout-block"]}>

              <span className={styles["text-user-name"]}>{userMail}</span>

              <button className={styles.btn} onClick={logout}>
                Выйти
              </button>

            </div>

          </div>

        </>

      ) : (

        <div>
          
          <Link className={styles.btn} to="/login">
            ВХОД
          </Link>

          <Link className={styles.btn} to="/registration">
            РЕГИСТРАЦИЯ
          </Link>

        </div>

      )}

    </header>

  )

}

export default Header;
