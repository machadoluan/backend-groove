import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class FrontendSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const method = request.method;
    const url = request.route?.path || request.url;

    // EXCEÇÃO: permitir GET /
    if (method === 'GET' && (url === '/' || url === '')) {
      return true;
    }

    const secretHeader = request.headers['x-app-secret'];
    const validSecret = process.env.FRONTEND_SECRET || 'seu-token-secreto';

    if (secretHeader !== validSecret) {
      throw new ForbiddenException('Acesso negado. Frontend não autorizado.');
    }

    return true;
  }
}
