import styles from './Table.module.css';

export const Table = ({ children }: { children: React.ReactElement }) => {
    return <table className={styles.table}>{children}</table>;
};
