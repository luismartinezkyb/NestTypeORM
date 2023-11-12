import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { jwtConstants } from '../constants/jwt.costants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const headers = request.headers;
      if (!headers.authorization) {
        throw new UnauthorizedException('TOKEN_REQUIRED');
      }
      const token = headers.authorization.split(' ').pop();
      const isValidToken = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      // if (!isValidToken) {
      //   throw new UnauthorizedException('TOKEN_NOT_VALID');
      // }
      // console.log(isValidToken);
      request['user_token'] = isValidToken.username;
      return true;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('INVALID_SIGNATURE');
    }
  }
}

// EL CAN ACTIVE SE EJECUTA Antes de que se procese una solicitud hacia una ruta o endpoint especifico
