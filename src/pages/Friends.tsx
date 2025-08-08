import { useEffect, useState } from "react";
import { getFriends, removeFriend, getFriendLink } from "../api/friends";
import { Link } from "react-router-dom";
import Spinner from "./components/Spinner";
import ConfirmModal from "./components/ConfirmModal";
import Modal from "./components/Modal";
import styles from "../pages/styles/Friends.module.css";

type Friend = {
  id: number;
  full_name: string;
  birth_date: string;
  email: string;
};

function Friends() {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    document.title = "Мои друзья";
  }, []);

  useEffect(() => {
    fetchFriends();
  }, []);

  async function generateLink() {
    try {
      const res = await getFriendLink();
      const newLink = res.data.friendLink;
      await navigator.clipboard.writeText(newLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setModalMessage("Ошибка генерации ссылки");
      setShowModal(true);
    }
  }

  async function fetchFriends() {
    try {
      setLoading(true);
      const res = await getFriends();
      setFriends(res.data);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      setModalMessage("Ошибка загрузки друзей");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  }

  function handleRemoveClick(id: number) {
    setFriendToDelete(id);
    setShowConfirm(true);
  }

  async function handleRemoveConfirm() {
    if (friendToDelete === null) return;

    try {
      await removeFriend(friendToDelete);
      setFriends(friends.filter((friend) => friend.id !== friendToDelete));
    } catch (error) {
      setModalMessage("Ошибка при удалении друга");
      setShowModal(true);
    } finally {
      setShowConfirm(false);
      setFriendToDelete(null);
    }
  }

  function handleRemoveCancel() {
    setShowConfirm(false);
    setFriendToDelete(null);
  }

  function formatDateLocal(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  if (loading) return <Spinner />;

  return (
    <div className={styles.container}>
      <Modal
        show={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />

      <ConfirmModal
        show={showConfirm}
        message="Удалить этого друга?"
        onConfirm={handleRemoveConfirm}
        onCancel={handleRemoveCancel}
      />

      <h2 className={styles.title}>Мои друзья</h2>

      {friends.length === 0 ? (
        <p className={styles["list-empty"]}>У вас пока нет друзей</p>
      ) : (
        <ul className={styles.list}>
          {friends.map((friend) => (
            <li className={styles.item} key={friend.id}>
              <span className={styles.name}>{friend.full_name}</span>
              <span className={styles.date}>
                {formatDateLocal(friend.birth_date)}
              </span>

              <Link to={`/wishlist/${friend.id}`} className={styles.link}>
                Вишлист
              </Link>

              <button
                className={styles.btn}
                onClick={() => handleRemoveClick(friend.id)}
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
