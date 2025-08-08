import { Link } from "react-router-dom";
import styles from "./styles/HeroBlock.module.css";
import { useEffect } from "react";

function HeroBlock() {
  useEffect(() => {
    document.title = "Главная";
  }, []);

  return (
    <div className={styles.block}>
      <h2 className={styles.title}>СОЗДАЙ СВОЙ СПИСОК ЖЕЛАНИЙ</h2>
      <ul className={styles.list}>
        <li className={styles.item}>Добавляй желаемое из любого магазина</li>
        <li className={styles.item}>
          Делись ссылками на вишлист быстро и легко
        </li>
        <li className={styles.item}>Друзья могут бронировать желания</li>
      </ul>
      <Link className={styles.btn} to="/wishlist">
        ДОБАВИТЬ ЖЕЛАНИЕ
      </Link>
    </div>
  );
}

export default HeroBlock;
