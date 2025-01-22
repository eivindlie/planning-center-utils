import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/config";
import styles from "./layout.module.css";
import { ExportStatus } from "./ExportStatus";
import { Header } from "./Header";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user.activated) {
    return (
      <div className={styles.notActivated}>
        <h1>Brukeren din er ikke aktivert</h1>
        <p>
          Ta kontakt med Eivind for å få aktivert brukeren din før du kan bruke
          systemet.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
