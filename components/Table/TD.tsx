import { PropsWithChildren } from "react";
import styles from "./TD.module.css";

export const TD = ({ children }: PropsWithChildren) => {
  return <td className={styles.td}>{children}</td>;
};
