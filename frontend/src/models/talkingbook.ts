import { Deployment } from "./deployment";

export class TalkingBookDeployed {
  talkingbook_id: string;
  deployed_timestamp: string;
  recipient_id: string;
  project: string;
  deployment_name: string;
  deployment_uuid: string;
  content_package: string;
  deployment: Deployment;
  testing: boolean
  location: string;
  username: string;
  tbcdid: string;
}
