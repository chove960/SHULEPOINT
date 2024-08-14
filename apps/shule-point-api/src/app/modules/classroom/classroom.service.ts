import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Classroom, classroomAttendance, classroomAttendanceReport, refMaterial, Student } from '@shule-point/dataModels';

import { FileUploadService } from '../../services/fileUpload.service';

@Injectable()
export class ClassRoomService {
	constructor(
		@InjectModel('Classroom') private readonly classroomModel: Model<Classroom>,
		@InjectModel('Student') private readonly studentModel: Model<Student>,
		private fileUploadService: FileUploadService
	) {}

	async getClassroom(classroomID): Promise<Classroom> {
		const classroom = await this.classroomModel.findOne({ _id: classroomID });

		if (!classroom) {
			throw new HttpException(
				{
					status: HttpStatus.NOT_FOUND,
					error: 'Classroom not found',
				},
				HttpStatus.NOT_FOUND
			);
		}

		return classroom;
	}

	async getClassrooms(schoolRegNumber): Promise<Classroom[]> {
		const classrooms = await this.classroomModel.find({ schoolRegNumber: schoolRegNumber });

		return classrooms;
	}

	async createClassrooms(registerParams: Classroom): Promise<Classroom> {
		try {
			const classroomExists = await this.classroomModel.findOne({
				name: registerParams.name,
				schoolRegNumber: registerParams.schoolRegNumber,
			});

			if (classroomExists) {
				throw new HttpException(
					{
						status: HttpStatus.BAD_REQUEST,
						error: 'Classroom already registered',
					},
					HttpStatus.BAD_REQUEST
				);
			}

			const classroom = new this.classroomModel({
				name: registerParams.name,
				schoolRegNumber: registerParams.schoolRegNumber,
				gradeLevel: registerParams.gradeLevel,
				classTeacher: registerParams.classTeacher,
				students: registerParams.students,
				subjects: registerParams.subjects,
			});

			try {
				const savedClassroom = await classroom.save();

				return savedClassroom;
			} catch (err) {
				throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
			}
		} catch (err) {
			throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
		}
	}

	async assignSeat(classroomID, registerParams): Promise<Classroom> {
		const classroom = await this.classroomModel.findOne({ _id: classroomID });

		classroom.students.forEach((student, index) => {
			if (student.seatNumber === registerParams.seatNumber) {
				classroom.students[index] = registerParams;
			}
		});

		try {
			const savedClassroom = await classroom.save();

			const student = await this.studentModel.findById(registerParams.studentID);

			student.classroomID = classroom._id;

			await student.save();

			return savedClassroom;
		} catch (err) {
			throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
		}
	}

	async createAttendance(classroomID, attendance: classroomAttendance): Promise<Classroom> {
		const classroom = await this.classroomModel.findOne({ _id: classroomID });

		if (classroom.attendance.length > 0) {
			classroom.attendance.forEach((attendanceYear) => {
				if (attendanceYear.year === attendance.date.year) {
					attendanceYear.months.forEach((attendanceMonth) => {
						if (attendanceMonth.month === attendance.date.month) {
							let newAttendanceDay = {
								day: attendance.date.day,
								attendees: attendance.attendees,
							};

							attendanceMonth.days.push(newAttendanceDay);
						}
					});
				}
			});
		} else {
			let newAttendanceYear: classroomAttendanceReport = {
				year: attendance.date.year,
				months: [],
			};

			let newAttendanceMonth = {
				month: attendance.date.month,
				days: [],
			};

			let newAttendanceDay = {
				day: attendance.date.day,
				attendees: attendance.attendees,
			};

			newAttendanceMonth.days.push(newAttendanceDay);
			newAttendanceYear.months.push(newAttendanceMonth);
			classroom.attendance.push(newAttendanceYear);
		}

		classroom.markModified('attendance');

		try {
			const savedClassroom = await classroom.save();

			attendance.attendees.forEach(async (student) => {
				let currentStudent = await this.studentModel.findById(student.studentID);
				let newAttendance = {
					date: attendance.date,
					status: student.status,
					createdOn: attendance.createdOn,
				};

				currentStudent.attendanceReport.push(newAttendance);

				await currentStudent.save();
			});

			return savedClassroom;
		} catch (err) {
			throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, HttpStatus.BAD_REQUEST);
		}
	}

	async uploadRefMaterials(classroomID, uploadRefMaterials: refMaterial): Promise<Classroom> {
		const classroom = await this.classroomModel.findOne({ _id: classroomID });

		const refMaterialsLocation = await this.fileUploadService.uploadRefMaterials(
			classroom.schoolRegNumber,
			classroomID,
			uploadRefMaterials.subject,
			uploadRefMaterials.file,
			uploadRefMaterials.name
		);

		const refMaterialsToUpload: refMaterial = {
			name: uploadRefMaterials.name,
			file: refMaterialsLocation,
			subject: uploadRefMaterials.subject,
			type: uploadRefMaterials.type,
			topic: uploadRefMaterials.topic,
			uploadedOn: uploadRefMaterials.uploadedOn,
		};

		classroom.referenceMaterials.push(refMaterialsToUpload);

		classroom.markModified('referenceMaterials');
		const updatedClassroom = await classroom.save();

		return updatedClassroom;
	}
}
