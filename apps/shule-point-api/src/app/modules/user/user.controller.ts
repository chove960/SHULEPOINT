import { Body, Controller, Get, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@UseGuards(AuthGuard)
	getUser(@Query('userID') userId: string) {
		return this.userService.getUser(userId);
	}

	@Get('schoolAdmins')
	@UseGuards(AuthGuard)
	getSchoolAdminUsers(@Query('schoolRegNumber') schoolRegNumber: string) {
		return this.userService.getSchoolAdminUsers(schoolRegNumber);
	}

	@Get('schoolTeachers')
	@UseGuards(AuthGuard)
	getSchoolTeacherUsers(@Query('schoolRegNumber') schoolRegNumber: string) {
		return this.userService.getSchoolTeacherUsers(schoolRegNumber);
	}

	@Get('teacher')
	@UseGuards(AuthGuard)
	getTeacherUser(@Query('userID') userID: string) {
		return this.userService.getTeacherUser(userID);
	}
}
