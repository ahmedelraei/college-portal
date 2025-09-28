import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeederService } from '../services/seeder.service';
import { User } from '../../entities/user.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
