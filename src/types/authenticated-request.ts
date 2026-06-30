import type { Request } from 'express';
import type { AuthenticatedUser } from './jtw';

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};
