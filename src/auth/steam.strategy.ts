import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-steam';
import { AuthService } from './auth.service';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      returnURL: 'http://localhost:3000/auth/steam/callback',
      realm: 'http://localhost:3000/',
      apiKey: 'A23E3C6293E948573B110F16B2F0EEDB',
      profile: true,
    });
  }

  async validate(identifier: string): Promise<any> {
    const steamID64 = identifier.split('/').pop();
    const steamHex = BigInt(steamID64).toString(16);

    return { steamHex };
  }
}
