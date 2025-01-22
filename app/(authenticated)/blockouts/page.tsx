import prisma from "@/prisma/client";
import { TeamBlockouts } from "./TeamBlockouts";
import styles from "./page.module.css";
import Link from "next/link";

export default async function BlockoutPage() {
  const startDate = new Date(2025, 0, 1);
  const endDate = new Date(2025, 5, 30);

  const teams = await prisma.team.findMany();
  const members = await prisma.member.findMany({
    include: { blockouts: true },
    orderBy: {
      name: "asc",
    },
  });
  // members.sort((a, b) =>
  //   a.isLeader && !b.isLeader
  //     ? 1
  //     : !a.isLeader && b.isLeader
  //     ? -1
  //     : a.name.localeCompare(b.name)
  // );
  const plans = await prisma.plan.findMany({
    where: { date: { gte: startDate, lte: endDate } },
    orderBy: { date: "asc" },
  });

  const grid = `max-content repeat(${plans.length}, minmax(30px, max-content))`;

  return (
    <div className={styles.container}>
      <h1>Blockouts</h1>
      <Link href="/planner">Gå til planlegger</Link>
      <div
        className={styles.blockoutContainer}
        style={{ gridTemplateColumns: grid }}
      >
        {teams.map((team) => (
          <TeamBlockouts
            key={team.id}
            team={team}
            members={members.filter((member) => member.teamId === team.id)}
            plans={plans}
          />
        ))}
      </div>
    </div>
  );
}
