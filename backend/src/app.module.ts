import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { ApiModule } from './api/api.module';
import { dataSourceOption } from './database/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter';
import { AdminModule } from './admin/admin.module';
// import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    // TypeOrm config
    TypeOrmModule.forRoot(dataSourceOption),

    // Config module for global config
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),

    // Mailer config
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: +configService.get<number>('MAIL_PORT'),
          ignoreTLS: configService.get<string>('MAIL_ENCRYPTION') !== 'tls',
          secure: configService.get<string>('MAIL_ENCRYPTION') !== 'tls',
          auth: {
            user: configService.get<string>('MAIL_USERNAME'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: { from: configService.get<string>('MAIL_FROM_ADDRESS') },
        template: {
          dir: join(__dirname, '/views/emails'),
          adapter: new EjsAdapter(),
          options: { strict: false },
        },
      }),
    }),

    // // Cron config
    // ScheduleModule.forRoot(),

    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: { path: join(__dirname, '/i18n/'), watch: true },
      typesOutputPath: join(__dirname, '../src/generated/i18n.generated.ts'),
      resolvers: [{ use: HeaderResolver, options: ['Accept-Language'] }, AcceptLanguageResolver],
    }),
    ApiModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
