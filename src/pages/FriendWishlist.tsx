import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWishlist, markGift, unmarkGift } from "../api/wishlist";
import { getUser } from "../api/friends";
import Spinner from "./components/Spinner";
import Modal from "./components/Modal";
import { decodeToken } from "../utils/auth";
import styles from "./styles/FriendsWishlist.module.css";
import stub from "../image/stub.png";

type WishlistItem = {
  id: number;
  gift_name: string;
  comment: string;
  image_url: string;
  buy_link: string;
  created_at: string;
  isMarked: boolean;
  markedBy: number | null;
};

function FriendWishlist() {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    document.title = `Вишлист пользователя ${id}`;
  }, [id]);

  useEffect(() => {
    const decoded = decodeToken();
    setCurrentUserId(decoded?.id || decoded?.userId || null);
  }, []);

  useEffect(() => {
    if (id) {
      const userId = parseInt(id);
      getUser(userId)
        .then((res) => setUserEmail(res.data.email))
        .catch((err) => {
          console.error("Ошибка загрузки пользователя:", err);
          setUserEmail(null);
        });
      fetchWishlist(userId);
    }
  }, [id]);

  async function fetchWishlist(userId: number) {
    try {
      setLoading(true);
      const res = await getWishlist(userId);
      setItems(res.data);
    } catch (error) {
      console.error("Ошибка загрузки вишлиста:", error);
      setModalMessage("Ошибка загрузки вишлиста");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleMark(giftId: number) {
    try {
      await markGift(giftId);
      fetchWishlist(Number(id));
    } catch (e: any) {
      setModalMessage(
        e.response?.data?.message || "Ошибка при отметке подарка"
      );
      setShowModal(true);
    }
  }

  async function handleUnmark(giftId: number) {
    try {
      await unmarkGift(giftId);
      fetchWishlist(Number(id));
    } catch (e: any) {
      setModalMessage(e.response?.data?.message || "Ошибка при снятии отметки");
      setShowModal(true);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className={styles.container}>
      <Modal
        show={showModal}
        message={modalMessage}
        onClose={() => setShowModal(false)}
      />

      <div className={styles["block-title"]}>
        <h2 className={styles.title}>Вишлист пользователя</h2>
        <span className={styles["title-mail"]}>
          {userEmail ? `${userEmail}` : `#${id}`}
        </span>
      </div>

      {items.length === 0 ? (
        <p className={styles["list-empty"]}>Вишлист пуст</p>
      ) : (
        <ul
          className={`${styles.list} ${
            items.length >= 3 ? styles.justifyStart : styles.justifyCenter
          }`}
        >
          {items
            .slice()
            .reverse()
            .map((item) => {
              const isMarkedByCurrentUser = item.markedBy === currentUserId;
              return (
                <li className={styles.item} key={item.id}>
                  <h3 className={styles["sub-title"]}>{item.gift_name}</h3>

                  <p className={styles.text}>{item.comment}</p>

                  {item.image_url && (
                    <img
                      className={styles.image}
                      src={item.image_url}
                      alt={item.gift_name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = stub;
                      }}
                    />
                  )}

                  {item.buy_link && (
                    <a
                      className={styles.link}
                      href={item.buy_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Где купить?
                    </a>
                  )}

                  {!item.isMarked && (
                    <button
                      className={styles.btn}
                      onClick={() => handleMark(item.id)}
                    >
                      Отметить подарок
                    </button>
                  )}

                  {item.isMarked && isMarkedByCurrentUser && (
                    <button
                      className={styles.btn}
                      onClick={() => handleUnmark(item.id)}
                    >
                      Снять отметку
                    </button>
                  )}

                  {item.isMarked && !isMarkedByCurrentUser && (
                    <p className={styles["text-marked"]}>
                      Подарок занят другим пользователем
                    </p>
                  )}
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}

export default FriendWishlist;
