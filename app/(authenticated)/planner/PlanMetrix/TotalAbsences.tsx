import { MemberWithBlockouts } from "@/types";
import { Plan } from "@prisma/client";

type Props = {
  members: MemberWithBlockouts[];
  plans: Plan[];
  teamOrder: (string | undefined)[];
};
export const TotalAbsences = ({ members, plans, teamOrder }: Props) => {
  const totalAbsences = teamOrder
    .map(
      (teamId, p) =>
        members
          .filter((member) => member.teamId === teamId)
          .filter((member) =>
            member.blockouts.some(
              (blockout) =>
                plans[p].date >= blockout.startsAt &&
                plans[p].date <= blockout.endsAt
            )
          ).length
    )
    .reduce((a, b) => a + b, 0);
  return (
    <div>
      <h2>Totalt antall fravær</h2>
      <p>{totalAbsences}</p>
    </div>
  );
};
