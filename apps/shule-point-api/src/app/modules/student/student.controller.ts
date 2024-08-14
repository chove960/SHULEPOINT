import { Body, Controller, Get, Put, Delete, Query, UseGuards, Post, Logger } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
	constructor(private readonly studentService: StudentService) {}

	@Get()
	getStudent(
		@Query('schoolRegNumber') schoolRegNumber: string,
		@Query('studentID') studentID: string,
		@Query('studentVerificationCode') studentVerificationCode: string
	) {
		if (studentVerificationCode !== undefined) {
			return this.studentService.getStudentByVerificationCode(schoolRegNumber, studentVerificationCode);
		}

		if (studentID !== undefined) {
			return this.studentService.getStudentById(schoolRegNumber, studentID);
		}
	}

	@Get('byGradeLevel')
	getStudentsByGradeLevel(@Query('schoolRegNumber') schoolRegNumber: string, @Query('gradeLevel') gradeLevel: string) {
		return this.studentService.getStudentsByGradeLevel(schoolRegNumber, gradeLevel);
	}

	@Get('all')
	@UseGuards(AuthGuard)
	getStudents(
		@Query('schoolRegNumber') schoolRegNumber: string,
		@Query('page') page: string,
		@Query('studentFilters') studentFilters: string
	) {
		return this.studentService.getStudents(schoolRegNumber, page, JSON.parse(studentFilters));
	}

	@Get('search')
	@UseGuards(AuthGuard)
	searchStudents(
		@Query('schoolRegNumber') schoolRegNumber: string,
		@Query('searchEntry') searchEntry: string,
		@Query('page') page: string,
		@Query('studentFilters') studentFilters: string
	) {
		return this.studentService.searchStudents(schoolRegNumber, searchEntry, page, JSON.parse(studentFilters));
	}

	@Post('register')
	@UseGuards(AuthGuard)
	registerStudent(@Body() completeBody) {
		return this.studentService.registerStudent(completeBody);
	}

	@Post('progress-report')
	@UseGuards(AuthGuard)
	createStudentProgressReport(@Body() completeBody, @Query('studentID') studentID: string) {
		return this.studentService.createStudentReport(completeBody, studentID);
	}

	@Put('progress-report')
	@UseGuards(AuthGuard)
	updateStudentProgressReport(
		@Body() completeBody,
		@Query('studentID') studentID: string,
		@Query('gradeLevel') gradeLevel: string,
		@Query('schoolTermName') schoolTermName: string
	) {
		return this.studentService.updateStudentReport(completeBody, studentID, gradeLevel, schoolTermName);
	}

	@Delete('progress-report')
	@UseGuards(AuthGuard)
	deleteStudentProgressReport(
		@Query('studentID') studentID: string,
		@Query('gradeLevel') gradeLevel: string,
		@Query('schoolTermName') schoolTermName: string
	) {
		return this.studentService.deleteStudentReport(studentID, gradeLevel, schoolTermName);
	}
}
