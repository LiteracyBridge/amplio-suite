import { Playlist } from "./playlist";

export class Deployment {
  project: string;
  deployment: string;
  deploymentname?: string;
  deploymentnumber: number;
  start_date?: string;
  end_date?: string;
  distribution?: string;
  comment?: string;
  component?: string;
  id: number;
  deployed: boolean = false;

  playlists: Playlist[] = [];

  static create(
    deploymentnumber: number,
    programId: string,
    previous?: Deployment
  ) {
    let startdate = new Date(),
      enddate = new Date();

    let playlists: Playlist[] = [];
    if (previous != null) {
      // Date handling in Javascript is pretty bad, but this seems to work well enough.
      let prevEnd = new Date(previous.end_date);

      startdate = new Date(prevEnd);
      startdate = new Date(startdate.setDate(prevEnd.getDate() + 1));

      enddate = new Date(startdate);
      enddate = new Date(enddate.setDate(startdate.getDate() + 90));
    }

    let deploymentname = `${programId}-${
      startdate.getFullYear() % 100
    }-${deploymentnumber}`;
    console.log(
      `start: ${startdate}, end: ${enddate}, depl: ${deploymentname}`
    );

    console.log(startdate);
    const deployment = new Deployment();
    deployment.deploymentnumber = deploymentnumber;
    deployment.start_date = startdate.toISOString().substring(0, 10);
    deployment.end_date = enddate.toISOString().substring(0, 10);
    deployment.project = programId;
    deployment.deploymentname = deploymentname;
    deployment.deployment = deploymentname;
    deployment.playlists = playlists;

    return deployment;
  }
}
