import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

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
export class DeviceGuard implements CanActivate {
	constructor(private router: Router) {}

	canActivate(): boolean {
		const mediaMatched = window.matchMedia('(max-width: 768px)');
		let orientation = window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait';

		if (mediaMatched.matches || orientation === 'Portrait') {
			Toast.fire({
				icon: 'error',
				title: `Error: Device Not Supported!`,
			});
			this.router.navigate(['accessDenied'], {
				queryParams: { denialReason: 'Device Not Supported!' },
				queryParamsHandling: 'merge',
			});
			return false;
		}

		mediaMatched.addEventListener('change', (e) => {
			this.router.navigate(['/dashboard']);

			if (e.matches || orientation === 'Portrait') {
				Toast.fire({
					icon: 'error',
					title: `Error: Device Not Supported!`,
				});
				this.router.navigate(['accessDenied'], {
					queryParams: { denialReason: 'Device Not Supported!' },
					queryParamsHandling: 'merge',
				});
				return false;
			}

			return true;
		});

		return true;
	}
}
