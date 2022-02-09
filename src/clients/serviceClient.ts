import { IPlan } from "../types/contractTypes";
import { get } from "../utils/crud";

const BASE_URL = "https://api.planningcenteronline.com/services/v2";
const LØRDAGSMØTET_SERVICE_TYPE = "1178319";

export const getPlans = async (): Promise<IPlan[]> => {
  const result = await get(
    `${BASE_URL}/service_types/${LØRDAGSMØTET_SERVICE_TYPE}/plans?order=sort_date`
  );
  return result;
};

export const getPlansBetween = async (
  from: Date,
  to: Date
): Promise<IPlan[]> => {
  const allPlans = await getPlans();

  return allPlans.filter((plan) => {
    const planDate = new Date(plan.attributes.sort_date);
    return planDate >= from && planDate <= to;
  });
};
