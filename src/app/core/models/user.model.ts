export interface User {
  id: number;
  username?: string;
  first_name: string;
  last_name: string;
  email?: string;
  last_login?: Date;
  role?: UserRoles;
  language?: string;
  country?: string;
  created_by?: number;
}

enum UserRoles {
  Supervisor = 'SUPERVISOR',
  Student = 'STUDENT'
}
