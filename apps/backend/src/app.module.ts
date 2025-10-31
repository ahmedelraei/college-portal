import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './lib/modules/db.module';
import { SeederModule } from './lib/modules/seeder.module';
import { AuthModule } from './modules/auth/auth.module';
import { StudentsModule } from './modules/students/students.module';
import { CoursesModule } from './modules/courses/courses.module';
import { RegistrationsModule } from './modules/registrations/registrations.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SystemSettingsModule } from './modules/system-settings/system-settings.module';
import { join } from 'path';

@Module({
  imports: [
    DatabaseModule,
    SeederModule,
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      graphiql: true,
      context: (request, reply) => ({
        req: request,
        res: reply,
      }),
    }),
    AuthModule,
    StudentsModule,
    CoursesModule,
    RegistrationsModule,
    PaymentsModule,
    SystemSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
