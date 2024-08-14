import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
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
export class LoggedInGuard implements CanActivate {
	constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

	canActivate(): boolean {
		if (this.authService.loggedIn()) {
			this.userService.getUser().then((user) => {
				Toast.fire({
					icon: 'info',
					title: `Info: You're already logged in!`,
				});

				if (user.userType === 'Staff') {
					this.router.navigate(['admin']);
				} else {
					this.router.navigate(['dashboard']);
				}
			});

			return false;
		}
		return true;
	}
}
