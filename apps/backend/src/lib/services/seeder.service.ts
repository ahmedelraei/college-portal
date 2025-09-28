import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async seedDefaultAdmin(): Promise<void> {
    try {
      // Check if any admin already exists
      const existingAdmin = await this.usersRepository.findOne({
        where: { role: UserRole.ADMIN },
      });

      if (existingAdmin) {
        this.logger.log('Default admin already exists, skipping seeding');
        return;
      }

      // Get default admin credentials from environment variables
      const defaultAdminEmail = this.configService.get<string>(
        'DEFAULT_ADMIN_EMAIL',
        'admin@modernacademy.edu',
      );
      const defaultAdminPassword = this.configService.get<string>(
        'DEFAULT_ADMIN_PASSWORD',
        'Admin123!',
      );
      const defaultAdminFirstName = this.configService.get<string>(
        'DEFAULT_ADMIN_FIRST_NAME',
        'System',
      );
      const defaultAdminLastName = this.configService.get<string>(
        'DEFAULT_ADMIN_LAST_NAME',
        'Administrator',
      );

      // Hash the password
      const hashedPassword = await bcrypt.hash(defaultAdminPassword, 12);

      // Create the default admin
      const defaultAdmin = this.usersRepository.create({
        email: defaultAdminEmail,
        password: hashedPassword,
        firstName: defaultAdminFirstName,
        lastName: defaultAdminLastName,
        role: UserRole.ADMIN,
        isActive: true,
      });

      await this.usersRepository.save(defaultAdmin);

      this.logger.log(
        `✅ Default admin created successfully with email: ${defaultAdminEmail}`,
      );
      this.logger.warn(
        '⚠️  Please change the default admin password after first login!',
      );
    } catch (error) {
      this.logger.error('❌ Failed to create default admin:', error.message);
      throw error;
    }
  }

  async seedAll(): Promise<void> {
    this.logger.log('🌱 Starting database seeding...');

    try {
      await this.seedDefaultAdmin();
      this.logger.log('✅ Database seeding completed successfully');
    } catch (error) {
      this.logger.error('❌ Database seeding failed:', error.message);
      throw error;
    }
  }
}
