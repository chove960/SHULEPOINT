import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Student, StudentAssessment, StudentAssessmentUpdates, studentReport } from '@shule-point/dataModels';
import { ImageUploadService } from '../../services/imageUpload.service';
import { verificationCodeService } from '../../services/verificationCode.service';
import { of } from 'rxjs';

@Injectable()
export class StudentService {
	constructor(
		@InjectModel('Student') private readonly studentModel: Model<Student>,
		private imageUploadService: ImageUploadService,
		private verificationCodeService: verificationCodeService
	) {}

	async getStudents(schoolRegNumber, page, studentFilters): Promise<{ students: Student[]; meta: {} }> {
		const resPerPage = 8;
		const currentPage = page;
		const skip = resPerPage * (currentPage - 1);

		const count = await this.studentModel
			.countDocuments({
				schoolRegNumber: schoolRegNumber,
				gender: studentFilters['gender'] !== undefined ? studentFilters['gender'] : { $ne: null },
				gradeLevel: studentFilters['gradeLevel'] !== undefined ? studentFilters['gradeLevel'] : { $ne: null },
			})
			.exec();
		const page_total = Math.floor((count - 1) / resPerPage) + 1;

		const students = await this.studentModel
			.find({
				schoolRegNumber: schoolRegNumber,
				gender: studentFilters['gender'] !== undefined ? studentFilters['gender'] : { $ne: null },
				gradeLevel: studentFilters['gradeLevel'] !== undefined ? studentFilters['gradeLevel'] : { $ne: null },
			})
			.limit(resPerPage)
			.skip(skip)
			.sort({ fullname: 1 });

		return { students: students, meta: { pages: page_total, items: count } };
	}

	async searchStudents(schoolRegNumber, searchEntry, page, studentFilters): Promise<{ students: Student[]; meta: {} }> {
		let regex = new RegExp(searchEntry, 'i');

		const resPerPage = 8;
		const currentPage = page;
		const skip = resPerPage * (currentPage - 1);

		const count = await this.studentModel
			.countDocuments({
				schoolRegNumber: schoolRegNumber,
				fullname: regex,
				gender: studentFilters['gender'] !== undefined ? studentFilters['gender'] : { $ne: null },
				gradeLevel: studentFilters['gradeLevel'] !== undefined ? studentFilters['gradeLevel'] : { $ne: null },
			})
			.exec();

		const page_total = Math.floor((count - 1) / resPerPage) + 1;

		const students = await this.studentModel
			.find({
				schoolRegNumber: schoolRegNumber,
				fullname: regex,
				gender: studentFilters['gender'] !== undefined ? studentFilters['gender'] : { $ne: null },
				gradeLevel: studentFilters['gradeLevel'] !== undefined ? studentFilters['gradeLevel'] : { $ne: null },
			})
			.limit(resPerPage)
			.skip(skip)
			.sort({ fullname: 1 });

		if (!students || students.length === 0) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'No Student Matches Your Search!',
				},
				HttpStatus.NOT_FOUND
			);
		}

		return { students: students, meta: { pages: page_total, items: count } };
	}

	async getStudentsByGradeLevel(schoolRegNumber, gradeLevel): Promise<Student[]> {
		const students = await this.studentModel.find({ gradeLevel: gradeLevel, schoolRegNumber: schoolRegNumber });

		return students;
	}

	async getStudentById(schoolRegNumber, studentObjID): Promise<Student> {
		const student = await this.studentModel.findOne({ _id: studentObjID, schoolRegNumber: schoolRegNumber });

		return student;
	}

	async getStudentByVerificationCode(schoolRegNumber, studentVerificationCode): Promise<Student> {
		const student = await this.studentModel.findOne({
			verificationCode: studentVerificationCode,
			schoolRegNumber: schoolRegNumber,
		});

		return student;
	}

	async registerStudent(studentParams: Student): Promise<Student> {
		try {
			const studentExists = await this.studentModel.findOne({
				fullname: studentParams.fullname,
				schoolRegNumber: studentParams.schoolRegNumber,
				studentID: studentParams.studentID,
			});

			if (studentExists) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'Student already registered',
					},
					HttpStatus.BAD_REQUEST
				);
			}

			const studentPhotoLocation = await this.imageUploadService.uploadStudentPhoto(
				studentParams.schoolRegNumber,
				studentParams.studentID,
				studentParams.photo
			);

			const student = new this.studentModel({
				schoolRegNumber: studentParams.schoolRegNumber,
				studentID: studentParams.studentID,
				fullname: studentParams.fullname,
				dateOfBirth: studentParams.dateOfBirth,
				gender: studentParams.gender,
				photo: studentPhotoLocation,
				gradeLevel: studentParams.gradeLevel,
				verificationCode: await this.verificationCodeService.generateCode(6),
				address: studentParams.address,
				parentalInformation: studentParams.parentalInformation,
			});

			try {
				const savedStudent = await student.save();

				return savedStudent;
			} catch (err) {
				throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
			}
		} catch (err) {
			throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
		}
	}

	async createStudentReport(reportParams: studentReport, studentID): Promise<Student> {
		const student = await this.studentModel.findById(studentID);

		student.progressReport.forEach((reportCard) => {
			if (reportCard.gradeLevel === reportParams.gradeLevel && reportCard.schoolTerm === reportParams.schoolTerm) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: `${student.fullname} already has a report card for ${reportParams.gradeLevel}-${reportParams.schoolTerm}`,
					},
					HttpStatus.BAD_REQUEST
				);
			}
		});

		student.progressReport.push(reportParams);

		const updatedStudent = await student.save();
		return updatedStudent;
	}

	async updateStudentReport(
		assessmentParams: StudentAssessmentUpdates,
		studentID,
		gradeLevel,
		schoolTermName
	): Promise<Student> {
		const student = await this.studentModel.findById(studentID);

		for (let reportCard of student.progressReport) {
			if (reportCard.gradeLevel === gradeLevel && reportCard.schoolTerm === schoolTermName) {
				for (let termAssessment of reportCard.assessments) {
					for (let termAssessmentUpdate of assessmentParams.AssessmentScores) {
						if (termAssessment.subject === termAssessmentUpdate.subject) {
							for (let assessment of termAssessment.assessments) {
								if (assessment.assessmentName === assessmentParams.AssessmentName) {
									if (termAssessmentUpdate.marks !== '') {
										assessment.marks = termAssessmentUpdate.marks;
									}
								}
							}
						}
					}
				}

				for (let assessment of reportCard.assessments) {
					let newTotalScore = 0;

					for (let subjectAssessments of assessment.assessments) {
						for (let termAssessment of reportCard.termAssessments) {
							if (termAssessment.name === subjectAssessments.assessmentName) {
								if (subjectAssessments.marks !== 'N/A') {
									newTotalScore += (subjectAssessments.marks as unknown as number) * termAssessment.value;
								}
							}
						}
					}

					assessment.totalScore = String(Math.round((newTotalScore + Number.EPSILON) * 10) / 10);
				}
			}
		}

		student.markModified('progressReport');
		const updatedStudent = await student.save();

		return updatedStudent;
	}

	async deleteStudentReport(studentID, gradeLevel, schoolTermName): Promise<Student> {
		const student = await this.studentModel.findById(studentID);

		student.progressReport.forEach((reportCard, index) => {
			if (reportCard.gradeLevel === gradeLevel && reportCard.schoolTerm === schoolTermName) {
				student.progressReport.splice(index, 1);
			}
		});

		const updatedStudent = await student.save();
		return updatedStudent;
	}
}
