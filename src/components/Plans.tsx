import { useEffect, useState } from "react";
import { getPlansBetween } from "clients/serviceClient";
import { IPlan } from "types";

export const Plans = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);

  useEffect(() => {
    getPlansBetween(new Date(2022, 1, 1), new Date(2022, 4, 1)).then((result) =>
      setPlans(result)
    );
  }, []);

  return (
    <ul>
      {plans.map((plan) => (
        <li key={plan.id}>
          {plan.sortDate.toLocaleDateString()}: {plan.title}
        </li>
      ))}
    </ul>
  );
};
