import { useCallback, useState } from "react";
import { createUseStyles } from "react-jss";
import { Button, Spinner } from "components";
import {
  getBlockoutDatesForPerson,
  getPlansBetween,
  getTeamMembersForPlan,
} from "clients/serviceClient";
import {
  IPlan,
  ITeam,
  ITeamMemberWithBlockoutDates,
  ITeamWithBlockouts,
  PlanTeamMembersMap,
} from "types";
import { TeamBlockouts } from "./TeamBlockouts";
import { DateInput } from "components/_basis/DateInput";
import { useEffect } from "react";
import { getEndOfSemester, getStartOfSemester } from "utils/dates";
import { useTeams } from "hooks/useTeams";
import { PlanSummary } from "./PlanSummary";
import { exportBlockoutsToExcel } from "utils/exportBlockoutsToExcel";

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
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [planTeamMembers, setPlanTeamMembers] = useState<PlanTeamMembersMap>(
    {}
  );
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
    const planResult = await getPlansBetween(startDate, endDate);
    const planTeamMembersResult = (
      await Promise.all(
        planResult.map(async (plan) => ({
          planId: plan.id,
          teamMembers: await getTeamMembersForPlan(plan.id),
        }))
      )
    ).reduce((dict, plan) => {
      dict[plan.planId] = plan.teamMembers;
      return dict;
    }, {} as PlanTeamMembersMap);
    setPlans(planResult);
    setPlanTeamMembers(planTeamMembersResult);
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
      )}
    </div>
  );
};
