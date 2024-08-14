import * as mongoose from 'mongoose';

export const classroomSchema = new mongoose.Schema({
	schoolRegNumber: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	gradeLevel: {
		type: String,
		required: true,
	},
	classTeacher: {
		teacherName: {
			type: String,
			required: true,
		},
		teacherID: {
			type: String,
			required: true,
		},
	},
	students: {
		type: Array,
		default: [],
	},
	subjects: {
		type: Array,
		default: [],
	},
	referenceMaterials: {
		type: Array,
		default: [],
	},
	attendance: {
		type: Array,
		default: [],
	},
});

export const schoolSchema = new mongoose.Schema({
	logo: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	shortName: {
		type: String,
		required: true,
	},
	registrationNumber: {
		type: String,
		required: true,
	},
	address: {
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
	},
	phoneNumber: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	website: {
		type: String,
		default: '-',
	},
	gradeLevels: {
		type: Array,
		default: [],
	},
	schoolTerms: {
		type: Array,
		default: [],
	},
});

export const studentSchema = new mongoose.Schema({
	schoolRegNumber: {
		type: String,
		required: true,
	},
	classroomID: {
		type: String,
		default: '',
	},
	studentID: {
		type: String,
		required: true,
	},
	fullname: {
		type: String,
		required: true,
	},
	dateOfBirth: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		required: true,
	},
	photo: {
		type: String,
		required: true,
	},
	gradeLevel: {
		type: String,
		required: true,
	},
	verificationCode: {
		type: String,
		required: true,
	},
	address: {
		streetAddress: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		},
	},

	parentalInformation: {
		fatherInfo: {
			fullname: {
				type: String,
				required: true,
			},
			phoneNumber: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},

			address: {
				streetAddress: {
					type: String,
					required: true,
				},
				city: {
					type: String,
					required: true,
				},
				state: {
					type: String,
					required: true,
				},
				country: {
					type: String,
					required: true,
				},
			},
		},

		motherInfo: {
			fullname: {
				type: String,
				required: true,
			},
			phoneNumber: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},

			address: {
				streetAddress: {
					type: String,
					required: true,
				},
				city: {
					type: String,
					required: true,
				},
				state: {
					type: String,
					required: true,
				},
				country: {
					type: String,
					required: true,
				},
			},
		},
	},
	outstandingFees: {
		type: Array,
		default: [],
	},
	progressReport: {
		type: Array,
		default: [],
	},
	attendanceReport: {
		type: Array,
		default: [],
	},
});

export const profileSchema = new mongoose.Schema({
	profilePic: {
		type: String,
	},
	dateOfBirth: {
		type: String,
	},
	gender: {
		type: String,
	},
	address: {
		type: Object,
		city: {
			type: String,
		},
		state: {
			type: String,
		},
		country: {
			type: String,
		},
	},
	phoneNumber: {
		type: String,
	},
});

export const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	dateJoined: {
		type: Date,
		default: Date.now,
	},
	userType: {
		type: String,
		default: 'Client',
	},
	userRole: {
		type: String,
		default: 'Student',
	},
	schoolRegNumber: {
		type: String,
		required: false,
	},
	studentID: {
		type: String,
		required: false,
	},
	hasProfile: {
		type: Boolean,
		default: false,
	},
	Profile: {
		type: profileSchema,
		default: {},
	},
});
