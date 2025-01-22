import { Plan, Team } from "@prisma/client";
import { TeamSelector } from "./TeamSelector";
import styles from "./TeamSelectorList.module.css";
import { MemberWithBlockouts } from "@/types";

type Props = {
  plans: Plan[];
  members: MemberWithBlockouts[];
  teams: Team[];
  teamOrder: (string | undefined)[];
  onChange: (teamOrder: (string | undefined)[]) => void;
};
export const TeamSelectorList = ({
  plans,
  members,
  teams,
  teamOrder,
  onChange,
}: Props) => {
  return (
    <div className={styles.container}>
      {plans.map((plan, p) => (
        <TeamSelector
          key={plan.id}
          plan={plan}
          members={members}
          teams={teams}
          selectedTeam={teams.find((t) => t.id === teamOrder[p])}
          onTeamSelected={(team) => {
            const newTeamOrder = [...teamOrder];
            newTeamOrder[p] = team?.id;
            onChange(newTeamOrder);
          }}
        />
      ))}
    </div>
  );
};
