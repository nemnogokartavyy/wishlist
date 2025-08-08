import styles from "./styles/ConfirmModal.module.css";

interface ConfirmModalProps {
  show: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!show) return null;

  return (
    <div className={styles.container} onClick={onCancel}>
      <div className={styles.modal}>
        <p className={styles.text}>{message}</p>
        <div className={styles["btn-block"]}>
          <button className={styles.btn} onClick={onConfirm}>
            Да
          </button>
          <button className={styles.btn} onClick={onCancel}>
            Нет
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;