import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '@shule-point/dataModels';

@Injectable()
export class UserService {
	constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

	async getUser(id): Promise<User> {
		const user = await this.userModel.findOne({ _id: id });

		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'User not found',
				},
				HttpStatus.NOT_FOUND
			);
		}

		return user;
	}

	async getSchoolAdminUsers(schoolRegNumber): Promise<User[]> {
		const users = await this.userModel.find({ schoolRegNumber: schoolRegNumber, userRole: 'SchoolAdmin' });

		return users;
	}

	async getSchoolTeacherUsers(schoolRegNumber): Promise<User[]> {
		const users = await this.userModel.find({ schoolRegNumber: schoolRegNumber, userRole: 'SchoolTeacher' });

		return users;
	}

	async getTeacherUser(userID): Promise<User> {
		const user = await this.userModel.findOne({ _id: userID, userRole: 'SchoolTeacher' });

		if (!user) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'Teacher not found',
				},
				HttpStatus.NOT_FOUND
			);
		}

		return user;
	}
}
