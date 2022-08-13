import { Fragment } from "react";
import { createUseStyles } from "react-jss";
import { COLORS } from "style/variables";
import { IPlan, ITeamMemberWithBlockoutDates } from "types";
import { formatDate } from "utils/dates";

const useStyles = createUseStyles({
  date: {
    writingMode: "vertical-lr",
  },
  totalRow: {
    "& td": {
      borderTop: `3px solid ${COLORS.foreground}`,
    },
  },
  totalTitleCell: {
    fontStyle: "italic",
  },
  blocked: {
    background: COLORS.danger,
  },
  title: {
    gridColumn: "1 / -1",
    border: "none !important",
  },
});

export interface IProps {
  teamMembers: ITeamMemberWithBlockoutDates[];
  teamName: string;
  plans: IPlan[];
}
export const TeamBlockouts = ({ teamName, teamMembers, plans }: IProps) => {
  const classes = useStyles();
  return (
    <>
      <h2 className={classes.title}>{teamName}</h2>
      <>
        <div></div>
        {plans.map((plan) => (
          <div key={plan.id} className={classes.date}>
            {formatDate(plan.sortDate)}
          </div>
        ))}

        {teamMembers.map((member) => (
          <Fragment key={member.member.id}>
            <div>{member.member.fullName}</div>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={
                  member.blockoutDates.some(
                    (blockoutDate) =>
                      blockoutDate.startsAt <= plan.sortDate &&
                      blockoutDate.endsAt >= plan.sortDate
                  )
                    ? classes.blocked
                    : ""
                }
              ></div>
            ))}
          </Fragment>
        ))}
        <>
          <div className={classes.totalTitleCell}>Totalt</div>
          {plans.map((plan) => (
            <div key={plan.id}>
              {
                teamMembers.filter((member) =>
                  member.blockoutDates.some(
                    (blockoutDate) =>
                      blockoutDate.startsAt <= plan.sortDate &&
                      blockoutDate.endsAt >= plan.sortDate
                  )
                ).length
              }
            </div>
          ))}
        </>
      </>
    </>
  );
};
