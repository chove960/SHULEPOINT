import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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

import { School } from '@shule-point/dataModels';
import { SchoolService } from '../../../../services/school.service';

@Component({
	selector: 'shule-point-sis-manage-schools',
	standalone: true,
	imports: [CommonModule, RouterModule, OverlayModule, FormsModule, SqImageUploaderComponent],
	templateUrl: './manage-schools.component.html',
	styleUrls: ['./manage-schools.component.scss'],
})
export class ManageSchoolsComponent implements OnInit {
	overlayRef: OverlayRef;

	schools: School[] = [];

	newSchool: School = {
		logo: '',
		name: '',
		shortName: '',
		registrationNumber: '',
		address: {
			city: '',
			state: '',
			country: '',
		},
		phoneNumber: '',
		email: '',
	};

	@ViewChild('newSchoolModal') tpl!: TemplateRef<unknown>;
	@ViewChild('newSchoolForm') form: any;

	constructor(
		private viewContainerRef: ViewContainerRef,
		private overlay: Overlay,
		private schoolService: SchoolService
	) {}

	ngOnInit(): void {
		this.schoolService.getSchools().subscribe((schools) => {
			this.schools = schools;
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

	openModal() {
		const config = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: ['modal-shadow'],
			panelClass: ['modal-container'],
			scrollStrategy: this.overlay.scrollStrategies.block(),
		});
		this.overlayRef = this.overlay.create(config);
		this.overlayRef.attach(new TemplatePortal(this.tpl, this.viewContainerRef));

		this.loadCountries();
	}

	closeModal() {
		this.form.reset();
		this.overlayRef.dispose();
	}

	loadCountries() {
		const selectCountry: HTMLSelectElement | null = document.querySelector('#selectCountry');

		Countries.forEach((country: any) => {
			const newCountry = new Option(country.name, country.iso2);
			selectCountry?.add(newCountry, undefined);
		});
	}

	loadStates(country: any) {
		const selectState: HTMLSelectElement | null = document.querySelector('#selectState');
		let i: number = selectState?.length as number;

		if ((selectState?.length as number) > 1) {
			for (i > 1; i--; ) {
				selectState?.remove(selectState.length - 1);
			}
		}

		States.forEach((state: any) => {
			if (state.country_code == country.value) {
				const newState = new Option(state.name, `${state.name}`);
				selectState?.add(newState, undefined);
			}
		});
	}

	loadPhoneCountryCode(countryISO: any) {
		const phoneInput: HTMLInputElement = document.querySelector('#inputMobileNumber .prefix') as HTMLInputElement;

		Countries.forEach((country: any) => {
			if (countryISO.value == country.iso2) {
				phoneInput.innerHTML = `+${country.phone_code}`;
			}
		});
	}

	setSchoolImageValue(schoolImageString: string) {
		this.newSchool.logo = schoolImageString;
	}

	onSubmit({ value, valid }: { value: School; valid: boolean | null }): void {
		if (this.newSchool.logo === '') {
			valid = false;

			Toast.fire({
				icon: 'error',
				title: 'You Need To Add The School Logo!',
			});
		}

		if (!valid) {
			return;
		}

		this.schoolService.registerSchool(this.newSchool).subscribe(
			(school) => {
				this.schools.push(school);

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
