import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'shule-point-sis-dash-home',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './dash-home.component.html',
	styleUrls: ['./dash-home.component.scss'],
})
export class DashHomeComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
