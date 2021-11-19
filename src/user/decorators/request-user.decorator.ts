import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//* Example usage are: @User('firstName') firstName: string or @User() user: User
export const RequestUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
});
