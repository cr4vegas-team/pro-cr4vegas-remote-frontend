import { SessionEntity } from "../session/session.entity";

export class RegistryEntity {

  id: number;
  session: SessionEntity;
  message: string;
  created: Date;
}
