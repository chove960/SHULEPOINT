import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'shule-point-sis-sys-admins',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './sys-admins.component.html',
	styleUrls: ['./sys-admins.component.scss'],
})
export class SysAdminsComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
