import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { AuthenticatedUser, JwtPayload } from 'src/types/jtw';

type JwtExtractor = {
  fromAuthHeaderAsBearerToken: () => (request: {
    headers?: { authorization?: string };
  }) => string | null;
};

type JwtStrategyOptions = {
  jwtFromRequest: ReturnType<JwtExtractor['fromAuthHeaderAsBearerToken']>;
  secretOrKey: string;
};

const JwtStrategyBase = PassportStrategy(Strategy) as new (
  options: JwtStrategyOptions,
) => Record<string, unknown>;

@Injectable()
export class JwtStrategy extends JwtStrategyBase {
  constructor() {
    const jwtExtractor = ExtractJwt as unknown as JwtExtractor;
    super({
      jwtFromRequest: jwtExtractor.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'jwt_secret_dev',
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      id: payload.sub,
      email: payload.email,
      companyId: payload.companyId,
    };
  }
}
