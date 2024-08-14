import { Body, Controller, Get, Put, Delete, Query, UseGuards, Post, Logger } from '@nestjs/common';

import { AuthGuard } from '../../guards/auth.guard';
import { ClassRoomService } from './classroom.service';

@Controller('classroom')
export class ClassRoomController {
	constructor(private readonly classroomService: ClassRoomService) {}

	@Get()
	getClassroom(@Query('classroomID') classroomID: string) {
		return this.classroomService.getClassroom(classroomID);
	}

	@Get('all')
	getClassrooms(@Query('schoolRegNumber') schoolRegNumber: string) {
		return this.classroomService.getClassrooms(schoolRegNumber);
	}

	@Post('create')
	@UseGuards(AuthGuard)
	registerClassroom(@Body() completeBody) {
		return this.classroomService.createClassrooms(completeBody);
	}

	@Put('assignSeat')
	@UseGuards(AuthGuard)
	assignSeat(@Body() completeBody, @Query('classroomID') classroomID: string) {
		return this.classroomService.assignSeat(classroomID, completeBody);
	}

	@Put('createAttendance')
	@UseGuards(AuthGuard)
	createAttendance(@Body() completeBody, @Query('classroomID') classroomID: string) {
		return this.classroomService.createAttendance(classroomID, completeBody);
	}

	@Put('uploadRefMaterials')
	@UseGuards(AuthGuard)
	uploadRefMaterials(@Body() completeBody, @Query('classroomID') classroomID: string) {
		return this.classroomService.uploadRefMaterials(classroomID, completeBody);
	}
}
