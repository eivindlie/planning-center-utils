import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { ITeam } from "types";

export const addTeam = (team: ITeam) => {
  const firestore = getFirestore();
  const teamsCollection = collection(firestore, "teams");
  const { id, ...teamWithoutId } = team;
  addDoc(teamsCollection, teamWithoutId);
};

export const saveTeam = (team: ITeam) => {
  const firestore = getFirestore();
  const docRef = doc(firestore, `teams/${team.id}`);
  const { id, ...teamWithoutId } = team;
  setDoc(docRef, teamWithoutId);
};

export const deleteTeam = (team: ITeam) => {
  const firestore = getFirestore();
  const docRef = doc(firestore, `teams/${team.id}`);
  deleteDoc(docRef);
};
