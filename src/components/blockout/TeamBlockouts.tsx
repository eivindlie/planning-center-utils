import { Fragment } from "react";
import { createUseStyles } from "react-jss";
import { COLORS } from "style/variables";
import {
  IBlockoutDate,
  IPlan,
  IPlanTeamMember,
  ITeamMemberWithBlockoutDates,
  PlanTeamMembersMap,
} from "types";
import { createMapOfTeamMemberType } from "utils/createMapOfTeamMemberType";
import { formatDate } from "utils/dates";

const useStyles = createUseStyles({
  activeTeam: {
    background: COLORS.backgroundHighlight,
  },
  date: {
    writingMode: "vertical-lr",

    "& > a": {
      color: "inherit",
    },
  },
  memberName: {
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
  confirmed: {
    background: COLORS.success,
  },
  title: {
    gridColumn: "1 / -1",
    border: "none !important",
    marginTop: "30px",
    marginBottom: "10px",
  },
  passedDate: {
    filter: "brightness(0.4)",
  },
});

const LOVSANG_TEAM_ID = "4668573";

const getBlockout = (
  member: ITeamMemberWithBlockoutDates,
  plan: IPlan
): IBlockoutDate | undefined => {
  return member.blockoutDates.find(
    (blockoutDate) =>
      blockoutDate.startsAt <= plan.sortDate &&
      blockoutDate.endsAt >= plan.sortDate
  )!;
};

const isBlocked = (
  member: ITeamMemberWithBlockoutDates,
  plan: IPlan
): boolean => {
  return getBlockout(member, plan) !== undefined;
};

const getOtherAssignment = (
  member: ITeamMemberWithBlockoutDates,
  plan: IPlan,
  planTeamMembersMap: PlanTeamMembersMap
): IPlanTeamMember | undefined => {
  const planTeamMembers = planTeamMembersMap[plan.id] ?? [];
  return planTeamMembers.find(
    (teamMember) =>
      teamMember.personId === member.member.id &&
      teamMember.teamId !== LOVSANG_TEAM_ID &&
      teamMember.status !== "D"
  );
};

const isPartlyBlocked = (
  member: ITeamMemberWithBlockoutDates,
  plan: IPlan,
  planTeamMembersMap: PlanTeamMembersMap
): boolean => {
  return getOtherAssignment(member, plan, planTeamMembersMap) !== undefined;
};

const isConfirmed = (
  member: ITeamMemberWithBlockoutDates,
  plan: IPlan,
  planTeamMembersMap: PlanTeamMembersMap
): boolean => {
  return (
    planTeamMembersMap[plan.id]?.find(
      (teamMember) =>
        teamMember.personId === member.member.id &&
        teamMember.teamId === LOVSANG_TEAM_ID &&
        teamMember.status === "C"
    ) !== undefined
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

  const teamLeaderMap = createMapOfTeamMemberType(
    "Teamleder",
    plans,
    plans.map((p) => planTeamMembers[p.id])
  );

  const isActiveTeam = (plan: IPlan) => {
    const leaders = teamLeaderMap[plan.id];
    return leaders.some((l) =>
      teamMembers.some((m) => m.member.isLeader && l.personId === m.member.id)
    );
  };

  return (
    <>
      <h2 className={classes.title}>{teamName}</h2>
      <>
        <div></div>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`${classes.date} ${
              isActiveTeam(plan) ? classes.activeTeam : ""
            } ${plan.sortDate < new Date() ? classes.passedDate : ""}`}
          >
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
            <div className={classes.memberName}>
              <a
                href={`https://planningcenteronline.com/people/AC${member.member.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {member.member.fullName}
              </a>
            </div>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`${isActiveTeam(plan) ? classes.activeTeam : ""} ${
                  isBlocked(member, plan)
                    ? classes.blocked
                    : isPartlyBlocked(member, plan, planTeamMembers)
                    ? classes.partlyBlocked
                    : isConfirmed(member, plan, planTeamMembers)
                    ? classes.confirmed
                    : ""
                }  ${plan.sortDate < new Date() ? classes.passedDate : ""}`}
                title={
                  isConfirmed(member, plan, planTeamMembers)
                    ? "Bekreftet"
                    : isBlocked(member, plan)
                    ? `Blockout${
                        getBlockout(member, plan)?.reason
                          ? `: ${getBlockout(member, plan)?.reason}`
                          : ""
                      }`
                    : isPartlyBlocked(member, plan, planTeamMembers)
                    ? `Annen tjeneste: ${
                        getOtherAssignment(member, plan, planTeamMembers)
                          ?.teamPositionName
                      }`
                    : ""
                }
              ></div>
            ))}
          </Fragment>
        ))}
        <>
          <div className={classes.totalTitleCell}>Totalt</div>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`${isActiveTeam(plan) ? classes.activeTeam : ""}  ${
                plan.sortDate < new Date() ? classes.passedDate : ""
              }`}
            >
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
