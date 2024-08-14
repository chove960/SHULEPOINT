import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'shule-point-web-portal-access-denied',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './access-denied.component.html',
	styleUrls: ['./access-denied.component.scss'],
})
export class AccessDeniedComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
