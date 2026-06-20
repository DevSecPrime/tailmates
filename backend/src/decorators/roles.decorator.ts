import { SetMetadata } from '@nestjs/common';
import type { UserRoles } from '../constants/user.constant';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
