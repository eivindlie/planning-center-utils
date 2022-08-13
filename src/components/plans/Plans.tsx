import { useCallback, useEffect, useState } from "react";
import { getPlansBetween, getTeamMembersForPlan } from "clients/serviceClient";
import { IPlan, IPlanTeamMember } from "types";
import { formatDate, getEndOfSemester, getStartOfSemester } from "utils/dates";
import { Spinner } from "components/_basis/Spinner";
import { createUseStyles } from "react-jss";
import { DateInput } from "components/_basis/DateInput";
import { Button } from "components/_basis/Button";
import { COLORS } from "style/variables";
import { useTeams } from "hooks/useTeams";

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

    "& th, & td": {
      border: `1px solid ${COLORS.foreground}`,
      padding: "10px",
    },
  },
  planLink: {
    color: COLORS.foreground,
    cursor: "pointer",
    textDecoration: "none",

    "&:hover": {
      textDecoration: "underline",
    },
  },
  activeRow: {
    background: COLORS.primaryLighter,
    color: COLORS.background,
  },
});

interface ITeamMemberTypeMap {
  [planId: string]: IPlanTeamMember[];
}

const createMapOfTeamMemberType = (
  type: string,
  plans: IPlan[],
  teamMembersForAllPlans: IPlanTeamMember[][]
): ITeamMemberTypeMap => {
  return Object.assign(
    {},
    ...plans.map((plan, i) => {
      const teamMembers = teamMembersForAllPlans[i].filter(
        (m) => m.status !== "D"
      );

      const matchingMembers = teamMembers.filter(
        (teamMember) => teamMember.teamPositionName === type
      );

      return {
        [plan.id]: matchingMembers,
      };
    })
  );
};

export const Plans = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(getStartOfSemester());
  const [endDate, setEndDate] = useState(getEndOfSemester());
  const [worshipLeaders, setWorshipLeaders] = useState<ITeamMemberTypeMap>({});
  const [speakers, setSpeakers] = useState<ITeamMemberTypeMap>({});
  const teams = useTeams();

  const load = useCallback(async () => {
    setLoading(true);
    const plansResult = await getPlansBetween(startDate, endDate);
    setPlans(plansResult);
    const teamMembersForAllPlans = await Promise.all(
      plansResult.map((plan) => getTeamMembersForPlan(plan.id))
    );
    setWorshipLeaders(
      createMapOfTeamMemberType(
        "Teamleder",
        plansResult,
        teamMembersForAllPlans
      )
    );
    setSpeakers(
      createMapOfTeamMemberType("Taler", plansResult, teamMembersForAllPlans)
    );
    setLoading(false);
  }, [startDate, endDate]);

  useEffect(() => {
    load();
  }, [load]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextPlan = plans.filter((plan) => plan.sortDate >= today).shift();

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
              <th>Taleserie</th>
              <th>Tema</th>
              <th>Taler</th>
              <th>Lovsangsleder</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr
                key={plan.id}
                className={plan === nextPlan ? classes.activeRow : ""}
              >
                <td>{formatDate(plan.sortDate)}</td>
                <td>{plan.seriesTitle}</td>
                <td>
                  <a
                    className={classes.planLink}
                    href={`https://planningcenteronline.com/plans/${plan.id}`}
                  >
                    {plan.title}
                  </a>
                </td>
                <td>{speakers[plan.id].map((m) => m.name).join(", ")}</td>
                <td>
                  {worshipLeaders[plan.id]
                    .map((m) => {
                      const team = teams.find((t) =>
                        t.members.some(
                          (m2) => m2.id === m.personId && m2.isLeader
                        )
                      );
                      return team ? `${m.name} (${team.name})` : m.name;
                    })
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
