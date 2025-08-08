import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { acceptFriend } from "../../api/friends";
import Spinner from "./Spinner";
import Modal from "./Modal";

function FriendAccept() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const hasAccepted = useRef(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    document.title = "Добавление друга";
  }, []);

  useEffect(() => {
    if (!id || hasAccepted.current) return;
    hasAccepted.current = true;
    async function accept() {
      try {
        await acceptFriend(parseInt(id as string, 10));
        setModalMessage("Теперь вы друзья!");
      } catch (err: any) {
        setModalMessage(
          "Ошибка добавления в друзья: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setShowModal(true);
      }
    }
    accept();
  }, [id]);

  function handleCloseModal() {
    setShowModal(false);
    if (modalMessage.startsWith("Теперь вы друзья")) {
      navigate("/friends");
    } else {
      navigate("/");
    }
  }

  return (
    <>
      <Spinner />
      <Modal
        show={showModal}
        message={modalMessage}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default FriendAccept;
