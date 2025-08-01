import styles from "./styles/Registration.module.css";
import { register } from "../api/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cn from "classnames";

function Registration() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    birth_date: "",
    password: "",
    repeatPassword: "",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    full_name?: string;
    birth_date?: string;
    password?: string;
    repeatPassword?: string;
  }>({});

  function validateForm() {
    const newErrors: typeof errors = {};
    if (!form.email) {
      newErrors.email = "Email обязателен";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Неверный формат email";
    }
    if (!form.full_name) {
      newErrors.full_name = "Полное имя обязательно";
    } else if (form.full_name.length < 2) {
      newErrors.full_name = "Имя слишком короткое";
    }
    if (!form.birth_date) {
      newErrors.birth_date = "Дата рождения обязательна";
    } else {
      const birthDate = new Date(form.birth_date);
      const now = new Date();
      if (birthDate >= now) {
        newErrors.birth_date = "Дата рождения не может быть в будущем";
      }
    }
    if (!form.password) {
      newErrors.password = "Пароль обязателен";
    } else if (form.password.length < 6) {
      newErrors.password = "Пароль должен быть не менее 6 символов";
    }
    if (!form.repeatPassword) {
      newErrors.repeatPassword = "Подтверждение пароля обязательно";
    } else if (form.password !== form.repeatPassword) {
      newErrors.repeatPassword = "Пароли не совпадают";
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
      await register(form);
      alert("Регистрация успешна");
      navigate("/login");
    } catch (err) {
      alert("Регистрация провалена");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.block}>
        <Link to="/" className={styles.link}>
          На главную
        </Link>
        <h2 className={styles.title}>Регистрация</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            <input
              className={cn(
                styles.input,
                errors.email && styles["input-error"]
              )}
              name="email"
              type="text"
              onChange={handleChange}
              required
              placeholder="Почта"
            />
            {errors.email && <div className={styles.error}>{errors.email}</div>}
          </label>

          <label className={styles.label}>
            <input
              className={cn(
                styles.input,
                errors.full_name && styles["input-error"]
              )}
              name="full_name"
              onChange={handleChange}
              required
              placeholder="Полное имя"
            />
            {errors.full_name && (
              <div className={styles.error}>{errors.full_name}</div>
            )}
          </label>

          <label className={styles.label}>
            Выберите свою дату рождения:
            <input
              className={cn(
                styles.input,
                errors.birth_date && styles["input-error"]
              )}
              name="birth_date"
              type="date"
              onChange={handleChange}
              required
              placeholder="Дата рождения"
            />
            {errors.birth_date && (
              <div className={styles.error}>{errors.birth_date}</div>
            )}
          </label>
          <label className={styles.label}>
            <input
              className={cn(
                styles.input,
                errors.password && styles["input-error"]
              )}
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              required
              placeholder="Пароль"
            />
            {errors.password && (
              <div className={styles.error}>{errors.password}</div>
            )}

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
          <label className={styles.label}>
            <input
              className={cn(
                styles.input,
                errors.repeatPassword && styles["input-error"]
              )}
              name="repeatPassword"
              type={showRepeatPassword ? "text" : "password"}
              onChange={handleChange}
              required
              placeholder="Введите пароль повторно"
            />
            {errors.repeatPassword && (
              <div className={styles.error}>{errors.repeatPassword}</div>
            )}

            <span
              className={cn(
                styles.eye,
                showRepeatPassword ? styles.eyeOpen : styles.eyeClosed
              )}
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              aria-label={
                showRepeatPassword ? "Скрыть пароль" : "Показать пароль"
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowRepeatPassword(!showRepeatPassword);
                }
              }}
            ></span>
          </label>
          <button className={styles.btn} type="submit">
            Зарегистрироваться
          </button>
        </form>

        <Link to="/login" className={cn(styles.link, styles["link-reg"])}>
          Уже зарегестрированы?
        </Link>
      </div>
    </div>
  );
}

export default Registration;
