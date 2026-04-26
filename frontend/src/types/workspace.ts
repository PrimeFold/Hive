export interface WorkspaceChannel {
  id: string;
  name: string;
  workspaceId?: string;
  createdAt?: string;
}

export interface Workspace {
  id: string;
  name: string;
  createdAt?: string;
  channels: WorkspaceChannel[];
}
