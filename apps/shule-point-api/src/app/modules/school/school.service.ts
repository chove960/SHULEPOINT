import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { gradeLevel, School, schoolTerm } from '@shule-point/dataModels';
import { ImageUploadService } from '../../services/imageUpload.service';

@Injectable()
export class SchoolService {
	constructor(
		@InjectModel('School') private readonly schoolModel: Model<School>,
		private imageUploadService: ImageUploadService
	) {}

	async getSchools(): Promise<School[]> {
		const schools = await this.schoolModel.find();

		return schools;
	}

	async getSchool(schoolRegNumber): Promise<School> {
		const school = await this.schoolModel.findOne({ registrationNumber: schoolRegNumber });

		if (!school) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'School not found',
				},
				HttpStatus.NOT_FOUND
			);
		}

		return school;
	}

	async registerSchool(registerParams: School): Promise<School> {
		try {
			const schoolExists = await this.schoolModel.findOne({
				name: registerParams.name,
				registrationNumber: registerParams.registrationNumber,
			});

			if (schoolExists) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'School already registered',
					},
					HttpStatus.BAD_REQUEST
				);
			}

			const schoolLogoLocation = await this.imageUploadService.uploadSchoolLogo(
				registerParams.registrationNumber,
				registerParams.logo
			);

			const school = new this.schoolModel({
				logo: schoolLogoLocation,
				name: registerParams.name,
				shortName: registerParams.shortName,
				registrationNumber: registerParams.registrationNumber,
				address: registerParams.address,
				phoneNumber: registerParams.phoneNumber,
				email: registerParams.email,
				website: registerParams.website,
			});

			try {
				const savedSchool = await school.save();

				return savedSchool;
			} catch (err) {
				throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
			}
		} catch (err) {
			throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
		}
	}

	async addGradeLevel(gradeLevel: gradeLevel, schoolRegNumber: string): Promise<School> {
		const school = await this.schoolModel.findOne({ registrationNumber: schoolRegNumber });

		if (!school) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'School not found',
				},
				HttpStatus.NOT_FOUND
			);
		}

		school.gradeLevels.push(gradeLevel);

		try {
			const savedSchool = await school.save();

			return savedSchool;
		} catch (err) {
			throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
		}
	}

	async removeGradeLevel(gradeLevelName: string, schoolRegNumber: string): Promise<School> {
		const school = await this.schoolModel.findOne({ registrationNumber: schoolRegNumber });

		if (!school) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'School not found',
				},
				HttpStatus.NOT_FOUND
			);
		}

		school.gradeLevels.forEach((gradeLevel, index) => {
			if (gradeLevel.name === gradeLevelName) {
				school.gradeLevels.splice(index, 1);
			}
		});

		try {
			const savedSchool = await school.save();

			return savedSchool;
		} catch (err) {
			throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
		}
	}

	async addSchoolTerm(schoolTerm: schoolTerm, schoolRegNumber: string): Promise<School> {
		const school = await this.schoolModel.findOne({ registrationNumber: schoolRegNumber });

		if (!school) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'School not found',
				},
				HttpStatus.NOT_FOUND
			);
		}

		school.schoolTerms.push(schoolTerm);

		try {
			const savedSchool = await school.save();

			return savedSchool;
		} catch (err) {
			throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
		}
	}

	async removeSchoolTerm(schoolTermName: string, schoolRegNumber: string): Promise<School> {
		const school = await this.schoolModel.findOne({ registrationNumber: schoolRegNumber });

		if (!school) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'School not found',
				},
				HttpStatus.NOT_FOUND
			);
		}

		school.schoolTerms.forEach((schoolTerm, index) => {
			if (schoolTerm.name === schoolTermName) {
				school.schoolTerms.splice(index, 1);
			}
		});

		try {
			const savedSchool = await school.save();

			return savedSchool;
		} catch (err) {
			throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
		}
	}
}
