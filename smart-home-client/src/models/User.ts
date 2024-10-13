import exp from "constants";
import Role from "./enums/Role";

export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  picture : string;
  role: Role;
  blocked: boolean;
  verified: boolean;
}

export interface NewUser {
  name: string;
  username: string;
  password: string;
  confPassword : string;
  picture : string;
  blocked?: boolean;
  verified?: boolean;
}
export interface LoginUser{
  id: number;
  token: string;
  role: Role;
}

export interface ChangePassword{
  username: string;
  password: string;
  confPassword : string;
}