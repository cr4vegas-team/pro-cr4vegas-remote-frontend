import { UserRoleEnum } from '../enum/user-role.enum';

export class UpdateUserDto {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  active: number;
  role: UserRoleEnum;
}
