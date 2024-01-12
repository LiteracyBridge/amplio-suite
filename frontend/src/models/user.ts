import { Role } from "./role";

export class UserRole {
  id: number;
  user_id: number;
  role_id: number;
  role: Role;

  // user: User; -- circular dependency
}
export class User {
  id: number;
  first_name: string = "";
  last_name: string = "";
  email: string = "";
  name: string = "";
  img: string = "";
  token: string = "";
  organisation_id: number;

  roles: UserRole[] = [];

  // TODO: add fromJSON method
  // TODO: add function to parse roles into a map of permissions (see below)
  // TODO: add permissions field => {[module: string]: { [action: string]: boolean}} // true by default
}
