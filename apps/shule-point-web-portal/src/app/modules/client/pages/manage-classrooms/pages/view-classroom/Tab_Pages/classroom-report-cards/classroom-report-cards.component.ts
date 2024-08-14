import { Component, OnInit, Input, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Overlay, OverlayConfig, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import Swal from 'sweetalert2';

const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
});

import {
	Classroom,
	Student,
	User,
	School,
	studentReport,
	StudentAssessment,
	StudentAssessmentUpdates,
} from '@shule-point/dataModels';

import { UserService } from '../../../../../../../../services/user.service';
import { StudentService } from '../../../../../../../../services/student.service';
import { SchoolService } from '../../../../../../../../services/school.service';

@Component({
	selector: 'shule-point-sis-classroom-report-cards',
	standalone: true,
	imports: [CommonModule, OverlayModule, FormsModule],
	templateUrl: './classroom-report-cards.component.html',
	styleUrls: ['./classroom-report-cards.component.scss'],
})
export class ClassroomReportCardsComponent implements OnInit {
	@Input('classroom') classroom: Classroom;
	overlayRef: OverlayRef;

	user: User;
	school: School;

	today;
	datepipe: DatePipe = new DatePipe('en-US', 'Africa/Nairobi');

	availableStudents = [];
	currentStudent: Student;

	@ViewChild('newReportCardForm') ReportCardForm: any;

	@ViewChild('ViewStudentReportCardModal') tplViewReportCard: TemplateRef<unknown>;

	constructor(
		private viewContainerRef: ViewContainerRef,
		private overlay: Overlay,
		private studentService: StudentService,
		private schoolService: SchoolService,
		private userService: UserService
	) {}

	async ngOnInit(): Promise<void> {
		this.today = this.datepipe.transform(Date.now(), 'dd/MMM/YYYY');

		this.user = await this.userService.getUser();

		this.schoolService.getSchool(this.user.schoolRegNumber).subscribe((school) => {
			this.school = school;
		});
	}

	getAvailableStudents(): Array<any> {
		return this.classroom.students.filter((student) => student.filled === true);
	}

	openStudentReportCardModal(studentID) {
		this.currentStudent = {
			schoolRegNumber: '',
			studentID: '',
			fullname: '',
			dateOfBirth: '',
			gender: '',
			photo: '',
			gradeLevel: '',
			address: {
				streetAddress: '',
				city: '',
				state: '',
				country: '',
			},
			parentalInformation: {
				fatherInfo: {
					fullname: '',
					phoneNumber: '',
					email: '',

					address: {
						streetAddress: '',
						city: '',
						state: '',
						country: '',
					},
				},

				motherInfo: {
					fullname: '',
					phoneNumber: '',
					email: '',

					address: {
						streetAddress: '',
						city: '',
						state: '',
						country: '',
					},
				},
			},
		};

		const config = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: ['modal-shadow'],
			panelClass: ['modal-container'],
		});

		this.studentService.getStudent(this.classroom.schoolRegNumber, studentID).subscribe((student) => {
			this.currentStudent = student;
		});

		this.overlayRef = this.overlay.create(config);

		this.overlayRef.attach(new TemplatePortal(this.tplViewReportCard, this.viewContainerRef));
	}

	closeModal() {
		this.overlayRef.dispose();
	}

	createStudentReport() {
		let schoolTermOptions = {};

		this.school.schoolTerms.forEach((schoolTerm) => {
			schoolTermOptions[schoolTerm.name] = schoolTerm.name;
		});

		Swal.fire({
			title: `Choose School Term`,
			input: 'select',
			inputOptions: schoolTermOptions,
			inputPlaceholder: 'Select a School Term',
			confirmButtonText: 'Create Report Card',
			confirmButtonColor: '#28a745',
			showCancelButton: true,
			cancelButtonColor: '#ff3333',
		}).then((result) => {
			if (result.value !== '' && result.isConfirmed) {
				let selectedTermAssessments = [];
				let subjectsAssessments = [];

				this.school.schoolTerms.forEach((schoolTerm) => {
					if (result.value === schoolTerm.name) {
						schoolTerm.assessmentsRequired.forEach((assessment) => {
							selectedTermAssessments.push({ name: assessment.label, value: Number(assessment.value) });
						});
					}
				});

				this.school.gradeLevels.forEach((gradeLevel) => {
					if (gradeLevel.name === this.classroom.gradeLevel) {
						gradeLevel.subjectsOffered.forEach((subject) => {
							let subjectAssessments: StudentAssessment = {
								subject: subject,
								assessments: [],
								totalScore: 'N/A',
							};

							selectedTermAssessments.forEach((Assessment) => {
								subjectAssessments.assessments.push({ assessmentName: Assessment.name, marks: 'N/A' });
							});

							subjectsAssessments.push(subjectAssessments);
						});
					}
				});

				const studentReport: studentReport = {
					year: String(new Date().getFullYear()),
					gradeLevel: this.currentStudent.gradeLevel,
					schoolTerm: result.value,
					termAssessments: selectedTermAssessments,
					assessments: subjectsAssessments,
				};

				this.studentService.createProgressReport(this.currentStudent._id, studentReport).subscribe(
					(student) => {
						this.currentStudent = student;
					},
					(error) => {
						Toast.fire({
							icon: 'error',
							title: error.error.error,
						});
					}
				);
			} else if (result.value === '' && result.isConfirmed) {
				Toast.fire({
					title: `You need to select a School Term`,
					icon: 'info',
				});
			}
		});
	}

	editReportCard(schoolTerm, AssessmentName) {
		let subjectsAssessmentsInputs = '';
		let subjects = [];

		this.school.gradeLevels.forEach((gradeLevel) => {
			if (gradeLevel.name === this.classroom.gradeLevel) {
				gradeLevel.subjectsOffered.forEach((subject) => {
					subjects.push(subject);

					subjectsAssessmentsInputs += `
					<div class="form-row">
						<div class="input-group">
							<input id="${subject}_marks" />
							<label>${subject}</label>
						</div>
					</div>`;
				});
			}
		});

		Swal.fire({
			title: `${schoolTerm} - ${AssessmentName}`,
			html: subjectsAssessmentsInputs,
			confirmButtonText: `Update ${AssessmentName}`,
			confirmButtonColor: '#28a745',
			showCancelButton: true,
			cancelButtonColor: '#ff3333',
			preConfirm: () => {
				let inputValues = [];

				subjects.forEach((subject) => {
					let subjectInputValue = document.getElementById(`${subject}_marks`) as HTMLInputElement;

					inputValues.push({ subject: subject, marks: subjectInputValue.value });
				});

				return inputValues;
			},
		}).then((result) => {
			if (result.isConfirmed) {
				let UpdatedAssessment = {
					AssessmentName: AssessmentName,
					AssessmentScores: result.value,
				};

				this.studentService
					.updateProgressReport(this.currentStudent._id, this.classroom.gradeLevel, schoolTerm, UpdatedAssessment)
					.subscribe(
						(student) => {
							this.currentStudent = student;
						},
						(error) => {
							Toast.fire({
								icon: 'error',
								title: error.error.error,
							});
						}
					);
			}
		});
	}

	deleteReportCard(schoolTerm, gradeLevel) {
		Swal.fire({
			title: `Are you sure you want to delete progress report '${gradeLevel}-${schoolTerm}'?`,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#ff3333',
			confirmButtonText: `Yes, Delete!`,
		}).then((result) => {
			if (result.isConfirmed) {
				this.studentService.deleteProgressReport(this.currentStudent._id, schoolTerm, gradeLevel).subscribe(
					(student) => {
						this.currentStudent = student;
					},
					(error) => {
						Toast.fire({
							icon: 'error',
							title: error.error.error,
						});
					}
				);

				Toast.fire({
					icon: 'success',
					title: `${gradeLevel}-${schoolTerm} for ${this.currentStudent.fullname} has been deleted`,
				});
			}
		});
	}

	onSubmitReportCard({ value, valid }: { value: any; valid: boolean | null }): void {
		if (!valid) {
			return;
		}
	}
}
