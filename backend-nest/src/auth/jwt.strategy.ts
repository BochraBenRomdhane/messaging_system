import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => (req as any)?.cookies?.token, // Primary: from cookies
        ExtractJwt.fromAuthHeaderAsBearerToken() // Fallback: from Authorization header
      ]),
      ignoreExpiration: false,
      secretOrKey: (config.get<string>('JWT_SECRET') ?? 'dev-secret'),
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, email: payload.email };
  }
}


