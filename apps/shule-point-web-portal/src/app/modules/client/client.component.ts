import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User, School } from '@shule-point/dataModels';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SchoolService } from '../../services/school.service';

import Swal from 'sweetalert2';

const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
});

@Component({
	selector: 'shule-point-web-portal-client',
	templateUrl: './client.component.html',
	styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
	user: User = { username: '', password: '' };
	school: School;

	constructor(
		private router: Router,
		private userService: UserService,
		private schoolService: SchoolService,
		private authService: AuthService
	) {}

	async ngOnInit(): Promise<void> {
		this.user = await this.userService.getUser();

		this.schoolService.getSchool(this.user.schoolRegNumber).subscribe((school) => {
			this.school = school;
		});
	}

	logout(): void {
		Swal.fire({
			title: 'Are you sure?',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#ff3333',
			confirmButtonText: 'Yes, log out!',
		}).then((result) => {
			if (result.isConfirmed) {
				this.authService.logoutUser();
				this.router.navigate(['/']);

				Toast.fire({
					icon: 'success',
					title: `You're logged out!`,
				});
			}
		});
	}
}
