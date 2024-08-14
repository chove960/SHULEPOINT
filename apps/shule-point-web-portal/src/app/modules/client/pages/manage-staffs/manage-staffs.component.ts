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

import Countries from '../../../../../assets/json/countries.json';
import States from '../../../../../assets/json/states.json';

import { UserService } from '../../../../services/user.service';
import { SchoolService } from '../../../../services/school.service';
import { AuthService } from '../../../../services/auth.service';
import { User, School } from '@shule-point/dataModels';
@Component({
	selector: 'shule-point-sis-manage-staffs',
	standalone: true,
	imports: [CommonModule, RouterModule, OverlayModule, FormsModule, SqImageUploaderComponent],
	templateUrl: './manage-staffs.component.html',
	styleUrls: ['./manage-staffs.component.scss'],
})
export class ManageStaffsComponent implements OnInit {
	overlayRef: OverlayRef;

	user: User;
	school: School;
	staffs: User[] = [];
	newStaff: User = {
		firstName: '',
		lastName: '',
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
		userType: 'Client',
		userRole: 'SchoolTeacher',
		schoolRegNumber: '',
	};

	@ViewChild('newStaffModal') tpl!: TemplateRef<unknown>;
	@ViewChild('newStaffForm') form: any;

	constructor(
		private viewContainerRef: ViewContainerRef,
		private overlay: Overlay,
		private userService: UserService,
		private authService: AuthService,
		private schoolService: SchoolService
	) {}

	async ngOnInit(): Promise<void> {
		this.user = await this.userService.getUser();

		this.schoolService.getSchool(this.user.schoolRegNumber).subscribe((school) => {
			this.school = school;

			this.userService.getSchoolAdmins(this.school.registrationNumber).subscribe((schoolAdmins) => {
				schoolAdmins.forEach((admin) => {
					this.staffs.push(admin);
				});
			});

			this.userService.getSchoolTeachers(this.school.registrationNumber).subscribe((schoolTeachers) => {
				schoolTeachers.forEach((teacher) => {
					this.staffs.push(teacher);
				});
			});
		});
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

	onSubmitStaff({ value, valid }: { value: User; valid: boolean | null }): void {
		if (!valid) {
			return;
		}

		this.newStaff.schoolRegNumber = this.school.registrationNumber;

		this.authService.registerUser(this.newStaff).subscribe(
			(userData: any) => {
				this.userService.getSchoolTeachers(this.school.registrationNumber).subscribe((schoolTeachers) => {
					this.staffs = schoolTeachers;
					this.closeModal();
				});
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
