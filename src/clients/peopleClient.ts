import { IPerson } from "types";
import { IApiPerson } from "types/contractTypes";
import { get } from "utils/crud";

const BASE_URL = "https://api.planningcenteronline.com/people/v2";

export const getPeople = async (): Promise<IPerson[]> => {
  const result = (await get(`${BASE_URL}/people?per_page=100`)) as IApiPerson[];
  return result.map(mapPerson);
};

export const searchByName = async (query: string): Promise<IPerson[]> => {
  const result = await get(`${BASE_URL}/people?where[search_name]=${query}`);

  return result.map(mapPerson);
};

const mapPerson = (person: IApiPerson): IPerson => ({
  id: person.id,
  firstName: person.attributes.first_name,
  givenName: person.attributes.given_name,
  middleName: person.attributes.middle_name,
  lastName: person.attributes.last_name,
  nickname: person.attributes.nickname,
  child: person.attributes.child,
});
