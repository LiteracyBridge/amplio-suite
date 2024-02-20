export const API_URL = import.meta.env.VITE_APP_API_URL;

export enum RequestCacheKeys {
  org_programs = "org_programs",
  org_roles = "org_roles",
  org_users = "org_users",
  orgs = "orgs",
  supported_languages = "supported_languages",
  tableau_jwt = "tableau_jwt",
}

export enum LocalStorageKeys {
  active_program = "active_program",
  active_deployment = "active_deployment",
  active_language = "active_language",
}
