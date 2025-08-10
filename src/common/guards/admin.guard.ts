import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from 'src/role/enums/user-role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request['auth'];

    return user && user.role.name === UserRole.ADMIN;
  }
}
