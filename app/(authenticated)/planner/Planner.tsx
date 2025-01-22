"use client";

import { Plan, Team } from "@prisma/client";
import { TeamSelectorList } from "./TeamSelectorList";
import { useState } from "react";
import { MemberWithBlockouts } from "@/types";

type Props = {
  plans: Plan[];
  members: MemberWithBlockouts[];
  teams: Team[];
};

export const Planner = ({ members, plans, teams }: Props) => {
  const [teamOrder, setTeamOrder] = useState<(string | undefined)[]>(
    plans.map(() => undefined)
  );
  return (
    <div>
      <TeamSelectorList
        members={members}
        plans={plans}
        teams={teams}
        teamOrder={teamOrder}
        onChange={(teamOrder) => setTeamOrder(teamOrder)}
      />
    </div>
  );
};
