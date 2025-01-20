import { getPlansBetween, getTeamMembersForPlan } from "clients/serviceClient";
import { useCallback, useEffect, useState } from "react";
import { IPlan, PlanTeamMembersMap } from "types";

export const usePlans = (startDate: Date, endDate: Date) => {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [planTeamMembers, setPlanTeamMembers] = useState<PlanTeamMembersMap>(
    {}
  );

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

  return { plans, planTeamMembers, loading, loadPlans };
};
