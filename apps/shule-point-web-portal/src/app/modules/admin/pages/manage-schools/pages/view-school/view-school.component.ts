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

import { User, School } from '@shule-point/dataModels';

import { SchoolService } from '../../../../../../services/school.service';
import { AuthService } from '../../../../../../services/auth.service';
import { UserService } from '../../../../../../services/user.service';

import Countries from '../../../../../../../assets/json/countries.json';

@Component({
	selector: 'shule-point-sis-view-school',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterModule, OverlayModule],
	templateUrl: './view-school.component.html',
	styleUrls: ['./view-school.component.scss'],
})
export class ViewSchoolComponent implements OnInit {
	overlayRef: OverlayRef;
	school: School;
	schoolAdmins: User[];

	newSchoolAdmin: User = {
		firstName: '',
		lastName: '',
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
		userType: 'Client',
		userRole: 'SchoolAdmin',
		schoolRegNumber: this.route.snapshot.paramMap.get('schoolRegNumber') as string,
	};

	passwordMatch = false;

	@ViewChild('newSchoolAdminModal') tpl!: TemplateRef<unknown>;
	@ViewChild('newSchoolAdminForm') form: any;

	constructor(
		private route: ActivatedRoute,
		private viewContainerRef: ViewContainerRef,
		private overlay: Overlay,
		private schoolService: SchoolService,
		private authService: AuthService,
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.schoolService.getSchool(this.route.snapshot.paramMap.get('schoolRegNumber') as string).subscribe((school) => {
			this.school = school;

			this.userService.getSchoolAdmins(this.school.registrationNumber).subscribe((schoolAdmins) => {
				this.schoolAdmins = schoolAdmins;
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

	onSubmit({ value, valid }: { value: User; valid: boolean | null }): void {
		if (!valid) {
			return;
		}

		this.authService.registerUser(this.newSchoolAdmin).subscribe(
			(userData: any) => {
				this.userService
					.getSchoolAdmins(this.route.snapshot.paramMap.get('schoolRegNumber') as string)
					.subscribe((schoolAdmins) => {
						this.schoolAdmins = schoolAdmins;
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
