import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Overlay, OverlayConfig, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import Swal from 'sweetalert2';

const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
});

import { gradeLevel, School, schoolTerm, User } from '@shule-point/dataModels';

import { SchoolService } from '../../../../services/school.service';
import { UserService } from '../../../../services/user.service';

import Countries from '../../../../../assets/json/countries.json';

@Component({
	selector: 'shule-point-sis-manage-school',
	standalone: true,
	imports: [CommonModule, RouterModule, OverlayModule, FormsModule],
	templateUrl: './manage-school.component.html',
	styleUrls: ['./manage-school.component.scss'],
})
export class ManageSchoolComponent implements OnInit {
	overlayRef: OverlayRef;

	user: User;
	school: School;

	newGradeLevel: gradeLevel = {
		name: '',
		subjectsOffered: [],
	};

	newSchoolTerm: schoolTerm = {
		name: '',
		startMonth: '',
		endMonth: '',
		assessmentsRequired: [],
	};

	months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	@ViewChild('addGradeLevelModal') gradeLevelTpl!: TemplateRef<unknown>;
	@ViewChild('addSchoolTermModal') schoolTermTpl!: TemplateRef<unknown>;

	@ViewChild('newGradeLevelForm') gradeLevelForm: any;
	@ViewChild('newSchoolTermForm') schoolTermForm: any;

	constructor(
		private viewContainerRef: ViewContainerRef,
		private overlay: Overlay,
		private schoolService: SchoolService,
		private userService: UserService
	) {}

	async ngOnInit(): Promise<void> {
		this.user = await this.userService.getUser();

		this.schoolService.getSchool(this.user.schoolRegNumber).subscribe((school) => {
			this.school = school;
		});
	}

	openGradeLevelModal() {
		const config = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: ['modal-shadow'],
			panelClass: ['modal-container'],
			scrollStrategy: this.overlay.scrollStrategies.block(),
		});
		this.overlayRef = this.overlay.create(config);
		this.overlayRef.attach(new TemplatePortal(this.gradeLevelTpl, this.viewContainerRef));
	}

	openSchoolTermModal() {
		const config = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: ['modal-shadow'],
			panelClass: ['modal-container'],
			scrollStrategy: this.overlay.scrollStrategies.block(),
		});
		this.overlayRef = this.overlay.create(config);
		this.overlayRef.attach(new TemplatePortal(this.schoolTermTpl, this.viewContainerRef));
	}

	closeModal() {
		this.overlayRef.dispose();
	}

	getCountryName(countryISO2: string | undefined): string {
		let countryName = '';

		Countries.forEach((country) => {
			if (country.iso2 === countryISO2) {
				countryName = country.name;
			}
		});

		return countryName;
	}

	getFullPhoneNumber(countryISO2: string | undefined, phoneNumber: string): string {
		let fullNumber = '';

		if (phoneNumber[0] == '0') {
			let phoneNumberList = phoneNumber.split('0');
			phoneNumber = phoneNumberList[0];
		}

		Countries.forEach((country) => {
			if (country.iso2 === countryISO2) {
				fullNumber = '+' + country.phone_code + ' (0) ' + phoneNumber;
			}
		});

		return fullNumber;
	}

	deleteGradeLevel(gradeLevelName) {
		Swal.fire({
			title: `Are you sure you want to delete ${gradeLevelName}?`,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#ff3333',
			confirmButtonText: 'Yes, delete!',
		}).then((result) => {
			if (result.isConfirmed) {
				this.schoolService.removeGradeLevel(this.school.registrationNumber, gradeLevelName).subscribe(
					(school) => {
						this.school = school;

						Toast.fire({
							icon: 'success',
							title: `${gradeLevelName} has been deleted`,
						});
					},
					(error) => {
						Toast.fire({
							icon: 'error',
							title: error.error.message,
						});
					}
				);
			}
		});
	}

	deleteSchoolTerm(schoolTermName) {
		Swal.fire({
			title: `Are you sure you want to delete ${schoolTermName}?`,
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#ff3333',
			confirmButtonText: 'Yes, delete!',
		}).then((result) => {
			if (result.isConfirmed) {
				this.schoolService.removeSchoolTerm(this.school.registrationNumber, schoolTermName).subscribe(
					(school) => {
						this.school = school;
						Toast.fire({
							icon: 'success',
							title: `${schoolTermName} has been deleted`,
						});
					},
					(error) => {
						Toast.fire({
							icon: 'error',
							title: error.error.message,
						});
					}
				);
			}
		});
	}

	addAssessmentInputRow(): void {
		this.newSchoolTerm.assessmentsRequired.push({
			id: `${this.newSchoolTerm.assessmentsRequired.length + 1}`,
			label: '',
			value: '',
		});
	}

	removeAssessmentInputRow(assessmentId: string): void {
		this.newSchoolTerm.assessmentsRequired.forEach((assessment, index) => {
			if (assessment.id === assessmentId) {
				this.newSchoolTerm.assessmentsRequired.splice(index, 1);
			}
		});

		this.newSchoolTerm.assessmentsRequired.forEach((assessment, index) => {
			if (assessment.id !== String(index + 1)) {
				assessment.id = String(index + 1);
			}
		});
	}

	onSubmitGradeLevel({ value, valid }: { value: gradeLevel; valid: boolean | null }): void {
		if (!valid) {
			return;
		}

		let subjectsListString = this.newGradeLevel.subjectsOffered as unknown as string;

		let subjectsList = subjectsListString.split(/(?:,| )+/);

		this.newGradeLevel.subjectsOffered = subjectsList;

		this.schoolService.addGradeLevel(this.school.registrationNumber, this.newGradeLevel).subscribe(
			(school) => {
				this.school = school;

				this.gradeLevelForm.reset();
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

	onSubmitSchoolTerm({ value, valid }: { value: gradeLevel; valid: boolean | null }): void {
		if (!valid) {
			return;
		}

		this.newSchoolTerm.assessmentsRequired.map((x) => {
			let assessmentInputLabel: HTMLInputElement | null = document.querySelector(`#assessmentInputLabel-${x.id}`);
			let assessmentInputValue: HTMLInputElement | null = document.querySelector(`#assessmentInputValue-${x.id}`);
			x.label = assessmentInputLabel!.value;
			x.value = assessmentInputValue!.value;
		});

		this.schoolService.addSchoolTerm(this.school.registrationNumber, this.newSchoolTerm).subscribe(
			(school) => {
				this.school = school;

				this.schoolTermForm.reset();
				this.newSchoolTerm.assessmentsRequired = [];
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
