import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { schoolSchema } from '@shule-point/dataModels';
import { ImageUploadService } from '../../services/imageUpload.service';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'School', schema: schoolSchema }])],
	controllers: [SchoolController],
	providers: [SchoolService, ImageUploadService],
})
export class SchoolModule {}
