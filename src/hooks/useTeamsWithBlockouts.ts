import { getBlockoutDatesForPerson } from "clients/serviceClient";
import { useEffect, useState } from "react";
import {
  IPlan,
  ITeam,
  ITeamMemberWithBlockoutDates,
  ITeamWithBlockouts,
} from "types";

export const useTeamsWithBlockouts = (teams: ITeam[], plans: IPlan[]) => {
  const [teamsWithBlockouts, setTeamsWithBlockouts] = useState<
    ITeamWithBlockouts[]
  >([]);
  const [loading, setLoading] = useState(false);

  const getBlockoutsForTeam = async (
    team: ITeam
  ): Promise<ITeamMemberWithBlockoutDates[]> => {
    return await Promise.all(
      team.members.map(
        async (member) =>
          ({
            member: member,
            blockoutDates: await getBlockoutDatesForPerson(member.id),
          } as ITeamMemberWithBlockoutDates)
      )
    );
  };

  useEffect(() => {
    const updateBlockouts = async () => {
      if (!plans.length || !teams.length) return;
      setLoading(true);
      setTeamsWithBlockouts(
        await Promise.all(
          teams.map(
            async (team) =>
              ({
                id: team.id,
                teamName: team.name,
                membersWithBlockouts: await getBlockoutsForTeam(team),
              } as ITeamWithBlockouts)
          )
        )
      );
      setLoading(false);
    };
    updateBlockouts();
  }, [teams, plans]);

  return { teamsWithBlockouts, loading };
};
