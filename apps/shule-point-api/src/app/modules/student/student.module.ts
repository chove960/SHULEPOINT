import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { studentSchema } from '@shule-point/dataModels';
import { ImageUploadService } from '../../services/imageUpload.service';
import { verificationCodeService } from '../../services/verificationCode.service';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Student', schema: studentSchema }])],
	controllers: [StudentController],
	providers: [StudentService, ImageUploadService, verificationCodeService],
})
export class StudentModule {}
