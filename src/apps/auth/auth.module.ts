import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UserModule } from '../users/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('auth.jwtSecret'),
          signOptions: { expiresIn: configService.get('auth.jwtExpiresIn') },
        };
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
