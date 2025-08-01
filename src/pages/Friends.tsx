import { useEffect, useState } from "react";
import { getFriends } from "../api/friends";
import { Link } from "react-router-dom";
import { removeFriend } from "../api/friends";
import { getFriendLink } from "../api/friends";
import Spinner from "./components/Spinner";
import styles from "../pages/styles/Friends.module.css";

type Friend = {
  id: number;
  full_name: string;
  birth_date: string;
  email: string;
};

// type FriendsListProps = {
//   loading: boolean;
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
// };

function Friends() {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  async function generateLink() {
    try {
      const res = await getFriendLink();
      const newLink = res.data.friendLink;
      setLink(newLink);
      await navigator.clipboard.writeText(newLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Ошибка генерации ссылки");
    }
  }

  useEffect(() => {
    fetchFriends();
  }, []);

  async function fetchFriends() {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await getFriends();
      setFriends(res.data);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      alert("Ошибка загрузки друзей");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveFriend(id: number) {
    if (window.confirm("Удалить этого друга?")) {
      try {
        await removeFriend(id);
        setFriends(friends.filter((friend) => friend.id !== id));
      } catch (error) {
        alert("Ошибка при удалении друга");
      }
    }
  }

  function formatDateLocal(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  if (loading) return <Spinner />;

  console.log(link);

  return (
    <div className={styles.container}>

      <h2 className={styles.title}>Мои друзья</h2>

      {friends.length === 0 ? (
        <p className={styles["list-empty"]}>У вас пока нет друзей</p>
      ) : (
        <ul className={styles.list}>
          {friends.map((friend) => (
            <li className={styles.item} key={friend.id}>
              <span className={styles.name}>{friend.full_name} </span>

              <span className={styles.date}>
                {formatDateLocal(friend.birth_date)}{" "}
              </span>

              <Link to={`/wishlist/${friend.id}`} className={styles.link}>
                Вишлист
              </Link>

              <button
                className={styles.btn}
                onClick={() => handleRemoveFriend(friend.id)}
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}

      <button className={styles.btn} onClick={generateLink}>
        {copied
          ? "Ссылка скопирована в буфер обмена!"
          : "Получить ссылку для добавления в друзья!"}
      </button>
    </div>
  );
}

export default Friends;
