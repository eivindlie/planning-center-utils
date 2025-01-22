"use client";

import { Plan, Team } from "@prisma/client";
import { TeamSelectorList } from "./TeamSelectorList";
import { MemberWithBlockouts } from "@/types";
import { PlanMetrix } from "./PlanMetrix/PlanMetrix";
import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  plans: Plan[];
  members: MemberWithBlockouts[];
  teams: Team[];
};

export const Planner = ({ members, plans, teams }: Props) => {
  const params = useSearchParams();
  const pathname = usePathname();

  const teamOrderRaw = params.get("order")?.split(",") ?? [];
  while (teamOrderRaw.length < plans.length) {
    teamOrderRaw.push("-1");
  }
  const teamOrder = teamOrderRaw
    .map((t) => parseInt(t))
    .map((t) => (t === -1 ? undefined : teams[t].id));
  const navigateToTeamOrder = (teamOrder: (string | undefined)[]) => {
    const order = teamOrder
      .map((t) =>
        t === undefined
          ? "-1"
          : teams.findIndex((team) => team.id === t).toString()
      )
      .join(",");
    window.history.pushState({}, "", `${pathname}?order=${encodeURIComponent(order)}`);
  };
  return (
    <div>
      <TeamSelectorList
        members={members}
        plans={plans}
        teams={teams}
        teamOrder={teamOrder}
        onChange={navigateToTeamOrder}
      />
      <PlanMetrix
        members={members}
        plans={plans}
        teams={teams}
        teamOrder={teamOrder}
      />
    </div>
  );
};
