import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.headers['refresh-token'];
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('CUSTOMERS_TOKEN_SECRET'),
      });
      console.log(payload);
      if (!(await this.authService.isUserLoggedIn(payload.id))) {
        throw new UnauthorizedException();
      }
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
