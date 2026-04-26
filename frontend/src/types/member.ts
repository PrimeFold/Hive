export type WorkspaceRole = "OWNER" | "MEMBER";

export interface Member {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  email?: string;
  bio?: string;
  role?: WorkspaceRole;
}
