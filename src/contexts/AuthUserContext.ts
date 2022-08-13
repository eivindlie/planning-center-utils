import { User } from "@firebase/auth";
import { createContext, useContext } from "react";

export const AuthUserContext = createContext<User | null>(null);
export const useAuthUser = () => {
  return useContext(AuthUserContext);
};
