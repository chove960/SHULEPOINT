import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { User, userProfile } from '@shule-point/dataModels';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
	providedIn: 'root',
})
export class UserService {
	UserAPIurl = `${environment.APIurl}/user`;

	constructor(private http: HttpClient) {}

	createProfile(profile: userProfile): Observable<User> {
		return this.http.put<User>(
			`${this.UserAPIurl}/createProfile/?userID=${localStorage.getItem('userID')}`,
			profile,
			httpOptions
		);
	}

	async getUser(): Promise<User> {
		if (localStorage.getItem('userCached') !== null) {
			const user = JSON.parse(localStorage.getItem('userCached') as string);

			if ((new Date(Date.now()).getTime() - new Date(user.lastFetched).getTime()) / 1000 < 2.5) {
				return user;
			}
		}

		const user = (await this.fetchUser().toPromise()) as User;
		user.lastFetched = new Date(Date.now());
		localStorage.setItem('userCached', JSON.stringify(user));
		return user;
	}

	fetchUser(): Observable<User> {
		return this.http.get<User>(`${this.UserAPIurl}/?userID=${localStorage.getItem('userID')}`);
	}

	searchUsers(username: string): Observable<User[]> {
		return this.http.get<User[]>(`${this.UserAPIurl}/search?username=${username}`);
	}

	getSchoolAdmins(schoolRegNumber: string): Observable<User[]> {
		return this.http.get<User[]>(`${this.UserAPIurl}/schoolAdmins?schoolRegNumber=${schoolRegNumber}`);
	}

	getSchoolTeachers(schoolRegNumber: string): Observable<User[]> {
		return this.http.get<User[]>(`${this.UserAPIurl}/schoolTeachers?schoolRegNumber=${schoolRegNumber}`);
	}

	getTeacher(teacherID): Observable<User> {
		return this.http.get<User>(`${this.UserAPIurl}/teacher?userID=${teacherID}`);
	}

	async checkProfileExists(): Promise<boolean> {
		const user = await this.getUser();
		return user?.hasProfile as boolean;
	}

	async checkIsStaff(): Promise<boolean> {
		const user = await this.getUser();
		return (user?.userType === 'Staff') as boolean;
	}
}
