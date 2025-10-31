import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SystemSettingsService } from './system-settings.service';
import { SystemSettings } from '../../entities/system-settings.entity';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { UpdateSettingInput } from './dto/update-setting.input';

@Resolver(() => SystemSettings)
export class SystemSettingsResolver {
  constructor(
    private readonly systemSettingsService: SystemSettingsService,
  ) {}

  @Query(() => Boolean, { name: 'isRegistrationEnabled' })
  async isRegistrationEnabled(): Promise<boolean> {
    return this.systemSettingsService.isRegistrationEnabled();
  }

  @Query(() => [SystemSettings], { name: 'getAllSettings' })
  @UseGuards(AdminAuthGuard)
  async getAllSettings(): Promise<SystemSettings[]> {
    return this.systemSettingsService.getAllSettings();
  }

  @Mutation(() => SystemSettings, { name: 'toggleRegistration' })
  @UseGuards(AdminAuthGuard)
  async toggleRegistration(
    @Args('enabled') enabled: boolean,
  ): Promise<SystemSettings> {
    return this.systemSettingsService.setRegistrationEnabled(enabled);
  }

  @Mutation(() => SystemSettings, { name: 'updateSystemSetting' })
  @UseGuards(AdminAuthGuard)
  async updateSystemSetting(
    @Args('input') input: UpdateSettingInput,
  ): Promise<SystemSettings> {
    return this.systemSettingsService.updateSetting(
      input.settingKey,
      input.settingValue,
    );
  }
}

