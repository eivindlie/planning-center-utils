import { useCallback, useState } from "react";
import { createUseStyles } from "react-jss";
import { Button, Spinner } from "components";
import {
  getBlockoutDatesForPerson,
  getPlansBetween,
} from "clients/serviceClient";
import { IPlan, ITeam, ITeamMemberWithBlockoutDates } from "types";
import { TeamBlockouts } from "./TeamBlockouts";
import { DateInput } from "components/_basis/DateInput";
import { useEffect } from "react";
import { getEndOfSemester, getStartOfSemester } from "utils/dates";
import { useTeams } from "hooks/useTeams";

const useStyles = createUseStyles<
  "wrapper" | "dateInput" | "blockoutContainer",
  { numberOfPlans: number }
>({
  wrapper: {},
  dateInput: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },
  blockoutContainer: {
    display: "grid",
    gridTemplateColumns: (props) =>
      `repeat(${props.numberOfPlans + 1}, minmax(20px, max-content))`,
    "& > *": {
      border: "1px solid white",
      padding: "5px",
      minHeight: "20px",
    },
  },
});

interface ITeamWithBlockouts {
  id: string;
  teamName: string;
  membersWithBlockouts: ITeamMemberWithBlockoutDates[];
}

export const Blockouts = () => {
  const teams = useTeams();
  const [teamsWithBlockouts, setTeamsWithBlockouts] = useState<
    ITeamWithBlockouts[]
  >([]);
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

  useEffect(() => {
    const updateBlockouts = async () => {
      if (!plans.length || !teams.length) return;
      setLoading(true);
      setTeamsWithBlockouts(
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
    updateBlockouts();
  }, [teams, plans]);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setPlans(await getPlansBetween(startDate, endDate));
  }, [endDate, startDate]);
  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const classes = useStyles({ numberOfPlans: plans.length });
  return (
    <div className={classes.wrapper}>
      <div className={classes.dateInput}>
        <DateInput value={startDate} onChange={(date) => setStartDate(date)} />
        <DateInput value={endDate} onChange={(date) => setEndDate(date)} />
        <Button onClick={() => loadPlans()}>Hent oversikt</Button>
      </div>
      {loading && <Spinner />}
      {!loading && (
        <div className={classes.blockoutContainer}>
          {teamsWithBlockouts.map((team) => (
            <TeamBlockouts
              key={team.id}
              teamMembers={team.membersWithBlockouts}
              teamName={team.teamName}
              plans={plans}
            />
          ))}
        </div>
      )}
    </div>
  );
};
