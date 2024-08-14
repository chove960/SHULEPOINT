import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';

import { ClassroomOverviewComponent } from './Tab_Pages/classroom-overview/classroom-overview.component';
import { ClassroomAttendanceComponent } from './Tab_Pages/classroom-attendance/classroom-attendance.component';
import { ClassroomReportCardsComponent } from './Tab_Pages/classroom-report-cards/classroom-report-cards.component';
import { ClassroomReferenceMaterialsComponent } from './Tab_Pages/classroom-reference-materials/classroom-reference-materials.component';

import { Classroom } from '@shule-point/dataModels';

import { ClassroomService } from '../../../../../../services/classroom.service';

@Component({
	selector: 'shule-point-sis-view-classroom',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		ClassroomOverviewComponent,
		ClassroomAttendanceComponent,
		ClassroomReferenceMaterialsComponent,
		ClassroomReportCardsComponent,
	],
	templateUrl: './view-classroom.component.html',
	styleUrls: ['./view-classroom.component.scss'],
})
export class ViewClassroomComponent implements OnInit {
	classroom: Classroom;
	activeTab = 'Overview';

	today;
	datepipe: DatePipe = new DatePipe('en-US', 'Africa/Nairobi');

	constructor(private classroomService: ClassroomService, private router: Router, private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.route.queryParams.subscribe((params) => {
			if (params['activeTab'] !== undefined) {
				this.setActiveTab(params['activeTab']);
			} else {
				this.setActiveTabQueryParam();
			}
		});

		this.classroomService
			.getClassroom(this.route.snapshot.paramMap.get('classroomID') as string)
			.subscribe((classroom) => {
				this.classroom = classroom;
			});
	}

	setActiveTabQueryParam() {
		const queryParams: Params = { activeTab: this.activeTab };

		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: queryParams,
			queryParamsHandling: 'merge', // remove to replace all query params by provided
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

	setActiveTab(tabTitle: string): void {
		this.activeTab = tabTitle;
		this.setActiveTabQueryParam();
	}
}
