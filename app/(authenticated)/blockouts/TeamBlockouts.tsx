import { Blockout, Member, Plan, Team } from "@prisma/client";
import styles from "./TeamBlockouts.module.css";
import { formatDate } from "@/utils/formatDate";
import classNames from "classnames";
import { Fragment } from "react";
type MemberWithBlockouts = Member & { blockouts: Blockout[] };
type Props = {
  team: Team;
  plans: Plan[];
  members: MemberWithBlockouts[];
};
export const TeamBlockouts = ({ team, members, plans }: Props) => {
  const isBlockout = (member: MemberWithBlockouts, date: Date) => {
    return member.blockouts.some(
      (blockout) => blockout.startsAt <= date && date <= blockout.endsAt
    );
  };
  const getBlockoutClass = (member: MemberWithBlockouts, date: Date) => {
    if (isBlockout(member, date)) {
      return styles.blockedOut;
    }
  };

  const getBlockoutDescription = (
    member: MemberWithBlockouts,
    date: Date
  ): string => {
    const blockout = member.blockouts.find(
      (blockout) => blockout.startsAt <= date && date <= blockout.endsAt
    );
    if (blockout) {
      return blockout.reason ? `Blockout: ${blockout.reason}` : "Blockout";
    }
    return "";
  };
  return (
    <>
      <h2 className={styles.title}>{team.name}</h2>
      <>
        <div></div>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={classNames(styles.dateCell, styles.cell)}
          >
            {formatDate(plan.date)}
          </div>
        ))}
      </>

      <>
        {members.map((member) => (
          <Fragment key={member.id}>
            <div className={styles.cell}>{member.name}</div>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={classNames(
                  styles.cell,
                  getBlockoutClass(member, plan.date)
                )}
                title={getBlockoutDescription(member, plan.date)}
              ></div>
            ))}
          </Fragment>
        ))}
      </>
      <>
        <div className={styles.cell}>Totalt</div>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={classNames(styles.cell, styles.totalCell)}
          >
            {members.filter((member) => isBlockout(member, plan.date)).length}
          </div>
        ))}
      </>
    </>
  );
};
