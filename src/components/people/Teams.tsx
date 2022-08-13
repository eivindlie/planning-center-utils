import { useState } from "react";
import { createUseStyles } from "react-jss";
import { Button } from "components";
import { IPerson, ITeam, ITeamMember } from "types";
import { PersonPicker } from "components/people/PersonPicker";
import { TextInput } from "components/_basis/TextInput";
import { COLORS } from "style/variables";
import { useTeams } from "hooks/useTeams";
import { addTeam, deleteTeam, saveTeam } from "firestore/teams";

const useStyles = createUseStyles({
  teams: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  newTeam: {
    display: "flex",
    gap: 10,
    borderBottom: `1px solid ${COLORS.border}`,
    paddingBottom: 20,
  },
  teamPicker: {
    marginTop: 25,
    display: "flex",
    gap: "10px",
  },
  memberTable: {
    marginTop: 15,
    width: "fit-content",

    "& td": {
      padding: "3px 10px",
    },
  },
  personPickerWrapper: {
    marginTop: 50,
    borderTop: `1px solid ${COLORS.border}`,
  },
});

export const Teams = () => {
  const teams = useTeams();
  const [activeTeamId, setActiveTeamId] = useState<string | undefined>(
    undefined
  );
  const activeTeam = teams.find((team) => team.id === activeTeamId);
  const [newTeamName, setNewTeamName] = useState("");

  const createTeam = () => {
    addTeam({
      name: newTeamName,
      members: [],
      id: "",
    });
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
    saveTeam(team);
  };

  const toggleTeamLeader = (member: ITeamMember) => {
    if (!activeTeam) {
      return;
    }
    const team = {
      ...activeTeam,
      members: activeTeam.members.map((m) => {
        if (m.id === member.id) {
          return {
            ...m,
            isLeader: !m.isLeader,
          };
        }
        return m;
      }),
    };
    saveTeam(team);
  };

  const removeTeamMember = (member: ITeamMember) => {
    if (!activeTeam) {
      return;
    }

    if (
      !window.confirm(
        `Er du sikker på at du vil fjerne ${member.fullName} fra ${activeTeam.name}?`
      )
    ) {
      return;
    }

    const team = {
      ...activeTeam,
      members: activeTeam?.members.filter((m) => m.id !== member.id),
    };
    saveTeam(team);
  };

  const removeTeam = (team: ITeam) => {
    if (
      !window.confirm(`Er du sikker på at du vil slette teamet ${team.name}?`)
    ) {
      return;
    }
    deleteTeam(team);
    setActiveTeamId(undefined);
  };

  const classes = useStyles();
  return (
    <section className={classes.teams}>
      <h3>Legg til team</h3>
      <div className={classes.newTeam}>
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
            onClick={() => setActiveTeamId(team.id)}
          >
            {team.name}
          </Button>
        ))}
      </div>
      {activeTeam && (
        <>
          <table className={classes.memberTable}>
            <tbody>
              {activeTeam?.members.map((member) => (
                <tr key={member.id}>
                  <td>{member.fullName}</td>
                  <td>
                    <Button
                      onClick={() => toggleTeamLeader(member)}
                      type={!!member.isLeader ? "primary" : "secondary"}
                      title={
                        member.isLeader ? "Fjern som leder" : "Sett som leder"
                      }
                    >
                      <i className="las la-crown"></i>
                    </Button>
                    &nbsp;
                    <Button
                      onClick={() => removeTeamMember(member)}
                      type="danger"
                    >
                      <i className="las la-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <span>
            <Button onClick={() => removeTeam(activeTeam)} type="danger">
              Slett valgt team
            </Button>
          </span>
        </>
      )}
      {activeTeam && (
        <div className={classes.personPickerWrapper}>
          <h3>Legg til medlem i team</h3>
          <PersonPicker onPersonSelected={(person) => addTeamMember(person)} />
        </div>
      )}
    </section>
  );
};
