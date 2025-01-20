import { useState } from "react";
import { createUseStyles } from "react-jss";
import { Button, Spinner } from "components";
import { TeamBlockouts } from "./TeamBlockouts";
import { DateInput } from "components/_basis/DateInput";
import { getEndOfSemester, getStartOfSemester } from "utils/dates";
import { useTeams } from "hooks/useTeams";
import { PlanSummary } from "./PlanSummary";
import { exportBlockoutsToExcel } from "utils/exportBlockoutsToExcel";
import { usePlans } from "hooks/usePlans";
import { useTeamsWithBlockouts } from "hooks/useTeamsWithBlockouts";

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
  const [startDate, setStartDate] = useState(getStartOfSemester());
  const [endDate, setEndDate] = useState(getEndOfSemester());
  const teams = useTeams();
  const {
    plans,
    planTeamMembers,
    loading: plansLoading,
    loadPlans,
  } = usePlans(startDate, endDate);
  const { teamsWithBlockouts, loading: teamsWithBlockoutsLoading } =
    useTeamsWithBlockouts(teams, plans);
  const loading = teamsWithBlockoutsLoading || plansLoading;

  const classes = useStyles({ numberOfPlans: plans.length });
  return (
    <div className={classes.wrapper}>
      <div className={classes.dateInput}>
        <DateInput value={startDate} onChange={(date) => setStartDate(date)} />
        <DateInput value={endDate} onChange={(date) => setEndDate(date)} />
        <Button onClick={() => loadPlans()}>Hent oversikt</Button>

        {!loading && (
          <Button
            onClick={() => exportBlockoutsToExcel(teamsWithBlockouts, plans)}
          >
            Eksporter til Excel
          </Button>
        )}
      </div>
      {loading && <Spinner />}
      {!loading && (
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
