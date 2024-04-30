export interface UserPermission {
  permName: string;
  permAction?: string;
}

export interface ParsedUserPermission {
  name: string;
  feature: string;
  permission: string;
}
