import { type ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
