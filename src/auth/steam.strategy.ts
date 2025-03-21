import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { AuthService } from './auth.service';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      returnURL: `${process.env.API_BACKEND}/auth/steam/callback`,
      realm: process.env.API_BACKEND,
      apiKey: 'B2F35E4FB70854041930A183E17D2571',
      profile: true,
    });
  }

  async validate(identifier: string): Promise<any> {
    const steamID64 = identifier.split('/').pop();
    const steamHex = BigInt(steamID64).toString(16);

    return { steamHex };
  }
}
