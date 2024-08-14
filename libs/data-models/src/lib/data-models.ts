export interface Classroom {
	_id?: string;
	schoolRegNumber: string;
	name: string;
	gradeLevel: string;
	classTeacher?: {
		teacherName: string;
		teacherID: string;
	};
	students: Array<{
		seatNumber: string;
		studentName: string;
		studentID: string;
		filled: boolean;
	}>;
	subjects: Array<string>;
	referenceMaterials?: Array<refMaterial>;
	attendance?: Array<classroomAttendanceReport>;
}

export interface refMaterial {
	name: string;
	file: string;
	subject: string;
	type: string;
	topic: string;
	uploadedOn: string;
}

export interface classroomAttendanceReport {
	year: string;
	months: Array<{
		month: string;
		days: Array<{
			day: string;
			attendees: Array<{
				studentID: string;
				studentName: string;
				status: string;
			}>;
		}>;
	}>;
}
export interface classroomAttendance {
	date: {
		year: string;
		month: string;
		day: string;
	};
	attendees: Array<{
		studentID: string;
		studentName: string;
		status: string;
	}>;
	createdOn: string;
}

export interface School {
	_id?: string;
	logo: string;
	name: string;
	shortName: string;
	registrationNumber: string;
	address: {
		city: string;
		state: string;
		country: string;
	};
	phoneNumber: string;
	email: string;
	website?: string;
	gradeLevels?: Array<gradeLevel>;
	schoolTerms?: Array<schoolTerm>;
}

export interface gradeLevel {
	name: string;
	subjectsOffered: Array<string>;
}

export interface schoolTerm {
	name: string;
	startMonth: string;
	endMonth: string;
	assessmentsRequired: Array<{
		id: string;
		label: string;
		value: string;
	}>;
}

export interface Student {
	_id?: string;
	classroomID?: string;
	schoolRegNumber: string;
	studentID: string;
	fullname: string;
	dateOfBirth: string;
	gender: string;
	photo: string;
	gradeLevel: string;
	verificationCode?: string;
	address: {
		streetAddress: string;
		city: string;
		state: string;
		country: string;
	};

	parentalInformation: {
		fatherInfo: {
			fullname: string;
			phoneNumber: string;
			email: string;

			address: {
				streetAddress: string;
				city: string;
				state: string;
				country: string;
			};
		};

		motherInfo: {
			fullname: string;
			phoneNumber: string;
			email: string;

			address: {
				streetAddress: string;
				city: string;
				state: string;
				country: string;
			};
		};
	};

	outstandingFees?: Array<any>;
	progressReport?: Array<studentReport>;
	attendanceReport?: Array<any>;
}

export interface StudentAssessment {
	subject: String;
	assessments: Array<{
		assessmentName: string;
		marks: string;
	}>;
	totalScore: string;
}

export interface StudentAssessmentUpdates {
	AssessmentName: string;
	AssessmentScores: Array<{
		subject: string;
		marks: string;
	}>;
}

export interface studentReport {
	year: string;
	gradeLevel: string;
	schoolTerm: string;
	termAssessments: Array<{ name: string; value: number }>;
	assessments: Array<StudentAssessment>;
}

export interface userProfile {
	profilePic: string;
	dateOfBirth: string;
	gender: string;
	address: {
		city: string;
		state: string;
		country: string;
	};
	phoneNumber: string;
}

export interface User {
	username: string;
	password: string;
	_id?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	confirmPassword?: string;
	userType?: string;
	userRole?: string;
	schoolRegNumber?: string;
	studentID?: string;
	dateJoined?: Date;
	hasProfile?: boolean;
	Profile?: userProfile;
	lastFetched?: Date;
}
