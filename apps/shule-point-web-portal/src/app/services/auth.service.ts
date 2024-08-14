import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from '@shule-point/dataModels';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	AuthAPIurl: string = `${environment.APIurl}/auth`;

	constructor(private http: HttpClient) {}

	registerUser(user: User): Observable<any> {
		return this.http.post<User>(`${this.AuthAPIurl}/register/`, user, httpOptions);
	}

	loginUser(user: User): Observable<any> {
		return this.http.post<User>(`${this.AuthAPIurl}/login/`, user, httpOptions);
	}

	logoutUser(): void {
		localStorage.clear();
	}

	loggedIn() {
		return !!localStorage.getItem('userToken');
	}

	getToken() {
		return localStorage.getItem('userToken');
	}
}
