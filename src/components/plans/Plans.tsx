import { useCallback, useEffect, useState } from "react";
import { getPlansBetween } from "clients/serviceClient";
import { IPlan } from "types";
import { getEndOfSemester, getStartOfSemester } from "utils/dates";
import { Spinner } from "components/_basis/Spinner";
import { createUseStyles } from "react-jss";
import { DateInput } from "components/_basis/DateInput";
import { Button } from "components/_basis/Button";

const useStyles = createUseStyles({
  wrapper: {},
  dateInput: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },
});

export const Plans = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(getStartOfSemester());
  const [endDate, setEndDate] = useState(getEndOfSemester());

  const load = useCallback(async () => {
    setLoading(true);
    setPlans(await getPlansBetween(startDate, endDate));
    setLoading(false);
  }, [startDate, endDate]);

  console.log(plans);
  useEffect(() => {
    load();
  }, [load]);

  const classes = useStyles();
  return (
    <>
      <div className={classes.dateInput}>
        <DateInput value={startDate} onChange={(date) => setStartDate(date)} />
        <DateInput value={endDate} onChange={(date) => setEndDate(date)} />
        <Button onClick={() => load()}>Hent oversikt</Button>
      </div>
      {loading && <Spinner />}
      {!loading && (
        <ul>
          {plans.map((plan) => (
            <li key={plan.id}>
              {plan.sortDate.toLocaleDateString()}: {plan.title}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
