import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { urlencoded, json } from 'express';

import { AppModule } from './app/app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	app.setGlobalPrefix('v0');

	app.use(json({ limit: '10mb' }));
	app.use(urlencoded({ limit: '10mb', extended: true }));

	process.env.TZ = 'Africa/Nairobi';

	const port = process.env.PORT || 3333;
	await app.listen(port);

	Logger.log(`🚀 Application is running`);
}

bootstrap();
