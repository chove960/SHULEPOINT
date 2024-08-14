import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Overlay, OverlayConfig, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { SqImageUploaderComponent } from '../../../../components/sq-image-uploader/sq-image-uploader.component';

import Swal from 'sweetalert2';

const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
});

import { UserService } from '../../../../services/user.service';
import { ClassroomService } from '../../../../services/classroom.service';
import { SchoolService } from '../../../../services/school.service';

import { School, Classroom } from '@shule-point/dataModels';
import { User } from '@shule-point/dataModels';

@Component({
	selector: 'shule-point-sis-manage-classrooms',
	standalone: true,
	imports: [CommonModule, RouterModule, OverlayModule, FormsModule, SqImageUploaderComponent],
	templateUrl: './manage-classrooms.component.html',
	styleUrls: ['./manage-classrooms.component.scss'],
})
export class ManageClassroomsComponent implements OnInit {
	overlayRef: OverlayRef;

	user: User;
	school: School;
	classrooms: Classroom[] = [];
	teachers: User[] = [];

	newClassroom: Classroom = {
		name: '',
		schoolRegNumber: '',
		gradeLevel: '',
		classTeacher: {
			teacherName: '',
			teacherID: '',
		},
		subjects: [],
		students: [],
	};

	classroomSizes = Array.from({ length: 60 }, (_, i) => i + 1);
	classroomSize = '';

	@ViewChild('newClassroomModal') tpl!: TemplateRef<unknown>;
	@ViewChild('newClassroomForm') form: any;

	constructor(
		private viewContainerRef: ViewContainerRef,
		private overlay: Overlay,
		private userService: UserService,
		private schoolService: SchoolService,
		private classroomService: ClassroomService
	) {}

	async ngOnInit(): Promise<void> {
		this.user = await this.userService.getUser();

		this.schoolService.getSchool(this.user.schoolRegNumber).subscribe((school) => {
			this.school = school;

			this.userService.getSchoolTeachers(this.school.registrationNumber).subscribe((schoolTeachers) => {
				schoolTeachers.forEach((teacher) => {
					this.teachers.push(teacher);
				});
			});

			this.classroomService.getClassrooms(this.school.registrationNumber).subscribe((classrooms) => {
				classrooms.forEach((classroom) => {
					this.classrooms.push(classroom);

					this.classrooms = this.classrooms.sort((a, b) => a.name.normalize().localeCompare(b.name.normalize()));
				});
			});
		});
	}

	getSeatsFilled(students) {
		let seatsTaken = 0;
		students.forEach((student) => {
			if (student.filled) {
				seatsTaken++;
			}
		});

		return seatsTaken;
	}

	openModal() {
		const config = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: ['modal-shadow'],
			panelClass: ['modal-container'],
			scrollStrategy: this.overlay.scrollStrategies.block(),
		});
		this.overlayRef = this.overlay.create(config);
		this.overlayRef.attach(new TemplatePortal(this.tpl, this.viewContainerRef));
	}

	closeModal() {
		this.form.reset();
		this.overlayRef.dispose();
	}

	onSubmitClassroom({ value, valid }: { value: Classroom; valid: boolean | null }): void {
		if (!valid) {
			return;
		}

		this.newClassroom.schoolRegNumber = this.school.registrationNumber;

		let limit = this.classroomSize as unknown as number;
		this.newClassroom.students = [];

		for (let i = 0; i < limit; i++) {
			this.newClassroom.students.push({
				seatNumber: (i + 1) as unknown as string,
				studentID: '',
				studentName: '',
				filled: false,
			});
		}

		this.school.gradeLevels.forEach((gradeLevel) => {
			if (this.newClassroom.gradeLevel === gradeLevel.name) {
				this.newClassroom.subjects = gradeLevel.subjectsOffered;
			}
		});

		this.classroomService.createClassroom(this.newClassroom).subscribe(
			(classroom: Classroom) => {
				this.classrooms.push(classroom);

				this.classrooms = this.classrooms.sort((a, b) => a.name.normalize().localeCompare(b.name.normalize()));
				this.closeModal();
			},
			(error: any) => {
				Toast.fire({
					icon: 'error',
					title: error.error.error.response.error,
				});
			}
		);
	}
}
