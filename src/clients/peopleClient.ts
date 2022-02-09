import { IPerson } from "../types";
import { IApiPerson } from "../types/contractTypes";
import { get } from "../utils/crud";

const BASE_URL = "https://api.planningcenteronline.com/people/v2";

export const getPeople = async (): Promise<IPerson[]> => {
  const result = (await get(`${BASE_URL}/people?per_page=100`)) as IApiPerson[];
  return result.map((person) => ({
    id: person.id,
    firstName: person.attributes.first_name,
    givenName: person.attributes.given_name,
    middleName: person.attributes.middle_name,
    lastName: person.attributes.last_name,
    nickname: person.attributes.nickname,
    child: person.attributes.child,
  }));
};
