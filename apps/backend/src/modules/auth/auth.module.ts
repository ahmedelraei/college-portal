import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { Student } from '../../entities/student.entity';
import { User } from '../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Student])],
  controllers: [AuthController],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
