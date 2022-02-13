import { useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { Button } from ".";
import { IPerson, ITeam, ITeamMember } from "../types";
import { PersonPicker } from "./PersonPicker";
import { TextInput } from "./_basis/TextInput";

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
  memberTable: {
    width: "fit-content",
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

  const removeTeamMember = (member: ITeamMember) => {
    if (!activeTeam) {
      return;
    }

    const team = {
      ...activeTeam,
      members: activeTeam?.members.filter((m) => m.id !== member.id),
    };
    setActiveTeam(team);
    setTeams(
      [...teams.filter((t) => t.id !== team.id), team].sort(
        (a, b) => a.id - b.id
      )
    );
    saveTeams();
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
        <TextInput
          value={newTeamName}
          onInput={(e) => setNewTeamName(e.currentTarget.value)}
          onKeyPress={(e) => e.key === "Enter" && createTeam()}
        />
        <Button onClick={createTeam}>Legg til team</Button>
      </div>
      <div className={classes.teamPicker}>
        {teams.map((team) => (
          <Button
            type={team === activeTeam ? "primary" : "secondary"}
            key={team.id}
            onClick={() => setActiveTeam(team)}
          >
            {team.name}
          </Button>
        ))}
      </div>
      <table className={classes.memberTable}>
        <tbody>
          {activeTeam?.members.map((member) => (
            <tr key={member.id}>
              <td>{member.fullName}</td>
              <td>
                <Button onClick={() => removeTeamMember(member)} type="danger">
                  <i className="las la-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PersonPicker onPersonSelected={(person) => addTeamMember(person)} />
    </section>
  );
};
