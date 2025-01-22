import { ExportStatus } from "./ExportStatus";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <div className={styles.header}>
        <h1>Planning Center Utils</h1>
      <ExportStatus />
    </div>
  );
};
