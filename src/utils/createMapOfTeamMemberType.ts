import { IPlan, IPlanTeamMember } from "types";

export interface ITeamMemberTypeMap {
  [planId: string]: IPlanTeamMember[];
}

export const createMapOfTeamMemberType = (
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
