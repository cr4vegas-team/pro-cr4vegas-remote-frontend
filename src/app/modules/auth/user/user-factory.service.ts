import { Injectable } from '@angular/core';
import { UserUpdateDto } from './dto/user-update.dto';

@Injectable({
  providedIn: 'root',
})
export class UserFactoryService {
  constructor() {}

  getUserUpdateDto(source: any): UserUpdateDto {
    if (source) {
      const userUpdateDto = new UserUpdateDto();
      userUpdateDto.id = source.id;
      userUpdateDto.username = source.username;
      userUpdateDto.email = source.email;
      userUpdateDto.role = source.role;
      userUpdateDto.active = source.active;
      return userUpdateDto;
    }
    return null;
  }
}
