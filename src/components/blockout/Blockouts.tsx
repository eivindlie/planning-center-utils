import { useState } from "react";
import { createUseStyles } from "react-jss";
import { Button, Spinner } from "components";
import {
  getBlockoutDatesForPerson,
} from "clients/serviceClient";
import {
  ITeam,
  ITeamMemberWithBlockoutDates,
  ITeamWithBlockouts,
} from "types";
import { TeamBlockouts } from "./TeamBlockouts";
import { DateInput } from "components/_basis/DateInput";
import { useEffect } from "react";
import { getEndOfSemester, getStartOfSemester } from "utils/dates";
import { useTeams } from "hooks/useTeams";
import { PlanSummary } from "./PlanSummary";
import { exportBlockoutsToExcel } from "utils/exportBlockoutsToExcel";
import { usePlans } from "hooks/usePlans";

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
      `max-content repeat(${props.numberOfPlans}, minmax(30px, max-content))`,
    "& > *": {
      border: "1px solid white",
      padding: "5px",
      minHeight: "20px",
    },
  },
});

export const Blockouts = () => {
  const teams = useTeams();
  const [teamsWithBlockouts, setTeamsWithBlockouts] = useState<
    ITeamWithBlockouts[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(getStartOfSemester());
  const [endDate, setEndDate] = useState(getEndOfSemester());
  const {
    plans,
    planTeamMembers,
    loading: plansLoading,
    loadPlans,
  } = usePlans(startDate, endDate);

  const isLoading = loading || plansLoading;

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

  const classes = useStyles({ numberOfPlans: plans.length });
  return (
    <div className={classes.wrapper}>
      <div className={classes.dateInput}>
        <DateInput value={startDate} onChange={(date) => setStartDate(date)} />
        <DateInput value={endDate} onChange={(date) => setEndDate(date)} />
        <Button onClick={() => loadPlans()}>Hent oversikt</Button>

        {!isLoading && (
          <Button
            onClick={() => exportBlockoutsToExcel(teamsWithBlockouts, plans)}
          >
            Eksporter til Excel
          </Button>
        )}
      </div>
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          <p style={{ maxWidth: "80ch" }}>
            <strong>Obs.:</strong> Planning Center har ikke noe team-konsept, så
            nedenfor vises hvilket team som spiller basert på hvem som er
            teamleder på det møtet. Siden det hender at teamlederne har ansvar
            for et møte uten at det er deres team som spiller kan det være at
            det vises flere møter for et team enn det som er riktig 🙃
          </p>

          <div className={classes.blockoutContainer}>
            {teamsWithBlockouts.map((team) => (
              <TeamBlockouts
                key={team.id}
                teamMembers={team.membersWithBlockouts}
                teamName={team.teamName}
                plans={plans}
                planTeamMembers={planTeamMembers}
              />
            ))}
            <PlanSummary plans={plans} teams={teams} parentLoading={loading} />
          </div>
        </>
      )}
    </div>
  );
};
