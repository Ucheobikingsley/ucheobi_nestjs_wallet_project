import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRole } from "src/types/types";
import { AuthGuard } from "./auth.guard";
import {has} from 'lodash';

@Injectable()
export class RolesGuard extends AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<UserRole[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    
    const request =context.switchToHttp().getRequest();
    
    if (this.validateRequest(request)) {
        if(has(request, 'user')){
            return request.user.isAdmin;
        }
    }
    return false;
    
  }
}