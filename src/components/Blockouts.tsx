import { useCallback, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Spinner } from ".";
import { getBlockoutDatesForPerson, getPlans } from "../clients/serviceClient";
import { IPlan, ITeam, ITeamMemberWithBlockoutDates } from "../types";
import { TeamBlockouts } from "./TeamBlockouts";
import { LOCALSTORAGE_TEAMS_KEY } from "./Teams";

const useStyles = createUseStyles({
  wrapper: {},
});

interface ITeamWithBlockouts {
  teamName: string;
  membersWithBlockouts: ITeamMemberWithBlockoutDates[];
}

export const Blockouts = () => {
  const [teams, setTeams] = useState<ITeamWithBlockouts[]>([]);
  const [plans, setPlans] = useState<IPlan[]>([]);
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

  const init = useCallback(async () => {
    setLoading(true);
    setPlans(await getPlans());
    const teamsStringValue = localStorage.getItem(LOCALSTORAGE_TEAMS_KEY);
    if (!teamsStringValue) {
      return;
    }
    const teams = (JSON.parse(teamsStringValue) as ITeam[]).sort(
      (a, b) => a.id - b.id
    );
    setTeams(
      await Promise.all(
        teams.map(
          async (team) =>
            ({
              teamName: team.name,
              membersWithBlockouts: await getBlockoutsForTeam(team),
            } as ITeamWithBlockouts)
        )
      )
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      {loading && <Spinner />}
      {!loading &&
        teams.map((team) => (
          <TeamBlockouts
            teamMembers={team.membersWithBlockouts}
            teamName={team.teamName}
            plans={plans}
          />
        ))}
    </div>
  );
};
