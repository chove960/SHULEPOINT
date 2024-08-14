import { Body, Controller, Get, Put, Delete, Query, UseGuards, Post } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { SchoolService } from './school.service';

@Controller('school')
export class SchoolController {
	constructor(private readonly schoolService: SchoolService) {}

	@Get()
	getSchool(@Query('schoolRegNumber') schoolRegNumber: string) {
		return this.schoolService.getSchool(schoolRegNumber);
	}

	@Get('all')
	getSchools() {
		return this.schoolService.getSchools();
	}

	@Post('register')
	@UseGuards(AuthGuard)
	registerSchool(@Body() completeBody) {
		return this.schoolService.registerSchool(completeBody);
	}

	@Put('addDetails')
	@UseGuards(AuthGuard)
	addSchoolDetails(
		@Query('schoolRegNumber') schoolRegNumber: string,
		@Query('detailName') detailName: string,
		@Body() completeBody
	) {
		switch (detailName) {
			case 'gradeLevel':
				return this.schoolService.addGradeLevel(completeBody, schoolRegNumber);
			case 'schoolTerm':
				return this.schoolService.addSchoolTerm(completeBody, schoolRegNumber);
			default:
				break;
		}
	}

	@Delete('removeDetails')
	@UseGuards(AuthGuard)
	removeSchoolDetails(
		@Query('schoolRegNumber') schoolRegNumber: string,
		@Query('detailName') detailName: string,
		@Query('detail') detail
	) {
		switch (detailName) {
			case 'gradeLevel':
				return this.schoolService.removeGradeLevel(detail, schoolRegNumber);
			case 'schoolTerm':
				return this.schoolService.removeSchoolTerm(detail, schoolRegNumber);
			default:
				break;
		}
	}
}
