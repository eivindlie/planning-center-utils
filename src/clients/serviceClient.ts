import { IBlockoutDate, IPlan, IPlanTeamMember } from "types";
import {
  IApiBlockoutDate,
  IApiPlan,
  IApiPlanTeamMember,
} from "types/contractTypes";
import { get } from "utils/crud";

const BASE_URL = "https://api.planningcenteronline.com/services/v2";
const LØRDAGSMØTET_SERVICE_TYPE = "1178319";

export const getPlans = async (): Promise<IPlan[]> => {
  const result = (await get(
    `${BASE_URL}/service_types/${LØRDAGSMØTET_SERVICE_TYPE}/plans?order=sort_date`
  )) as IApiPlan[];

  return result.map(
    (plan) =>
      ({
        id: plan.id,
        title: plan.attributes.title,
        createdAt: new Date(plan.attributes.created_at),
        updatedAt: new Date(plan.attributes.updated_at),
        sortDate: new Date(plan.attributes.sort_date),
      } as IPlan)
  );
};

export const getPlansBetween = async (
  from: Date,
  to: Date
): Promise<IPlan[]> => {
  const allPlans = await getPlans();

  return allPlans.filter(
    (plan) => plan.sortDate >= from && plan.sortDate <= to
  );
};

export const getBlockoutDatesForPerson = async (
  personId: string
): Promise<IBlockoutDate[]> => {
  const result = (await get(
    `${BASE_URL}/people/${personId}/blockout_dates`
  )) as IApiBlockoutDate[];

  return result.map(mapBlockoutDate);
};

export const getTeamMembersForPlan = async (
  planId: string
): Promise<IPlanTeamMember[]> => {
  const result = (await get(
    `${BASE_URL}/service_types/${LØRDAGSMØTET_SERVICE_TYPE}/plans/${planId}/team_members`
  )) as IApiPlanTeamMember[];

  return result.map(mapPlanTeamMember);
};

const mapBlockoutDate = (blockoutDate: IApiBlockoutDate): IBlockoutDate => ({
  id: blockoutDate.id,
  reason: blockoutDate.attributes.reason,
  startsAt: new Date(blockoutDate.attributes.starts_at),
  endsAt: new Date(blockoutDate.attributes.ends_at),
});

const mapPlanTeamMember = (
  planTeamMember: IApiPlanTeamMember
): IPlanTeamMember => ({
  id: planTeamMember.id,
  name: planTeamMember.attributes.name,
  status: planTeamMember.attributes.status,
  teamPositionName: planTeamMember.attributes.team_position_name,
  photoThumbnail: planTeamMember.attributes.photo_thumbnail,
});
