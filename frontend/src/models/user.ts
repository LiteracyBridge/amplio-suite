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
  permissions: { [module: string]: { [action: string]: boolean } } = {};

  // TODO: add fromJSON method
  // TODO: add function to parse roles into a map of permissions (see below)
  // TODO: add permissions field => {[module: string]: { [action: string]: boolean}} // true by default

  static fromJSON(json: any): User {
    const user = new User();
    Object.assign(user, json);

    // Parse roles into a map of permissions that can be used to check permissions in the UI
    const permissions: { [module: string]: { [action: string]: boolean } } = {};
    for (const role of user.roles) {
      for (const module in role.role.permissions) {
        permissions[module] ??= {};
        for (const action of role.role.permissions[module]) {
          permissions[module][action] = true;
        }
      }
    }

    user.permissions = permissions;

    console.log(user);
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
