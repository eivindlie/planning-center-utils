import { useState } from "react";
import { createUseStyles } from "react-jss";
import { Spinner } from ".";
import {
  getBlockoutDatesForPerson,
  getPlansBetween,
} from "../clients/serviceClient";
import { IPlan, ITeam, ITeamMemberWithBlockoutDates } from "../types";
import { TeamBlockouts } from "./TeamBlockouts";
import { LOCALSTORAGE_TEAMS_KEY } from "./Teams";

const useStyles = createUseStyles({
  wrapper: {},
});

interface ITeamWithBlockouts {
  id: number;
  teamName: string;
  membersWithBlockouts: ITeamMemberWithBlockoutDates[];
}

export const Blockouts = () => {
  const [teams, setTeams] = useState<ITeamWithBlockouts[]>([]);
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), 0, 2)
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear() + 1, 0, 1)
  );

  const getBlockoutsForTeam = async (
    team: ITeam
  ): Promise<ITeamMemberWithBlockoutDates[]> => {
    return await Promise.all(
      team.members.map(
        async (member) =>
          ({
            member: member,
            blockoutDates: await getBlockoutDatesForPerson(member.id),
          } as ITeamMemberWithBlockoutDates)
      )
    );
  };

  const load = async () => {
    setLoading(true);
    setPlans(await getPlansBetween(startDate, endDate));
    const teamsStringValue = localStorage.getItem(LOCALSTORAGE_TEAMS_KEY);
    if (!teamsStringValue) {
      return;
    }
    const teams = (JSON.parse(teamsStringValue) as ITeam[]).sort(
      (a, b) => a.id - b.id
    );
    setTeams(
      await Promise.all(
        teams.map(
          async (team) =>
            ({
              id: team.id,
              teamName: team.name,
              membersWithBlockouts: await getBlockoutsForTeam(team),
            } as ITeamWithBlockouts)
        )
      )
    );
    setLoading(false);
  };

  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <div>
        <input
          type="date"
          value={startDate.toISOString().split("T")[0]}
          onChange={(e) => setStartDate(new Date(e.currentTarget.value))}
        />
        <input
          type="date"
          value={endDate.toISOString().split("T")[0]}
          onChange={(e) => setEndDate(new Date(e.currentTarget.value))}
        />
        <button onClick={() => load()}>Hent oversikt</button>
      </div>
      {loading && <Spinner />}
      {!loading &&
        teams.map((team) => (
          <TeamBlockouts
            key={team.id}
            teamMembers={team.membersWithBlockouts}
            teamName={team.teamName}
            plans={plans}
          />
        ))}
    </div>
  );
};
