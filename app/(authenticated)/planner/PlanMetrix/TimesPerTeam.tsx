import { Table } from "@/components/Table/Table";
import { TD } from "@/components/Table/TD";
import { TH } from "@/components/Table/TH";
import { Team } from "@prisma/client";

type Props = {
  teams: Team[];
  teamOrder: (string | undefined)[];
};

export const TimesPerTeam = ({ teams, teamOrder }: Props) => {
  return (
    <div>
      <h2>Antall ganger per team</h2>
      <Table>
        <>
          <thead>
            <tr>
              <TH>Team</TH>
              <TH>Antall</TH>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <TD>{team.name}</TD>
                <TD>{teamOrder.filter((to) => to === team.id).length}</TD>
              </tr>
            ))}
          </tbody>
        </>
      </Table>
    </div>
  );
};
