import { MemberWithBlockouts } from "@/types";
import { Plan, Team } from "@prisma/client";
import styles from "./MembersTotalMissed.module.css";

type Props = {
  members: MemberWithBlockouts[];
  plans: Plan[];
  teams: Team[];
  teamOrder: (string | undefined)[];
};
export const MembersTotalMissed = ({
  members,
  plans,
  teams,
  teamOrder,
}: Props) => {
  const teamMetrics = teams
    .map((team) => ({
      id: team.id,
      name: team.name,
      memberMetrics: members
        .filter((member) => member.teamId === team.id)
        .map((member) => ({
          name: member.name,
          missed: plans
            .filter((plan, p) => teamOrder[p] === team.id)
            .filter((p) =>
              member.blockouts.some(
                (b) => p.date >= b.startsAt && p.date <= b.endsAt
              )
            ).length,
        }))
        .filter((member) => member.missed > 0),
    }))
    .filter((team) => team.memberMetrics.length > 0);
  return (
    <div className={styles.container}>
      <h2>Antall ganger mistet per medlem</h2>
      {teamMetrics.length === 0 && (
        <p>Ingen medlemmer har mistet noen ganger 🤩</p>
      )}
      {teamMetrics.map((team) => (
        <div key={team.id}>
          <h3 className={styles.teamName}>{team.name}</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.cell}>Medlem</th>
                <th className={styles.cell}>Antall ganger mistet</th>
              </tr>
            </thead>
            <tbody>
              {team.memberMetrics.map((member) => (
                <tr key={member.name}>
                  <td className={styles.cell}>{member.name}</td>
                  <td className={styles.cell}>{member.missed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};
