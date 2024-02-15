export class Role {
  id: number;
  name: string;
  description: string;
  permissions: { [module: string]: string[] }; // { module: [permissions] }
}

// TODO: update permissions
export enum Permission {
  // ACM/TB Loader
  manage_deployment = "manage-deployment",
  manage_playlist = "manage-playlist",
  manage_prompt = "manage-prompt",
  manage_content = "manage-content",
  manage_acm_checkout = "manage-acm-checkout",

  // Analytics
  view_tb_analytics = "view-tb-analytics",
  view_deployment_status = "view-deployment-status",

  // Programs
  manage_user = "manage-user",
  manage_program = "manage-program",
  manage_specification = "manage-specification",

  // Staff
  manage_staff = "manage-staff",
  manage_role = "manage-role",

  // User feedback
  manage_survey = "manage-survey",
  analyse_survey = "analyse-survey",
  review_analysis = "review-analysis",
}
