
import { UserEntity } from '../../auth/user/user.entity';
import { ActionEntity } from '../action/action.entity';
import { OrderEntity } from '../order/order.entity';
import { RegistryEntity } from '../registry/registry.entity';

export class SessionEntity {

  id: number;
  user: UserEntity;
  action: ActionEntity[];
  orders: OrderEntity[];
  registries: RegistryEntity[];
  active: number;
  userAgent: string;
  origin: string;
  started: Date;
  finished: Date;
}
