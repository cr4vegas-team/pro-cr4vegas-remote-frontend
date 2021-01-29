import { UserRole } from '../enum/user-role.enum';

export class UserDto {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  active: number;
}

export class UserRO {
  user: UserDto;
}

export class UsersRO {
  users: UserDto[];
  count: number;
}
