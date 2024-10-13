import React from "react";
import { LoginUser } from "../../models/User";


interface UserContextType {
  user: LoginUser | null;
  setUser: React.Dispatch<React.SetStateAction<LoginUser | null>>;
}

const UserContext = React.createContext<UserContextType | null>(null);

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;

export default UserContext;
