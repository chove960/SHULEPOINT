import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'shule-point-sis-activity-reports',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './activity-reports.component.html',
	styleUrls: ['./activity-reports.component.scss'],
})
export class ActivityReportsComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
