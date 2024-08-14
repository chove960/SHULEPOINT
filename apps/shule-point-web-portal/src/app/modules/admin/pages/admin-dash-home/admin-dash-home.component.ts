import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'shule-point-sis-admin-dash-home',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './admin-dash-home.component.html',
	styleUrls: ['./admin-dash-home.component.scss'],
})
export class AdminDashHomeComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
