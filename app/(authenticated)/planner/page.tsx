import prisma from "@/prisma/client";
import { Planner } from "./Planner";

export default async function PlannerPage() {
  const startDate = new Date(2025, 0, 1);
  const endDate = new Date(2025, 5, 30);
  const plans = await prisma.plan.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: "asc" },
  });
  const teams = await prisma.team.findMany({ orderBy: { id: "asc" } });
  const members = await prisma.member.findMany({
    include: { blockouts: true },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <>
      <Planner members={members} plans={plans} teams={teams} />
    </>
  );
}
