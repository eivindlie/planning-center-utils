import { useCallback, useEffect, useState } from "react";
import { getPlansBetween, getTeamMembersForPlan } from "clients/serviceClient";
import { IPlan, IPlanTeamMember } from "types";
import { getEndOfSemester, getStartOfSemester } from "utils/dates";
import { Spinner } from "components/_basis/Spinner";
import { createUseStyles } from "react-jss";
import { DateInput } from "components/_basis/DateInput";
import { Button } from "components/_basis/Button";
import { COLORS } from "style/variables";

const useStyles = createUseStyles({
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  dateInput: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },
  planTable: {
    borderSpacing: 0,
    tableLayout: "fixed",
    whiteSpace: "nowrap",

    "& th, & td": {
      border: `1px solid ${COLORS.foreground}`,
      padding: "10px",
    },
  },
});

interface IWorshipLeaderMap {
  [planId: string]: IPlanTeamMember | undefined;
}

export const Plans = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(getStartOfSemester());
  const [endDate, setEndDate] = useState(getEndOfSemester());
  const [worshipLeaders, setWorshipLeaders] = useState<IWorshipLeaderMap>({});

  const load = useCallback(async () => {
    setLoading(true);
    const plansResult = await getPlansBetween(startDate, endDate);
    setPlans(plansResult);
    setWorshipLeaders(
      Object.assign(
        {},
        ...(await Promise.all(
          plansResult.map(async (plan) => {
            const teamMembers = await getTeamMembersForPlan(plan.id);

            return {
              [plan.id]: teamMembers.find(
                (teamMember) => teamMember.teamPositionName === "Teamleder"
              ),
            };
          })
        ))
      )
    );
    setLoading(false);
  }, [startDate, endDate]);

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
      {!loading && (
        <table className={classes.planTable}>
          <thead>
            <tr>
              <th>Dato</th>
              <th>Tema</th>
              <th>Lovsangsleder</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td>{plan.sortDate.toLocaleDateString()}</td>
                <td>{plan.title}</td>
                <td>{worshipLeaders[plan.id]?.name ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
