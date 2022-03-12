import { useCallback, useState } from "react";
import { createUseStyles } from "react-jss";
import { Button, Spinner } from "components";
import {
  getBlockoutDatesForPerson,
  getPlansBetween,
} from "clients/serviceClient";
import { IPlan, ITeam, ITeamMemberWithBlockoutDates } from "types";
import { TeamBlockouts } from "./TeamBlockouts";
import { LOCALSTORAGE_TEAMS_KEY } from "components/people/Teams";
import { DateInput } from "components/_basis/DateInput";
import { useEffect } from "react";
import { getEndOfSemester, getStartOfSemester } from "utils/dates";

const useStyles = createUseStyles({
  wrapper: {},
  dateInput: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },
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
  const [startDate, setStartDate] = useState(getStartOfSemester());
  const [endDate, setEndDate] = useState(getEndOfSemester());

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

  const load = useCallback(async () => {
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
  }, [endDate, startDate]);

  useEffect(() => {
    load();
  }, [load]);

  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <div className={classes.dateInput}>
        <DateInput value={startDate} onChange={(date) => setStartDate(date)} />
        <DateInput value={endDate} onChange={(date) => setEndDate(date)} />
        <Button onClick={() => load()}>Hent oversikt</Button>
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
