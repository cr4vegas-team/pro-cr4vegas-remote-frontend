import { UserRoleEnum } from './enum/user-role.enum';
export class UserEntity {
  id: number;
  username: string;
  email: string;
  active: number;
  role: UserRoleEnum;
}
