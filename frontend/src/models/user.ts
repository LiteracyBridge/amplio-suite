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
}
