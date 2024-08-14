import { Component, OnInit, Input, ViewChild, TemplateRef, ViewContainerRef, ViewEncapsulation } from '@angular/core';
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

import { Classroom, classroomAttendance } from '@shule-point/dataModels';

import { StudentService } from '../../../../../../../../services/student.service';
import { ClassroomService } from '../../../../../../../../services/classroom.service';

@Component({
	selector: 'shule-point-sis-classroom-attendance',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [CommonModule, OverlayModule, FormsModule],
	templateUrl: './classroom-attendance.component.html',
	styleUrls: ['./classroom-attendance.component.scss'],
})
export class ClassroomAttendanceComponent implements OnInit {
	@Input('classroom') classroom: Classroom;
	overlayRef: OverlayRef;

	today;
	datepipe: DatePipe = new DatePipe('en-US', 'Africa/Nairobi');

	// getting new date, current year and month
	date = new Date();
	currYear = this.date.getFullYear();
	currMonth = this.date.getMonth();

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

	newAttendance: classroomAttendance = {
		date: {
			day: this.datepipe.transform(Date.now(), 'dd'),
			month: this.datepipe.transform(Date.now(), 'MMMM'),
			year: this.datepipe.transform(Date.now(), 'YYYY'),
		},
		attendees: [],
		createdOn: this.datepipe.transform(Date.now(), 'dd-MM-YYYY'),
	};

	currAttendance: Array<{
		studentID: string;
		studentName: string;
		status: string;
	}> = [];

	@ViewChild('newAttendanceForm') AttendanceForm: any;

	@ViewChild('createAttendanceModal') tplCreateAttendance: TemplateRef<unknown>;

	constructor(
		private viewContainerRef: ViewContainerRef,
		private overlay: Overlay,
		private studentService: StudentService,
		private classroomService: ClassroomService
	) {}

	ngOnInit(): void {
		this.today = this.datepipe.transform(Date.now(), 'dd/MMM/YYYY');
		this.renderCalendar();

		let prevNextIcon = document.querySelectorAll('.icons svg');

		prevNextIcon.forEach((icon) => {
			// getting prev and next icons
			icon.addEventListener('click', () => {
				// adding click event on both icons
				// if clicked icon is previous icon then decrement current month by 1 else increment it by 1
				this.currMonth = icon.id === 'prev' ? this.currMonth - 1 : this.currMonth + 1;

				if (this.currMonth < 0 || this.currMonth > 11) {
					// if current month is less than 0 or greater than 11
					// creating a new date of current year & month and pass it as date value
					this.date = new Date(this.currYear, this.currMonth, new Date().getDate());
					this.currYear = this.date.getFullYear(); // updating current year with new date year
					this.currMonth = this.date.getMonth(); // updating current month with new date month
				} else {
					this.date = new Date(); // pass the current date as date value
				}
				this.renderCalendar(); // calling renderCalendar function
			});
		});

		let todayCalendarButton: HTMLElement = document.querySelector(
			'.attendance-body .calendar-wrapper .calendar ul.days li.active'
		);
		todayCalendarButton.click();
	}

	renderCalendar() {
		let daysTag: HTMLElement = document.querySelector('.days');
		let currentDate: HTMLElement = document.querySelector('.current-date');

		// storing full name of all months in array

		let firstDayOfMonth = new Date(this.currYear, this.currMonth, 1).getDay(), // getting first day of month
			lastDateOfMonth = new Date(this.currYear, this.currMonth + 1, 0).getDate(), // getting last date of month
			lastDayOfMonth = new Date(this.currYear, this.currMonth, lastDateOfMonth).getDay(), // getting last day of month
			lastDateOfLastMonth = new Date(this.currYear, this.currMonth, 0).getDate(); // getting last date of previous month

		let liTag = '';

		for (let i = firstDayOfMonth; i > 0; i--) {
			// creating li of previous month last days
			liTag += `<li id="prevMonth-${i}" data-day="${i}" class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
		}

		for (let i = 1; i <= lastDateOfMonth; i++) {
			// creating li of all days of current month
			// adding active class to li if the current day, month, and year matched
			let isToday =
				i === this.date.getDate() &&
				this.currMonth === new Date().getMonth() &&
				this.currYear === new Date().getFullYear()
					? 'active'
					: '';
			liTag += `<li id="currMonth-${i}" data-day="${i}" class="${isToday}">${i}</li>`;
		}

		for (let i = lastDayOfMonth; i < 6; i++) {
			// creating li of next month first days
			liTag += `<li id="nextMonth-${i}" data-day="${i}" class="inactive">${i - lastDayOfMonth + 1}</li>`;
		}

		currentDate.innerHTML = `${this.months[this.currMonth]} ${this.currYear}`; // passing current mon and yr as currentDate text
		daysTag.innerHTML = liTag;

		for (let i = firstDayOfMonth; i > 0; i--) {
			document.getElementById(`prevMonth-${i}`).addEventListener('click', this.viewAttendance.bind(this), false);
		}

		for (let i = 1; i <= lastDateOfMonth; i++) {
			document.getElementById(`currMonth-${i}`).addEventListener('click', this.viewAttendance.bind(this), false);
		}

		for (let i = lastDayOfMonth; i < 6; i++) {
			document.getElementById(`nextMonth-${i}`).addEventListener('click', this.viewAttendance.bind(this), false);
		}
	}

	viewAttendance(day): any {
		let dateFound = false;

		let currentDatesButtons = document.querySelectorAll(
			'.attendance-body .calendar-wrapper .calendar ul.days li[data-day]'
		);
		currentDatesButtons.forEach((dateButton) => {
			dateButton.classList.remove('selected');
		});

		if (day.target.getAttribute('class') !== 'inactive') {
			day.target.classList.add('selected');

			let currViewAttendanceDate = document.getElementById('currentViewAttendanceDate');
			currViewAttendanceDate.innerHTML = `${day.target.getAttribute('data-day')} ${this.months[this.currMonth]}, ${
				this.currYear
			}`;

			this.classroom.attendance.forEach((attendanceYear) => {
				if (attendanceYear.year === String(this.currYear)) {
					attendanceYear.months.forEach((attendanceMonth) => {
						if (attendanceMonth.month === this.months[this.currMonth]) {
							attendanceMonth.days.forEach((attendanceDay) => {
								if (attendanceDay.day == day.target.getAttribute('data-day')) {
									this.currAttendance = [];
									this.currAttendance = attendanceDay.attendees;
									dateFound = true;
								}
							});

							if (!dateFound) {
								this.currAttendance = [];
								this.newAttendance.date.day = day.target.getAttribute('data-day');
							}
						}
					});
				}
			});
		}
	}

	openCreateAttendanceModal() {
		const config = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: ['modal-shadow'],
			panelClass: ['modal-container'],
		});

		this.overlayRef = this.overlay.create(config);

		this.overlayRef.attach(new TemplatePortal(this.tplCreateAttendance, this.viewContainerRef));

		this.newAttendance.attendees = [];

		this.classroom.students.forEach((student) => {
			if (student.filled) {
				this.newAttendance.attendees.push({
					studentID: student.studentID,
					studentName: student.studentName,
					status: '',
				});
			}
		});
	}

	closeModal() {
		this.overlayRef.dispose();
	}

	onSubmitAttendance({ value, valid }: { value: any; valid: boolean | null }): void {
		if (!valid) {
			return;
		}

		this.classroomService.createAttendance(this.classroom._id, this.newAttendance).subscribe(
			(classroom) => {
				this.classroom = classroom;

				let todayCalendarButton: HTMLElement = document.querySelector(
					`.attendance-body .calendar-wrapper .calendar ul.days li[data-day="${this.newAttendance.date.day}"]`
				);
				todayCalendarButton.click();

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
