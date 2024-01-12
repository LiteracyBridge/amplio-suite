export class Role {
  id: string;
  name: string;
  description: string;
  permissions: { [module: string]: string[] }; // { module: [permissions] }
}
