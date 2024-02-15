export class Role {
  id: number;
  name: string;
  description: string;
  permissions: { [module: string]: string[] }; // { module: [permissions] }
}

// TODO: update permissions
export enum Permission {
  // ACM/TB Loader
  manage_deployment = "manage_deployment",
  manage_playlist = "manage_playlist",
  manage_prompt = "manage_prompt",
  manage_content = "manage_content",
  manage_acm_checkout = "manage_acm_checkout",

  // Analytics
  view_tb_analytics = "view_tb_analytics",
  view_deployment_status = "view_deployment_status",

  // Programs
  manage_user = "manage_user",
  manage_program = "manage_program",
  manage_specification = "manage_specification",

  // Staff
  manage_staff = "manage_staff",
  manage_role = "manage_role",

  // User feedback
  manage_survey = "manage_survey",
  analyse_survey = "analyse_survey",
  review_analysis = "review_analysis",
}
