import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
	providedIn: 'root',
})
export class HasProfileGuard implements CanActivate {
	constructor(private userService: UserService, private router: Router) {}
	async canActivate(): Promise<boolean> {
		if (await this.userService.checkProfileExists()) {
			return true;
		}

		this.router.navigate(['dashboard/create-profile']);
		return false;
	}
}
