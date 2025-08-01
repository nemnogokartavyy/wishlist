import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { acceptFriend } from "../../api/friends";
import Spinner from "./Spinner";
function FriendAccept() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const hasAccepted = useRef(false);
  useEffect(() => {
    if (!id || hasAccepted.current) return;
    hasAccepted.current = true;
    async function accept() {
      try {
        await acceptFriend(parseInt(id as string, 10));
        alert("Теперь вы друзья!");
        navigate("/friends");
      } catch (err: any) {
        alert(
          "Ошибка добавления в друзья: " +
            (err.response?.data?.message || err.message)
        );
        navigate("/");
      }
    }
    accept();
  }, [id, navigate]);
  return (
    <>
      <Spinner />
    </>
  );
}
export default FriendAccept;
