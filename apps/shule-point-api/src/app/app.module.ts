import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SchoolModule } from './modules/school/school.module';
import { ClassRoomModule } from './modules/classroom/classroom.module';
import { StudentModule } from './modules/student/student.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
		MongooseModule.forRoot(process.env.DATABASE_URL),
		AuthModule,
		UserModule,
		SchoolModule,
		ClassRoomModule,
		StudentModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
