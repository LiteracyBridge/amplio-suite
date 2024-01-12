export class Role {
  id: number;
  name: string;
  description: string;
  permissions: { [module: string]: string[] }; // { module: [permissions] }
}
