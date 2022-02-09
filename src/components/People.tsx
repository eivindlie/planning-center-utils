import { useEffect, useState } from "react";
import { getPeople } from "../clients/peopleClient";
import { IPerson } from "../types";

export const People = () => {
  const [people, setPeople] = useState<IPerson[]>([]);

  useEffect(() => {
    getPeople().then((result) => setPeople(result));
  }, []);

  return (
    <ul>
      {people.map((person) => (
        <li key={person.id}>
          {person.firstName} {person.middleName ? `${person.middleName} ` : ""}
          {person.lastName}
        </li>
      ))}
    </ul>
  );
};
