import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(): boolean {
		if (this.authService.loggedIn()) {
			return true;
		}

		this.router.navigate(['/']);
		Toast.fire({
			icon: 'error',
			title: `Error: You're not logged in!`,
		});
		return false;
	}
}
