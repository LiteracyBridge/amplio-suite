export class Role {
  id: number;
  name: string;
  description: string;
  permissions: { [module: string]: string[] }; // { module: [permissions] }
}

// TODO: update permissions
export enum Permission {
  // ACM/TB Loader
  ManageDeployment = "manage-deployment",
  ManagePlaylist = "manage-playlist",
  ManagePrompt = "manage-prompt",
  DeployContent = "deploy-content",
  ManageContent = "manage-content",
  ManageAcmCheckouts = "manage-acm-checkouts",
  ViewTbAnalytics = "view-tb-analytics",
  ViewUsageQueries = "view-usage-queries",
  ViewCollectionStats = "view-collection-stats",
  ViewDeploymentStatus = "view-deployment-status",

  // Programs
  CreateProgram = "create-program",
  UpdateProgram = "update-program",
  DeleteProgram = "delete-program",
  UpdateSpec = "update-spec",
  PublishSpec = "publish-spec",

  // Roles
  CreateStaff = "create-staff",
  UpdateStaff = "update-staff",
  DeleteStaff = "delete-staff",
  AssignRole = "assign-role",
  CreateRole = "create-role",
  DeleteRole = "delete-role",
  UpdateRole = "update-role"
}
