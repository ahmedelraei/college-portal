import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '../../../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    // Check if it's a GraphQL context
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;

    // Get user from session
    const user = request.session?.user;

    if (!user) {
      return false;
    }

    return requiredRoles.some((role) => user?.role === role);
  }
}
