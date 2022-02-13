import { createUseStyles } from "react-jss";
import { COLORS } from "style/variables";
import { IPlan, ITeamMemberWithBlockoutDates } from "types";

const useStyles = createUseStyles({
  table: {
    borderCollapse: "collapse",
    tableLayout: "fixed",
    whiteSpace: "nowrap",

    "& th, & td": {
      border: `1px solid ${COLORS.foreground}`,
      width: "25px",
      padding: "5px",
    },
    "& th": {
      writingMode: "vertical-lr",
    },
  },
  nameCell: {
    width: "200px",
  },
  blocked: {
    background: COLORS.danger,
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
    <div>
      <h2>{teamName}</h2>
      <table className={classes.table}>
        <thead>
          <tr>
            <th className={classes.nameCell}></th>
            {plans.map((plan) => (
              <th key={plan.id}>{plan.sortDate.toLocaleDateString()}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((member) => (
            <tr key={member.member.id}>
              <td className={classes.nameCell}>{member.member.fullName}</td>
              {plans.map((plan) => (
                <td
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
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
