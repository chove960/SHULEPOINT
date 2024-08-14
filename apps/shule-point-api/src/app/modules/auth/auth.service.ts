import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';

import { Student, User } from '@shule-point/dataModels';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel('User') private readonly userModel: Model<User>,
		@InjectModel('Student') private readonly studentModel: Model<Student>
	) {}

	async loginUser(loginParams): Promise<{ userID; Token }> {
		const user = await this.userModel.findOne({
			username: loginParams.username,
		});

		if (!user) {
			throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: 'Username is wrong' }, HttpStatus.BAD_REQUEST);
		} else {
			const validPassword = await bcrypt.compare(loginParams.password, user.password);
			if (!validPassword) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'Incorrect Password',
					},
					HttpStatus.BAD_REQUEST
				);
			} else {
				// Create and Assign Token
				const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

				return { userID: user._id, Token: token };
			}
		}
	}

	async registerUser(registerParams: User): Promise<{ userID; Token }> {
		try {
			const emailExists = await this.userModel.findOne({
				email: registerParams.email,
			});

			if (emailExists) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'Email already taken',
					},
					HttpStatus.BAD_REQUEST
				);
			}

			const usernameExists = await this.userModel.findOne({
				username: registerParams.username,
			});

			if (usernameExists) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'Username already taken',
					},
					HttpStatus.BAD_REQUEST
				);
			}

			// Hash Password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(registerParams.password, salt);

			const user = new this.userModel({
				firstName: registerParams.firstName,
				lastName: registerParams.lastName,
				username: registerParams.username,
				email: registerParams.email,
				password: hashedPassword,
				userType: registerParams.userType,
				userRole: registerParams.userRole,
			});

			if (user.userType === 'Client') {
				user.schoolRegNumber = registerParams.schoolRegNumber;
			}

			try {
				const savedUser = await user.save();

				// Create and Assign Token
				const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);

				return { userID: user._id, Token: token };
			} catch (err) {
				throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
			}
		} catch (err) {
			throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
		}
	}

	async registerStudentUser(registerParams: User, studentInfoID: string): Promise<{ userID; Token }> {
		try {
			const emailExists = await this.userModel.findOne({
				email: registerParams.email,
			});

			if (emailExists) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'Email already taken',
					},
					HttpStatus.BAD_REQUEST
				);
			}

			const usernameExists = await this.userModel.findOne({
				username: registerParams.username,
			});

			if (usernameExists) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'Username already taken',
					},
					HttpStatus.BAD_REQUEST
				);
			}

			// Hash Password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(registerParams.password, salt);

			const studentInfo = await this.studentModel.findOne({ _id: studentInfoID });

			const user = new this.userModel({
				firstName: registerParams.firstName,
				lastName: registerParams.lastName,
				username: registerParams.username,
				email: registerParams.email,
				password: hashedPassword,
				userType: registerParams.userType,
				userRole: registerParams.userRole,
				schoolRegNumber: studentInfo.schoolRegNumber,
				studentID: studentInfo._id,
			});

			user.Profile = {
				profilePic: studentInfo.photo,
				dateOfBirth: studentInfo.dateOfBirth,
				address: studentInfo.address,
				gender: studentInfo.gender,
				phoneNumber: '',
			};

			user.hasProfile = true;

			try {
				const savedUser = await user.save();
				const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);

				return { userID: user._id, Token: token };
			} catch (err) {
				throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
			}
		} catch (err) {
			throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
		}
	}

	async registerParentUser(registerParams: User, studentInfoID: string, parentType: string): Promise<{ userID; Token }> {
		try {
			const emailExists = await this.userModel.findOne({
				email: registerParams.email,
			});

			if (emailExists) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'Email already taken',
					},
					HttpStatus.BAD_REQUEST
				);
			}

			const usernameExists = await this.userModel.findOne({
				username: registerParams.username,
			});

			if (usernameExists) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'Username already taken',
					},
					HttpStatus.BAD_REQUEST
				);
			}

			// Hash Password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(registerParams.password, salt);

			const studentInfo = await this.studentModel.findOne({ _id: studentInfoID });

			const user = new this.userModel({
				firstName: registerParams.firstName,
				lastName: registerParams.lastName,
				username: registerParams.username,
				email: registerParams.email,
				password: hashedPassword,
				userType: registerParams.userType,
				userRole: registerParams.userRole,
				schoolRegNumber: studentInfo.schoolRegNumber,
			});

			user.Profile = {
				profilePic: '',
				dateOfBirth: '',
				gender: '',
				address: studentInfo.address,
				phoneNumber: '',
			};

			switch (parentType) {
				case 'Father':
					user.Profile.gender = 'Male';

				case 'Mother':
					user.Profile.gender = 'Female';

				default:
					break;
			}

			user.hasProfile = true;

			try {
				const savedUser = await user.save();

				// Create and Assign Token
				const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);

				return { userID: user._id, Token: token };
			} catch (err) {
				throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
			}
		} catch (err) {
			throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
		}
	}
}
