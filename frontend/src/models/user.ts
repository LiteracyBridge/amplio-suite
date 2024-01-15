import { Permission, Role } from "./role";

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
  permissions: { [action: string]: boolean } = {};

  static fromJSON(json: any): User {
    const user = new User();
    Object.assign(user, json);

    // Parse roles into a map of permissions that can be used to check permissions in the UI
    const permissions: { [action: string]: boolean } = {};
    for (const role of user.roles) {
      for (const module in role.role.permissions) {
        for (const action of role.role.permissions[module]) {
          permissions[action] = true;
        }
      }
    }

    user.permissions = permissions;

    return user;
  }

  hasPermission(action: Permission): boolean {
    return this.permissions[action] === true;
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
