import type { User } from '../types';

export function toUserDto(user: User) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}
