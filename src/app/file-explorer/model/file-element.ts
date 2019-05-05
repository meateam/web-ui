export class FileElement {
  id?: string;
  isFolder: boolean;
  fullName: string;
  FileOrId: { Parent: string };
  size?: number;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
}