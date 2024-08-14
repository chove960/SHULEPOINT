import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
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
import { StudentService } from '../../../../services/student.service';
import { User, School, Student } from '@shule-point/dataModels';

@Component({
	selector: 'shule-point-sis-manage-students',
	standalone: true,
	imports: [CommonModule, RouterModule, OverlayModule, FormsModule, SqImageUploaderComponent],
	templateUrl: './manage-students.component.html',
	styleUrls: ['./manage-students.component.scss'],
})
export class ManageStudentsComponent implements OnInit {
	// overlayRef: OverlayRef;
	overlayRefs: OverlayRef[] = [];
	maxDateOfBirth = new Date();
	activePage: number = 1;
	totalPages = 1;

	newSearch = true;
	isSearching = false;

	user: User;
	school: School;
	students: Student[];

	currentStudent: Student;

	studentFilters = {
		gradeLevel: undefined,
		gender: undefined,
	};

	newStudent: Student = {
		schoolRegNumber: '',
		studentID: '',
		fullname: '',
		dateOfBirth: '',
		gender: 'male',
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

	studentFormStep: string = 'step1';

	searchInputText: string = '';

	@ViewChild('newStudentModal') tplCreate: TemplateRef<unknown>;
	@ViewChild('viewStudentModal') tplView: TemplateRef<unknown>;
	@ViewChild('editStudentModal') tplEdit: TemplateRef<unknown>;

	@ViewChild('newStudentForm') form: any;
	@ViewChild('searchStudentForm') searchForm: any;

	constructor(
		private viewContainerRef: ViewContainerRef,
		private overlay: Overlay,
		private userService: UserService,
		private schoolService: SchoolService,
		private studentService: StudentService,
		private router: Router,
		private route: ActivatedRoute
	) {}

	async ngOnInit(): Promise<void> {
		this.user = await this.userService.getUser();

		this.route.queryParams.subscribe((params) => {
			if (params['activePage'] !== undefined) {
				this.setActivePage(params['activePage']);
			} else {
				this.setActivePageQueryParam();
			}
		});

		this.schoolService.getSchool(this.user.schoolRegNumber).subscribe((school) => {
			this.school = school;

			this.newStudent.schoolRegNumber = school.registrationNumber;
			this.newStudent.address.country = school.address.country;
			this.newStudent.address.state = school.address.state;

			this.studentService
				.getStudents(this.school.registrationNumber, this.activePage, this.studentFilters)
				.subscribe((res) => {
					this.students = res.students;
					this.totalPages = res.meta['pages'];
				});
		});
	}

	setActivePageQueryParam() {
		const queryParams: Params = { activePage: this.activePage };

		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: queryParams,
			queryParamsHandling: 'merge', // remove to replace all query params by provided
		});

		switch (this.isSearching) {
			case true:
				this.studentService
					.searchStudent(
						this.school.registrationNumber,
						this.searchInputText,
						this.activePage,
						this.studentFilters
					)
					.subscribe((res) => {
						this.students = res.students;
						this.totalPages = res.meta['pages'];
					});
				break;
			case false:
				this.studentService
					.getStudents(this.school.registrationNumber, this.activePage, this.studentFilters)
					.subscribe((res) => {
						this.students = res.students;
						this.totalPages = res.meta['pages'];
					});
				break;

			default:
				break;
		}
	}

	setActivePage(pageNumber: number): void {
		this.activePage = pageNumber;
		this.setActivePageQueryParam();
	}

	setNewSearch(): void {
		this.newSearch = true;
		this.isSearching = true;
	}

	openNewStudentModal() {
		const config = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: ['modal-shadow'],
			panelClass: ['modal-container'],
			scrollStrategy: this.overlay.scrollStrategies.block(),
		});

		let overlayRef = this.overlay.create(config);
		overlayRef.attach(new TemplatePortal(this.tplCreate, this.viewContainerRef));

		this.overlayRefs.push(overlayRef);

		this.loadFatherCountries();
		this.loadMotherCountries();
	}

	filterStudents(filterType: string, filterValue): void {
		this.studentFilters[filterType] = filterValue.value == 'all' ? undefined : filterValue.value;

		const queryParams: Params = this.studentFilters;

		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: queryParams,
			queryParamsHandling: 'merge', // remove to replace all query params by provided
		});
	}

	openViewStudentModal(studentID) {
		const config = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: ['modal-shadow'],
			panelClass: ['modal-container'],
			scrollStrategy: this.overlay.scrollStrategies.block(),
		});

		this.students.forEach((student) => {
			if (student.studentID == studentID) {
				this.currentStudent = student;
			}
		});

		let overlayRef = this.overlay.create(config);
		overlayRef.attach(new TemplatePortal(this.tplView, this.viewContainerRef));

		this.overlayRefs.push(overlayRef);
	}

	openEditStudentModal(studentID) {
		const config = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: ['modal-shadow'],
			panelClass: ['modal-container'],
			scrollStrategy: this.overlay.scrollStrategies.block(),
		});

		this.students.forEach((student) => {
			if (student.studentID == studentID) {
				this.currentStudent = student;
			}
		});

		let overlayRef = this.overlay.create(config);
		overlayRef.attach(new TemplatePortal(this.tplEdit, this.viewContainerRef));

		this.overlayRefs.push(overlayRef);
	}

	closeModal() {
		this.overlayRefs.at(-1).dispose();
		this.overlayRefs.splice(-1, 1);
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

	getAge(dateOfBirth: string): string {
		let DOB = new Date(dateOfBirth);
		let month_diff = Date.now() - DOB.getDate();
		let age_dt = new Date(month_diff);
		let year = age_dt.getUTCFullYear();

		let age = Math.abs(year - DOB.getFullYear()) as unknown as string;

		return age;
	}

	loadFatherCountries() {
		const selectCountry: HTMLSelectElement | null = document.querySelector('#selectFatherCountry');

		Countries.forEach((country: any) => {
			const newCountry = new Option(country.name, country.iso2);
			selectCountry?.add(newCountry, undefined);
		});
	}

	loadFatherStates(country: any) {
		const selectState: HTMLSelectElement | null = document.querySelector('#selectFatherState');
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

	loadFatherPhoneCountryCode(countryISO: any) {
		const PhoneInput: HTMLInputElement = document.querySelector('#inputFatherMobileNumber .prefix') as HTMLInputElement;

		Countries.forEach((country: any) => {
			if (countryISO.value == country.iso2) {
				PhoneInput.innerHTML = `+${country.phone_code}`;
			}
		});
	}

	loadMotherCountries() {
		const selectCountry: HTMLSelectElement | null = document.querySelector('#selectMotherCountry');

		Countries.forEach((country: any) => {
			const newCountry = new Option(country.name, country.iso2);
			selectCountry?.add(newCountry, undefined);
		});
	}

	loadMotherStates(country: any) {
		const selectState: HTMLSelectElement | null = document.querySelector('#selectMotherState');
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

	loadMotherPhoneCountryCode(countryISO: any) {
		const PhoneInput: HTMLInputElement = document.querySelector('#inputMotherMobileNumber .prefix') as HTMLInputElement;

		Countries.forEach((country: any) => {
			if (countryISO.value == country.iso2) {
				PhoneInput.innerHTML = `+${country.phone_code}`;
			}
		});
	}

	setFormStep(step: string): void {
		this.studentFormStep = step;
	}

	setStudentPhotoValue(studentPhotoString: string) {
		this.newStudent.photo = studentPhotoString;
	}

	// onNewStudentSubmit({ value, valid }: { value: Student; valid: boolean | null }): void {
	
	// 	if (this.newStudent.photo === '') {
	// 		valid = false;

	// 		Toast.fire({
	// 			icon: 'error',
	// 			title: "You Need To Add Student's Photo!",
	// 		});
	// 	}

	// 	if (!valid) {
    //          console.error('Form submission blocked due to validation errors.');
	// 		return;
	// 	}

	// 	this.studentService.registerStudent(this.newStudent).subscribe(
	// 		(student) => {
	// 			this.students.push(student);

	// 			this.closeModal();
	// 		},
	// 		(error) => {
	// 			Toast.fire({
	// 				icon: 'error',
	// 				title: error.error.error,
	// 			});
	// 		}
	// 	);
	// }
	onNewStudentSubmit(form: NgForm): void {
    const { value, valid } = form;
	console.log('Gender:', this.newStudent.gender);
	console.log('Form Valid:', form.valid);
    console.log('Form Value:', form.value);
	    // Log individual control states
    for (const control in form.controls) {
        if (form.controls.hasOwnProperty(control)) {
            console.log(`${control} Valid: ${form.controls[control].valid}`);
            console.log(`${control} Value: ${form.controls[control].value}`);
        }
    }

    if (this.newStudent.photo === '') {
        // Display an error if the photo is missing
        Toast.fire({
            icon: 'error',
            title: "You Need To Add Student's Photo!",
        });
        return;
    }

    if (!valid) {
        console.error('Form submission blocked due to validation errors.');
        return;
    }

    // Proceed with form submission
    this.studentService.registerStudent(this.newStudent).subscribe(
        (student) => {
            this.students.push(student);
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

	onSearchStudentSubmit({ value, valid }: { value: String; valid: boolean | null }): void {
		if (!valid) {
			return;
		}

		this.studentService
			.searchStudent(
				this.school.registrationNumber,
				value['search'],
				this.newSearch ? 1 : this.activePage,
				this.studentFilters
			)
			.subscribe(
				(res) => {
					this.students = res.students;

					console.log(res.meta);

					if (this.newSearch) {
						this.setActivePage(1);
						this.totalPages = res.meta['pages'];
						this.newSearch = false;
						this.isSearching = true;
					}
				},
				(error) => {
					Toast.fire({
						icon: 'error',
						title: error.error.error,
					});
				}
			);
	}
	cancelSearch(): void {
		this.isSearching = false;
		this.searchForm.reset();

		this.ngOnInit();
	}
}
