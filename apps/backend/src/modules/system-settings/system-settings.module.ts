import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemSettings } from '../../entities/system-settings.entity';
import { SystemSettingsService } from './system-settings.service';
import { SystemSettingsResolver } from './system-settings.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([SystemSettings])],
  providers: [SystemSettingsService, SystemSettingsResolver],
  exports: [SystemSettingsService],
})
export class SystemSettingsModule {}

