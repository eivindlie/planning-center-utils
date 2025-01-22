import { MemberWithBlockouts } from "@/types";
import { Plan, Team } from "@prisma/client";
import styles from "./PlanMetrix.module.css";
import { MembersTotalMissed } from "./MembersTotalMissed";
import { TimesPerTeam } from "./TimesPerTeam";
import { AvgMembersMissing } from "./AvgMembersMissing";
import { TotalAbsences } from "./TotalAbsences";

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
      <TimesPerTeam teams={teams} teamOrder={teamOrder} />
      <AvgMembersMissing members={members} plans={plans} teams={teams} teamOrder={teamOrder} />
      <TotalAbsences members={members} plans={plans} teamOrder={teamOrder} />
    </div>
  );
};
