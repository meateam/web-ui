export class FileElement {
  id?: string;
  isFolder: boolean;
  name: string;
  parent: string | FileElement;
  size: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}