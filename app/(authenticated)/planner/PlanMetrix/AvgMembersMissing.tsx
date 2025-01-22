import { Table } from "@/components/Table/Table";
import { TD } from "@/components/Table/TD";
import { TH } from "@/components/Table/TH";
import { MemberWithBlockouts } from "@/types";
import { Plan, Team } from "@prisma/client";

type Props = {
  members: MemberWithBlockouts[];
  plans: Plan[];
  teams: Team[];
  teamOrder: (string | undefined)[];
};

export const AvgMembersMissing = ({
  members,
  plans,
  teams,
  teamOrder,
}: Props) => {
  const teamMetrics = teams.map((team) => {
    const missingPerTime = teamOrder.map((teamId, p) => ({
      teamId,
      missing: members
        .filter((member) => member.teamId === teamId)
        .filter((member) =>
          member.blockouts.some(
            (blockout) =>
              plans[p].date >= blockout.startsAt &&
              plans[p].date <= blockout.endsAt
          )
        ).length,
    }));
    const missingForTeam = missingPerTime.filter((t) => t.teamId === team.id);
    const totalMissing = missingForTeam
      .map((t) => t.missing)
      .reduce((a, b) => a + b, 0);
    return {
      id: team.id,
      name: team.name,
      avgMissing: totalMissing / Math.max(1, missingForTeam.length),
    };
  });

  return (
    <div>
      <h2>Gjennomsnittlig antall manglende medlemmer</h2>
      <Table>
        <>
          <thead>
            <tr>
              <TH>Team</TH>
              <TH>Gjennomsnittlig antall manglende</TH>
            </tr>
          </thead>
          <tbody>
            {teamMetrics.map((team) => (
              <tr key={team.id}>
                <TD>{team.name}</TD>
                <TD>{team.avgMissing}</TD>
              </tr>
            ))}
          </tbody>
        </>
      </Table>
    </div>
  );
};
