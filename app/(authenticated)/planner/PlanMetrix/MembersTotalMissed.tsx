import { MemberWithBlockouts } from "@/types";
import { Plan, Team } from "@prisma/client";
import styles from "./MembersTotalMissed.module.css";
import { Table } from "@/components/Table/Table";
import { TD } from "@/components/Table/TD";
import { TH } from "@/components/Table/TH";

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
          <Table>
            <>
              <thead>
                <tr>
                  <TH>Medlem</TH>
                  <TH>Antall ganger mistet</TH>
                </tr>
              </thead>
              <tbody>
                {team.memberMetrics.map((member) => (
                  <tr key={member.name}>
                    <TD>{member.name}</TD>
                    <TD>{member.missed}</TD>
                  </tr>
                ))}
              </tbody>
            </>
          </Table>
        </div>
      ))}
    </div>
  );
};
