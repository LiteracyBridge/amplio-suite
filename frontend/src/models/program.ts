import type { Language } from "./language";

export class Program {
  id: number;
  name: string;
  sustainable_development_goals: any;
  deployments_count: number;
  deployments_length: string;
  deployments_first: Date;
  feedback_frequency: string;
  program_id: string;
  languages: string[];
  country: string;
  region: any;
  direct_beneficiaries_map?: any;
  direct_beneficiaries_additional_map?: any;
  affiliate?: string;
  partner?: string;
  listening_models: string[] = [];
  tableau_id?: string;
  salesforce_id?: string;

  // For form fields
  new_languages: Language[] = [];
}
