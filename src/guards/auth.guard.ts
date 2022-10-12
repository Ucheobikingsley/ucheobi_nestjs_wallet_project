import { Injectable, CanActivate, ExecutionContext, Inject, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { verify, JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(ConfigService)
    private readonly config!: ConfigService;
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }


   validateRequest(request: Request & {user:string | JwtPayload | undefined}): boolean | Promise<boolean> | Observable<boolean> {
    const authHeader = request.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return false;
    }
    const secretKey: string = String(this.config.get<string>('ACCESS_TOKEN'))
    verify(token, secretKey, (err: any, userToken:JwtPayload | string |undefined) => {
        if (err) {
          return false;
        }
        
        request['user'] = userToken
      });
      return true
  }
}
