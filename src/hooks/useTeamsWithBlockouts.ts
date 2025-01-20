import { useState } from "react";
import { ITeamWithBlockouts } from "types";

export const useTeamsWithBlockouts = () => {
    const [teamsWithBlockouts, setTeamsWithBlockouts] = useState<ITeamWithBlockouts[]>([]);

    
};