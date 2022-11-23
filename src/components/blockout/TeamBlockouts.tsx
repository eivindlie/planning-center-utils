import { Fragment } from "react";
import { createUseStyles } from "react-jss";
import { COLORS } from "style/variables";
import { IPlan, ITeamMemberWithBlockoutDates, PlanTeamMembersMap } from "types";
import { formatDate } from "utils/dates";

const useStyles = createUseStyles({
  date: {
    writingMode: "vertical-lr",

    "& > a": {
      color: "inherit",
    },
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
  partlyBlocked: {
    background: COLORS.warning,
  },
  title: {
    gridColumn: "1 / -1",
    border: "none !important",
    marginTop: "30px",
    marginBottom: "10px",
  },
});

const LOVSANG_TEAM_POSITIONS = [
  "Akustisk Gitar",
  "Bass",
  "El-gitar",
  "Keys",
  "Saksofon",
  "Teamleder",
  "Trommer",
  "Vokal",
];

const isBlocked = (
  member: ITeamMemberWithBlockoutDates,
  plan: IPlan
): boolean => {
  return member.blockoutDates.some(
    (blockoutDate) =>
      blockoutDate.startsAt <= plan.sortDate &&
      blockoutDate.endsAt >= plan.sortDate
  );
};

const isPartlyBlocked = (
  member: ITeamMemberWithBlockoutDates,
  plan: IPlan,
  planTeamMembersMap: PlanTeamMembersMap
): boolean => {
  const planTeamMembers = planTeamMembersMap[plan.id] ?? [];
  return planTeamMembers.some(
    (teamMember) =>
      teamMember.personId === member.member.id &&
      !LOVSANG_TEAM_POSITIONS.includes(teamMember.teamPositionName)
  );
};

export interface IProps {
  teamMembers: ITeamMemberWithBlockoutDates[];
  teamName: string;
  plans: IPlan[];
  planTeamMembers: PlanTeamMembersMap;
}
export const TeamBlockouts = ({
  teamName,
  teamMembers,
  plans,
  planTeamMembers,
}: IProps) => {
  const classes = useStyles();
  return (
    <>
      <h2 className={classes.title}>{teamName}</h2>
      <>
        <div></div>
        {plans.map((plan) => (
          <div key={plan.id} className={classes.date}>
            <a
              href={`https://planningcenteronline.com/plans/${plan.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {formatDate(plan.sortDate)}
            </a>
          </div>
        ))}

        {teamMembers.map((member) => (
          <Fragment key={member.member.id}>
            <div>{member.member.fullName}</div>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={
                  isBlocked(member, plan)
                    ? classes.blocked
                    : isPartlyBlocked(member, plan, planTeamMembers)
                    ? classes.partlyBlocked
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
                teamMembers.filter(
                  (member) =>
                    isBlocked(member, plan) ||
                    isPartlyBlocked(member, plan, planTeamMembers)
                ).length
              }
            </div>
          ))}
        </>
      </>
    </>
  );
};
