import { Blockout, Member, Plan, Team } from "@prisma/client";
import styles from "./TeamBlockouts.module.css";
import { formatDate } from "@/utils/formatDate";
type MemberWithBlockouts = Member & { blockouts: Blockout[] };
type Props = {
  team: Team;
  plans: Plan[];
  members: MemberWithBlockouts[];
};
export const TeamBlockouts = ({ team, members, plans }: Props) => {
  const getBlockoutClass = (member: MemberWithBlockouts, date: Date) => {
    if (
      member.blockouts.some(
        (blockout) => blockout.startsAt <= date && date <= blockout.endsAt
      )
    ) {
      return styles.blockedOut;
    }
  };

  const getBlockoutDescription = (member: MemberWithBlockouts, date: Date): string => {
    const blockout = member.blockouts.find(
      (blockout) => blockout.startsAt <= date && date <= blockout.endsAt
    );
    if (blockout) {
      return blockout.reason ? `Blockout: ${blockout.reason}` : "Blockout";
    }
    return "";
  };
  return (
    <div>
      <h2>{team.name}</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            {plans.map((plan) => (
              <th className={styles.dateCell} key={plan.id}>
                {formatDate(plan.date)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              {plans.map((plan) => (
                <td
                  key={plan.id}
                  className={`${styles.blockoutCell} ${getBlockoutClass(
                    member,
                    plan.date
                  )}`}
                  title={getBlockoutDescription(member, plan.date)}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
