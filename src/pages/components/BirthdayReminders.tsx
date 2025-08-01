import { useEffect, useState } from "react";
import API from "../../api/reminders";
import styles from "./styles/BirthdayReminders.module.css";
function BirthdayReminders() {
  interface Reminder {
    id: number;
    full_name: string;
    birth_date: string;
    remind_date: string;
  }
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [closed, setClosed] = useState(false);
  const STORAGE_KEY = "birthdayRemindersClosed";
  useEffect(() => {
    const closedBefore = localStorage.getItem(STORAGE_KEY);
    if (closedBefore === "true") {
      setClosed(true);
      setLoading(false);
      return;
    }
    async function fetchReminders() {
      try {
        const response = await API.get<Reminder[]>("/reminders");
        setReminders(response.data);
      } catch (err) {
        setError("Ошибка загрузки напоминаний");
      } finally {
        setLoading(false);
      }
    }
    fetchReminders();
  }, []);
  function handleClose() {
    setClosed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  }
  if (loading || closed) return null;
  if (error) return <div>{error}</div>;
  if (reminders.length === 0) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingReminders = reminders.filter((reminder) => {
    const birthDate = new Date(reminder.birth_date);
    let birthdayThisYear = new Date(
      today.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate()
    );
    if (birthdayThisYear < today) {
      birthdayThisYear.setFullYear(today.getFullYear() + 1);
    }
    const diffTime = birthdayThisYear.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });
  if (upcomingReminders.length === 0) return null;
  return (
    <div className={styles.block}>
      <div className={styles.separator}>
        <h3 className={styles.title}>Напоминания о днях рождения друзей</h3>
        <ul className={styles.list}>
          {upcomingReminders.map((reminder) => {
            const birthDate = new Date(reminder.birth_date);
            const birthdayThisYear = new Date(
              today.getFullYear(),
              birthDate.getMonth(),
              birthDate.getDate()
            );
            const displayDate =
              birthdayThisYear < today
                ? new Date(
                    today.getFullYear() + 1,
                    birthDate.getMonth(),
                    birthDate.getDate()
                  )
                : birthdayThisYear;
            return (
              <li className={styles.item} key={reminder.id}>
                <p className={styles.text}>
                  {reminder.full_name} — День рождения:{" "}
                  {displayDate.toLocaleDateString()}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        className={styles.btn}
        onClick={handleClose}
        aria-label="Закрыть напоминания"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 67 67"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.46665 7.46676C4.26665 10.5334 4.26665 56.1334 7.46665 59.2001C10.5333 62.4001 56.1333 62.4001 59.2 59.2001C62.4 56.1334 62.4 10.5334 59.2 7.46676C56.1333 4.26676 10.5333 4.26676 7.46665 7.46676ZM58 33.3334V58.0001H33.3333H8.66665L8.26665 34.6668C8.13332 21.8668 8.26665 10.6668 8.66665 9.73343C9.06665 8.26676 14.5333 8.00009 33.6 8.26676L58 8.66676V33.3334Z"
            fill="white"
          />
          <path
            d="M21.3333 22.267C21.3333 22.8003 23.6 25.467 26.2666 28.267L31.2 33.3337L26 38.667C19.2 45.6003 21.0666 47.467 28 40.667L33.3333 35.467L38.6666 40.667C41.6 43.467 44.4 45.467 44.9333 44.9337C45.4666 44.4003 43.4666 41.6003 40.6666 38.667L35.4666 33.3337L40.6666 28.0003C47.4666 21.067 45.6 19.2003 38.6666 26.0003L33.3333 31.2003L28.2666 26.267C23.3333 21.467 21.3333 20.267 21.3333 22.267Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  );
}
export default BirthdayReminders;
