import { Body, Controller, Logger, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	logInUser(@Body() completeBody: { username: string; password: string }): Promise<unknown> {
		return this.authService.loginUser(completeBody);
	}

	@Post('register')
	registerUser(
		@Body() completeBody,
		@Query('userRole') userRole,
		@Query('studentInfoID') studentInfoID,
		@Query('parentType') parentType
	): Promise<unknown> {
		switch (userRole) {
			case 'Student':
				return this.authService.registerStudentUser(completeBody, studentInfoID);

			case 'Parent':
				return this.authService.registerParentUser(completeBody, studentInfoID, parentType);

			default:
				return this.authService.registerUser(completeBody);
		}
	}
}
