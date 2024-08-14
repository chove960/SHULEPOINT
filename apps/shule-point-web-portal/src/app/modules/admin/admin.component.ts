import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '@shule-point/dataModels';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

import Swal from 'sweetalert2';

const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
});
@Component({
	selector: 'shule-point-web-portal-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
	user: User = { username: '', password: '' };

	constructor(private router: Router, private userService: UserService, private authService: AuthService) {}

	ngOnInit(): void {
		this.loadUser();
	}

	async loadUser(): Promise<void> {
		this.user = await this.userService.getUser();
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
