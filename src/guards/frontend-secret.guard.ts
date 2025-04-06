import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import * as url from 'url';

@Injectable()
export class FrontendSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const method = request.method;
    const parsedUrl = url.parse(request.url).pathname; // remove query params

    const publicRoutes = [
      { method: 'GET', path: '/' },
      { method: 'GET', path: '/auth/discord' },
      { method: 'GET', path: '/auth/discord/callback' },
      { method: 'GET', path: '/auth/discord/redirect' },
    ];

    const isPublic = publicRoutes.some(
      (route) => route.method === method && parsedUrl === route.path,
    );

    if (isPublic) {
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
