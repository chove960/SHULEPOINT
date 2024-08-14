import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { classroomSchema, studentSchema } from '@shule-point/dataModels';
import { FileUploadService } from '../../services/fileUpload.service';
import { ClassRoomController } from './classroom.controller';
import { ClassRoomService } from './classroom.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Classroom', schema: classroomSchema },
			{ name: 'Student', schema: studentSchema },
		]),
	],
	controllers: [ClassRoomController],
	providers: [ClassRoomService, FileUploadService],
})
export class ClassRoomModule {}
