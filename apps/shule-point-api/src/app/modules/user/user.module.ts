import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from '@shule-point/dataModels';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'User', schema: userSchema }])],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
