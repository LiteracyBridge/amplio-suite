import { Program } from "./program";
import { Permission, Role } from "./role";

export class userProgram {
  user_id: number;
  program_id: number;
  program: Program;
}

export class UserRole {
  id: number;
  user_id: number;
  role_id: number;

  /**
   * The program_id of the role, If not set, then the role is a system wide.
   */
  program_id?: number;

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

  /**
   * Map of permissions that can be used to check permissions in the UI
   * The permissions are derived from the roles assigned to the user within the program.
   * "*" indicates that the user has system wide permission to perform the action.
   */
  permissions: { [programId: string | "*"]: { [action: string]: boolean } } =
    {};

  static fromJSON(json: any): User {
    const user = new User();
    Object.assign(user, json);

    // Parse roles into a map of permissions that can be used to check permissions in the UI
    const permissions: { [programId: string]: { [action: string]: boolean } } =
      {};
    for (const role of user.roles) {
      for (const module in role.role.permissions) {
        const key = role.program_id || "*";
        permissions[key] ??= {};

        for (const action of role.role.permissions[module]) {
          permissions[key][action] = true;
        }
      }
    }
    user.permissions = permissions;

    return user;
  }
}

export class Invitation {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  organisation_id: number;
  created_at: string;
  updated_at: string;
}
