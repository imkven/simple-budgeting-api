
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Request } from 'express';
import { decodePayload, verifyAccessToken } from 'src/handy';
import { PrismaService } from 'src/prisma/prisma.service';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private prismaService: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException();
      }

      try {
        const payload = await verifyAccessToken(token);
        if (!payload) {
          throw new UnauthorizedException('Invalid token');
        }

        const decodedPayload = decodePayload(payload.sub);

        const { rth, userId } = decodedPayload;
        if (!rth || !userId) {
          throw new UnauthorizedException('Invalid token');
        }

        const refreshToken = await this.prismaService.refreshToken.findFirst({
          where: {
            userId,
            hash: rth,
            expiresAt: { gt: new Date() },
          },
        });
        if (!refreshToken ) {
          throw new UnauthorizedException('Invalid token');
        }

        request['auth'] = decodedPayload;        
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          throw new UnauthorizedException('Token expired');
        }
        throw error;
      }

      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  