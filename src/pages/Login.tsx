import styles from "./styles/Login.module.css";
import { useState, useEffect } from "react";
import { login } from "../api/auth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import cn from "classnames";
import Modal from "./components/Modal";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    document.title = "Вход";
  }, []);

  function validateForm() {
    const newErrors: { email?: string; password?: string } = {};
    if (!form.email) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Неверный формат email";
    }
    if (!form.password) {
      newErrors.password = "Пароль обязателен";
    } else if (form.password.length < 3) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      setModalMessage("Вход выполнен");
      setIsSuccess(true);
      setShowModal(true);
    } catch (err: any) {
      setModalMessage("Вход провален");
      setIsSuccess(false);
      setShowModal(true);
    }
  }

  function handleModalClick() {
    setShowModal(false);
    if (isSuccess) {
      navigate(from, { replace: true });
    }
  }

  return (
    <>
      <div className={styles.container}>
        <Modal
          show={showModal}
          onClose={handleModalClick}
          message={modalMessage}
        />

        <div className={styles.block}>
          <Link to="/" className={styles.link}>
            На главную
          </Link>

          <h2 className={styles.title}>Вход</h2>

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              <input
                className={cn(
                  styles.input,
                  errors.email && styles["input-error"]
                )}
                onChange={handleChange}
                name="email"
                type="text"
                required
                placeholder="Почта"
              />
            </label>

            {errors.email && <p className={styles.error}>{errors.email}</p>}

            <label className={styles.label}>
              <input
                className={cn(
                  styles.input,
                  errors.password && styles["input-error"]
                )}
                onChange={handleChange}
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Пароль"
              />

              <span
                className={cn(
                  styles.eye,
                  showPassword ? styles.eyeOpen : styles.eyeClosed
                )}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setShowPassword(!showPassword);
                  }
                }}
              ></span>
            </label>

            {errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}

            <button className={styles.btn} type="submit">
              Войти
            </button>
          </form>

          <Link
            to="/registration"
            className={cn(styles.link, styles["link-reg"])}
          >
            Еще не зарегестрированны?
          </Link>
        </div>
      </div>
    </>
  );
}

export default Login;
