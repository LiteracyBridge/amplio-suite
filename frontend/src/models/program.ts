import { Deployment } from "./deployment";
import { Language } from "./language";
import { Organisation } from "./organisation";
import { ProgramUser } from "./user";

class Project {
  name: string;
  code: string;

  deployments: Deployment[] = [];
}

class OrganisationProgram {
  organisation_id: number;
  program_id: number;

  organisation: Organisation;
}

export class Program {
  id: number;
  name: string;
  country: string;
  region: string[];
  program_id: string;
  affiliate?: string;
  partner?: string;

  sustainable_development_goals: any;
  deployments_count: number;
  deployments_length: string;
  deployments_first: Date;
  feedback_frequency: string;
  languages: string[];
  direct_beneficiaries_map?: any;
  direct_beneficiaries_additional_map?: any;
  listening_models: string[] = [];
  tableau_id?: string;
  salesforce_id?: string;

  // For form fields
  // new_languages: Language[] = [];

  project: Project;
  users: ProgramUser[] = [];
  organisations: OrganisationProgram[] = [];
}
