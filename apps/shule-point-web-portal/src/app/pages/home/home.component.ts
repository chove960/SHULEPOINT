import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
});

import { User } from '@shule-point/dataModels';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'shule-point-web-portal-home',
	standalone: true,
	imports: [CommonModule, RouterModule, FormsModule],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	user: User = {
		username: '',
		password: '',
	};

	@ViewChild('signInForm') form: any;
	constructor(private authService: AuthService, private userService: UserService, private router: Router) {}

	ngOnInit(): void {}

	onSubmit({ value, valid }: { value: User; valid: boolean | null }): void {
		if (!valid) {
			return;
		}

		this.authService.loginUser(value).subscribe(
			async (userData) => {
				localStorage.setItem('userID', userData.userID);
				localStorage.setItem('userToken', userData.Token);

				if (this.authService.loggedIn()) {
					await this.userService.getUser().then((user) => {
						if (user.userType === 'Staff') {
							this.router.navigate(['admin']);
						} else {
							this.router.navigate(['dashboard']);
						}
					});
				}
			},
			(error) => {
				Toast.fire({
					icon: 'error',
					title: error.error.error,
				});
			}
		);
	}
}
