import { PropsWithChildren } from "react";
import styles from "./TH.module.css";

export const TH = ({ children }: PropsWithChildren) => {
  return <th className={styles.th}>{children}</th>;
};
