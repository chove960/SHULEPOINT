import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

import Swal from 'sweetalert2';

const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
});

@Injectable({
	providedIn: 'root',
})
export class StaffGuard implements CanActivate {
	constructor(private router: Router, private userService: UserService) {}
	async canActivate(): Promise<boolean> {
		if (await this.userService.checkIsStaff()) {
			return true;
		}

		Toast.fire({
			icon: 'error',
			title: `Error: You're not a staff user!`,
		});

		this.router.navigate(['dashboard']);
		return false;
	}
}
