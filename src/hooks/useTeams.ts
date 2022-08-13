import { useAuthUser } from "contexts/AuthUserContext";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ITeam } from "types";

export const useTeams = () => {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const authUser = useAuthUser();

  useEffect(() => {
    if (!authUser) return;

    const firestore = getFirestore();
    const teamsCollection = collection(firestore, "teams");
    const unsubscribe = onSnapshot(teamsCollection, (response) => {
      setTeams(
        response.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ITeam))
      );
    });
    return unsubscribe;
  }, [authUser]);

  return teams;
};
