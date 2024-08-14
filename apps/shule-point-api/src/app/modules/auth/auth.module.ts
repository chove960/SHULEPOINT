import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema, studentSchema } from '@shule-point/dataModels';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'User', schema: userSchema },
			{ name: 'Student', schema: studentSchema },
		]),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
