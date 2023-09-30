import { ImSpinner9 } from "react-icons/im";
import styles from "../utils/Loader.module.css";

export const Loader = () => {
  return (
    <div className={styles.spinner}>
      <ImSpinner9 className={styles.spinning} size={40} />
    </div>
  );
};
