import Link from "next/link";
import { ExportStatus } from "./ExportStatus";
import styles from "./Header.module.css";

export const Header = () => {
  return (
    <div className={styles.header}>
      <h1>
        <Link href="/">Planning Center Utils</Link>
      </h1>
      <ExportStatus />
    </div>
  );
};
