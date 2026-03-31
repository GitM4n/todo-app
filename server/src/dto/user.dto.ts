import type { User, UserDto } from '../types';

export function toUserDto(user: User):UserDto {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    role: user.role,
  };
}
