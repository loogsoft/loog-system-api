export type JwtPayload = {
  sub: string;
  email: string;
  companyId: string;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  companyId: string;
};
