import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { IPerson, ITeam, ITeamMember } from "../types";
import { PersonPicker } from "./PersonPicker";

const useStyles = createUseStyles({
  teams: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  teamPicker: {
    display: "flex",
    gap: "10px",
  },
  button: {
    border: "none",
  },
  activeButton: {
    background: "#00f0f8",
  },
});

export const LOCALSTORAGE_TEAMS_KEY = "planningcenter.teams";

export const Teams = () => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [activeTeam, setActiveTeam] = useState<ITeam | undefined>();
  const [newTeamName, setNewTeamName] = useState("");

  const createTeam = () => {
    setTeams([
      ...teams,
      {
        name: newTeamName,
        members: [],
        id: Math.max(1, ...teams.map((team) => team.id + 1)),
      } as ITeam,
    ]);
    setNewTeamName("");
  };

  const addTeamMember = (member: IPerson) => {
    if (!activeTeam) {
      return;
    }
    const team = {
      ...activeTeam,
      members: [
        ...activeTeam.members,
        {
          id: member.id,
          fullName: `${member.firstName} ${
            member.middleName ? `${member.middleName} ` : ""
          }${member.lastName}`,
        } as ITeamMember,
      ],
    };
    setActiveTeam(team);
    setTeams(
      [...teams.filter((t) => t.id !== team.id), team].sort(
        (a, b) => a.id - b.id
      )
    );
  };

  const saveTeams = () => {
    localStorage.setItem(LOCALSTORAGE_TEAMS_KEY, JSON.stringify(teams));
  };

  const loadTeams = () => {
    const stringValue = localStorage.getItem(LOCALSTORAGE_TEAMS_KEY);
    if (stringValue) {
      setTeams(
        (JSON.parse(stringValue) as ITeam[]).sort((a, b) => a.id - b.id)
      );
    }
  };

  useEffect(loadTeams, []);
  useEffect(saveTeams, [teams]);

  const classes = useStyles();
  return (
    <section className={classes.teams}>
      <div>
        <input
          type="text"
          value={newTeamName}
          onInput={(e) => setNewTeamName(e.currentTarget.value)}
          onKeyPress={(e) => e.key === "Enter" && createTeam()}
        />
        <button onClick={createTeam}>Legg til team</button>
      </div>
      <div className={classes.teamPicker}>
        {teams.map((team) => (
          <button
            className={`${classes.button} ${
              team === activeTeam ? classes.activeButton : ""
            }`}
            key={team.id}
            onClick={() => setActiveTeam(team)}
          >
            {team.name}
          </button>
        ))}
      </div>
      <ul>
        {activeTeam?.members.map((member) => (
          <li key={member.id}>{member.fullName}</li>
        ))}
      </ul>
      <PersonPicker onPersonSelected={(person) => addTeamMember(person)} />
    </section>
  );
};
