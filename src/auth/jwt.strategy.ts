import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'segredo-muito-seguro',
    });
  }

  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      nome: payload.nome,
      isAdmin: payload.isAdmin,
    };
  }
}
