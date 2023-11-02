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
    previous?: { enddate?: string | Date }
  ) {
    let startdate = new Date(),
      enddate = new Date();

    let playlists: Playlist[] = [];
    if (deploymentnumber !== 1) {
      // Date handline in Javascript is pretty bad, but this seems to work well enough.
      let prevEnd = new Date(previous.enddate);
      startdate = new Date(prevEnd);
      startdate = new Date(startdate.setDate(prevEnd.getDate() + 1));
      enddate = new Date(startdate);
      enddate = new Date(enddate.setDate(startdate.getDate() + 90));
    }
    let start = startdate.toISOString().substring(0, 10);
    let end = enddate.toISOString().substring(0, 10);
    let deploymentname = `${programId}-${startdate.getFullYear() %
      100}-${deploymentnumber}`;
    console.log(
      `start: ${startdate}, end: ${enddate}, depl: ${deploymentname}`
    );

    const deployment = new Deployment();
    deployment.deploymentnumber = deploymentnumber;
    deployment.startdate = startdate;
    deployment.enddate = enddate;
    deployment.project = programId;
    deployment.deployment = deploymentname;
    deployment.playlists = playlists;

    return deployment;
  }
}
