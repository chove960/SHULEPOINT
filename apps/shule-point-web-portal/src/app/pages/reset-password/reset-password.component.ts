import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'shule-point-sis-reset-password',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
