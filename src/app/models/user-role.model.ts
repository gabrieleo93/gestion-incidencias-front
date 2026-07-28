export enum UserRole {
  Admin = 'ADMIN',
  Tecnico = 'TECNICO',
  User = 'USER'
}

export function isUserRole(value: string | null): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole);
}
