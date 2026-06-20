import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import fs from 'fs';
import basicAuth from 'express-basic-auth';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './helpers/all-exception-filter.helper';
import { I18nValidationPipe } from 'nestjs-i18n';
import morgan from 'morgan';

async function bootstrap() {
  const isSecure = process.env.IS_SECURE === 'true';
  let httpsOptions: { key: Buffer; cert: Buffer; ca: Buffer[] };

  if (isSecure) {
    const certBasePath = process.env.SSL_CERT_BASE_PATH;
    httpsOptions = {
      key: fs.readFileSync(`${certBasePath}/privkey.pem`),
      cert: fs.readFileSync(`${certBasePath}/cert.pem`),
      ca: [
        fs.readFileSync(`${certBasePath}/cert.pem`),
        fs.readFileSync(`${certBasePath}/fullchain.pem`),
      ],
    };
  }

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    isSecure ? { httpsOptions } : undefined,
  );

  const configService = app.get(ConfigService);

  const appName = configService.get<string>('APP_NAME') ?? 'Studio Era';
  const appVersion = process.env.API_VERSION ?? '1.0.0';
  const port = Number(configService.get('PORT', 3080));
  const appUrl = process.env.APP_URL ?? `http://localhost:${port}`;

  /**
   * Swagger Documentation
   */
  app.use(
    ['/api/documentation'],
    basicAuth({
      challenge: true,
      users: { StudioEraApp: '$$studio_era_app$$' },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(`APIs for ${appName} native app.`)
    .addServer(appUrl)
    .setVersion(appVersion)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/documentation', app, document, {
    swaggerOptions: { persistAuthorization: true, docExpansion: 'none' },
    customfavIcon: `${appUrl}/images/favicon.ico`,
    customSiteTitle: 'API Documentation',
  });

  // Static assets & views
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('ejs');

  app.use(morgan('dev'));

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new I18nValidationPipe({ stopAtFirstError: true }));

  const allowedOrigins = process.env.CORS_DOMAINS || '';

  const allowedOriginsArray = allowedOrigins.split(',').map(item => item.trim());

  app.enableCors({
    origin: allowedOriginsArray,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  });

  // Session
  app.use(
    session({
      secret: configService.get('APP_KEY'),
      resave: false,
      saveUninitialized: true,
    }),
  );

  await app.listen(port, () => {
    console.warn(`🚀 Application running on: ${appUrl}`);
  });
}

bootstrap();
