import { getTeamMembersForPlan } from "clients/serviceClient";
import { Spinner } from "components/_basis/Spinner";
import { useCallback, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { IPlan, ITeam } from "types";
import {
  createMapOfTeamMemberType,
  ITeamMemberTypeMap,
} from "utils/createMapOfTeamMemberType";
import { formatDate } from "utils/dates";

const useStyles = createUseStyles({
  date: {
    writingMode: "vertical-lr",
  },
  teamName: {
    writingMode: "vertical-lr",
  },
  title: {
    gridColumn: "1 / -1",
    border: "none !important",
    marginTop: "30px",
    marginBottom: "10px",
  },
});

interface IProps {
  plans: IPlan[];
  teams: ITeam[];
  parentLoading: boolean;
}
export const PlanSummary = ({ plans, teams, parentLoading }: IProps) => {
  const [loading, setLoading] = useState(false);
  const [worshipLeaders, setWorshipLeaders] = useState<ITeamMemberTypeMap>({});

  const load = useCallback(async () => {
    if (parentLoading) return;
    setLoading(true);
    const teamMembersForAllPlans = await Promise.all(
      plans.map((plan) => getTeamMembersForPlan(plan.id))
    );
    setWorshipLeaders(
      createMapOfTeamMemberType("Teamleder", plans, teamMembersForAllPlans)
    );
    setLoading(false);
  }, [parentLoading, plans]);

  const getTeamName = (plan: IPlan): string => {
    const planTeams =
      (worshipLeaders[plan.id]
        ?.flatMap((m) => {
          const team = teams.find((t) =>
            t.members.some((m2) => m2.id === m.personId && m2.isLeader)
          );
          return team;
        })
        .filter((t) => !!t) as ITeam[]) ?? [];
    if (planTeams.length === 1) {
      return planTeams[0].name;
    }
    return "";
  };

  useEffect(() => {
    load();
  }, [load]);

  const classes = useStyles();
  if (parentLoading) return <></>;
  return (
    <>
      {loading && <Spinner />}
      {!loading && (
        <>
          <h2 className={classes.title}>Turnus</h2>
          <div></div>
          {plans.map((plan) => (
            <div key={plan.id} className={classes.date}>
              {formatDate(plan.sortDate)}
            </div>
          ))}
          <div></div>
          {plans.map((plan) => (
            <div key={plan.id} className={classes.teamName}>
              {getTeamName(plan)}
            </div>
          ))}
        </>
      )}
    </>
  );
};
