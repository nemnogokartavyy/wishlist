import React from "react";
import styles from "./styles/Modal.module.css";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  message: string;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, message }) => {

  if (!show) return null;

  return (
    <div className={styles.container} onClick={onClose}>
      <div className={styles.modal}>
        <p className={styles.text}>{message}</p>
      </div>
    </div>
  );
  
};

export default Modal;