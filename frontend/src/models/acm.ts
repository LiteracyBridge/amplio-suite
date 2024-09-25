export class ACMCheckout {
  last_in_name: string;
  acm_comment: string;
  acm_name: string;
  last_in_contact?: string;
  last_in_file_name: string;
  last_in_version: string;
  last_in_date: string;
  last_in_comment?: string;
  now_out_name?: string;
  now_out_version?: string;
  now_out_computername?: string;
  now_out_date?: string;
  now_out_comment?: string;
  now_out_key?: string;
  now_out_contact?: string;
  acm_state: "CHECKED_IN" | "CHECKED_OUT";
}
