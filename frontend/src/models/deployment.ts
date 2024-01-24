import { Playlist } from "./playlist";

export class Deployment {
  project: string;
  deployment: string;
  deploymentname?: string;
  deploymentnumber: number;
  startdate?: Date;
  enddate?: Date;
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
    if (previous != null && deploymentnumber != 1 && previous.enddate != null) {
      // Date handling in Javascript is pretty bad, but this seems to work well enough.
      let prevEnd = new Date(previous.enddate);
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
    deployment.startdate = startdate.toISOString();
    deployment.enddate = enddate.toISOString();
    deployment.project = programId;
    deployment.deployment = deploymentname;
    deployment.playlists = playlists;

    return deployment;
  }
}
