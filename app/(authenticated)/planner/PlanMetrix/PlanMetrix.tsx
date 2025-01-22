import { MemberWithBlockouts } from "@/types";
import { Plan, Team } from "@prisma/client";
import styles from "./PlanMetrix.module.css";
import { MembersTotalMissed } from "./MembersTotalMissed";

type Props = {
  plans: Plan[];
  members: MemberWithBlockouts[];
  teams: Team[];
  teamOrder: (string | undefined)[];
};

export const PlanMetrix = ({ members, plans, teams, teamOrder }: Props) => {
  return (
    <div className={styles.container}>
      <MembersTotalMissed
        members={members}
        plans={plans}
        teams={teams}
        teamOrder={teamOrder}
      />
    </div>
  );
};
