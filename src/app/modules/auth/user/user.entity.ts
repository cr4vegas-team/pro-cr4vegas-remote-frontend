import { SessionEntity } from './../../session/session/session.entity';
import { UserRole } from './enum/user-role.enum';

export class UserEntity {
  id: number;
  username: string;
  email: string;
  active: number;
  role: UserRole;
  session: SessionEntity;
}
