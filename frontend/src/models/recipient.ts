import { TalkingBookDeployed } from "./talkingbook";

export class Recipient {
  id: string;
  project: string;
  partner?: string;
  community_name: string;
  group_name: string;
  affiliate?: string;
  component?: string;
  country: string;
  region: string;
  district: string;
  numhouseholds: number;
  numtbs: number;
  support_entity: string;
  listening_model: string;
  language: string;
  coordinates: string;
  agent: string;
  latitude?: number;
  longitude?: number;
  variant?: string;
  group_size: number;
  deployments: number[] = [];
  agent_gender?: string;
  direct_beneficiaries?: number;
  direct_beneficiaries_additional: any;
  indirect_beneficiaries?: number;

  // todo: ADD talking_books_deployed, -> deployments
  talkingbooks_deployed: TalkingBookDeployed[] = [];
}
