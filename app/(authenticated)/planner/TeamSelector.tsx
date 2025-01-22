import { formatDate } from "@/utils/formatDate";
import { Team, Plan } from "@prisma/client";
import { MemberWithBlockouts } from "@/types";
import styles from "./TeamSelector.module.css";

type Props = {
  teams: Team[];
  plan: Plan;
  members: MemberWithBlockouts[];
  selectedTeam?: Team;
  onTeamSelected: (team?: Team) => void;
};
export const TeamSelector = ({
  teams,
  members,
  plan,
  selectedTeam,
  onTeamSelected,
}: Props) => {
  const missingMembers = members
    .filter((member) => member.teamId === selectedTeam?.id)
    .filter((member) =>
      member.blockouts.some(
        (blockout) =>
          blockout.startsAt <= plan.date && blockout.endsAt >= plan.date
      )
    );

  return (
    <div className={styles.teamSelector}>
      <h2>{formatDate(plan.date)}</h2>
      <select
        value={selectedTeam?.id ?? ""}
        onChange={(e) => {
          const teamId = e.target.value;
          const team = teams.find((t) => t.id === teamId);
          onTeamSelected(team);
        }}
      >
        <option value=""></option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
      {missingMembers.length > 0 && (
        <p>Borte ({missingMembers.length}): {missingMembers.map((member) => member.name).join(", ")}</p>
      )}
    </div>
  );
};
