import { IPlan } from "../types";
import { IApiPlan } from "../types/contractTypes";
import { get } from "../utils/crud";

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
