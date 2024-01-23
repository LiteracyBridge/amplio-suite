export class Recipient {
    recipientid: string;
    project: string;
    partner?: string;
    communityname: string;
    groupname: string;
    affiliate?: string;
    component?: string;
    country: string;
    region: string;
    district: string;
    numhouseholds: number;
    numtbs: number;
    supportentity: string;
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
}
