import { UserRole } from '../enum/user-role.enum';

export class UserUpdateDto {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  active: number;
  role: UserRole;
}
