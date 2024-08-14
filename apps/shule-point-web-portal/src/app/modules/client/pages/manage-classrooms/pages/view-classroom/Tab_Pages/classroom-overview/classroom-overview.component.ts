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

import { Classroom, Student } from '@shule-point/dataModels';

import { StudentService } from '../../../../../../../../services/student.service';
import { ClassroomService } from '../../../../../../../../services/classroom.service';

@Component({
	selector: 'shule-point-sis-classroom-overview',
	standalone: true,
	imports: [CommonModule, OverlayModule, FormsModule],
	templateUrl: './classroom-overview.component.html',
	styleUrls: ['./classroom-overview.component.scss'],
})
export class ClassroomOverviewComponent implements OnInit {
	@Input('classroom') classroom: Classroom;
	overlayRef: OverlayRef;

	newSeatAssignment = {
		seatNumber: '',
		studentID: '',
		studentName: '',
		filled: true,
	};

	currentStudent: Student;
	availableStudents: Student[];

	@ViewChild('newSeatAssignmentForm') seatAssignmentForm: any;

	@ViewChild('assignStudentModal') tplAssign: TemplateRef<unknown>;
	@ViewChild('viewStudentModal') tplView: TemplateRef<unknown>;

	constructor(
		private viewContainerRef: ViewContainerRef,
		private overlay: Overlay,
		private studentService: StudentService,
		private classroomService: ClassroomService
	) {}

	ngOnInit(): void {}

	setStudentName(studentName): void {
		this.availableStudents.forEach((student) => {
			if (student._id === studentName) {
				this.newSeatAssignment.studentName = student.fullname;
			}
		});
	}

	seatTaken(seatNumber: string): boolean {
		let status = false;

		this.classroom.students.forEach((student) => {
			if (seatNumber === student.seatNumber) {
				status = student.filled;
			}
		});

		return status;
	}

	getStudentID(seatNumber: string): string {
		let studentID = '';

		this.classroom.students.forEach((student) => {
			if (seatNumber === student.seatNumber) {
				studentID = student.studentID;
			}
		});

		return studentID;
	}

	getAge(dob): string {
		var today = new Date();
		var birthDate = new Date(dob);
		var age = today.getFullYear() - birthDate.getFullYear();
		var m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age.toString();
	}

	openStudentSeatModal(seatNumber) {
		if (this.seatTaken(seatNumber)) {
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

			this.studentService
				.getStudent(this.classroom.schoolRegNumber, this.getStudentID(seatNumber))
				.subscribe((student) => {
					this.currentStudent = student;
				});

			this.openSeatViewModal();
		} else {
			this.studentService
				.getStudentsByGradeLevel(this.classroom.schoolRegNumber, this.classroom.gradeLevel)
				.subscribe((students) => {
					this.availableStudents = [];

					students.forEach((student) => {
						if (student.classroomID === '') {
							this.availableStudents.push(student);
						}
					});
				});
			this.newSeatAssignment.seatNumber = seatNumber;

			this.openSeatAssignModal();
		}
	}

	openSeatAssignModal() {
		const config = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: ['modal-shadow'],
			panelClass: ['modal-container'],
			disposeOnNavigation: true,
		});

		this.overlayRef = this.overlay.create(config);

		this.overlayRef.attach(new TemplatePortal(this.tplAssign, this.viewContainerRef));
	}

	openSeatViewModal() {
		const config = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: ['modal-shadow'],
			panelClass: ['modal-container'],
		});

		this.overlayRef = this.overlay.create(config);

		this.overlayRef.attach(new TemplatePortal(this.tplView, this.viewContainerRef));
	}

	closeModal() {
		this.overlayRef.dispose();
	}

	onSubmitSeatAssignment({ value, valid }: { value: any; valid: boolean | null }): void {
		if (!valid) {
			return;
		}

		this.classroomService.assignSeat(this.classroom._id, this.newSeatAssignment).subscribe(
			(classroom) => {
				this.classroom = classroom;
				this.closeModal();
			},
			(error) => {
				Toast.fire({
					icon: 'error',
					title: error.error.error,
				});
			}
		);
	}
}
