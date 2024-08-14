import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { gradeLevel, School, schoolTerm } from '@shule-point/dataModels';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
	providedIn: 'root',
})
export class SchoolService {
	SchoolAPIurl = `${environment.APIurl}/school`;

	constructor(private http: HttpClient) {}

	addGradeLevel(schoolRegNumber, gradeLevel: gradeLevel): Observable<School> {
		return this.http.put<School>(
			`${this.SchoolAPIurl}/addDetails?schoolRegNumber=${schoolRegNumber}&detailName=gradeLevel`,
			gradeLevel,
			httpOptions
		);
	}

	removeGradeLevel(schoolRegNumber, gradeLevelName: string): Observable<any> {
		return this.http.delete<School>(
			`${this.SchoolAPIurl}/removeDetails?schoolRegNumber=${schoolRegNumber}&detailName=gradeLevel&detail=${gradeLevelName}`
		);
	}

	addSchoolTerm(schoolRegNumber, schoolTerm: schoolTerm): Observable<School> {
		return this.http.put<School>(
			`${this.SchoolAPIurl}/addDetails?schoolRegNumber=${schoolRegNumber}&detailName=schoolTerm`,
			schoolTerm,
			httpOptions
		);
	}

	removeSchoolTerm(schoolRegNumber, schoolTermName: string): Observable<any> {
		return this.http.delete<School>(
			`${this.SchoolAPIurl}/removeDetails?schoolRegNumber=${schoolRegNumber}&detailName=schoolTerm&detail=${schoolTermName}`
		);
	}

	registerSchool(school: School): Observable<School> {
		return this.http.post<School>(`${this.SchoolAPIurl}/register`, school, httpOptions);
	}

	getSchools(): Observable<School[]> {
		return this.http.get<School[]>(`${this.SchoolAPIurl}/all`);
	}

	getSchool(schoolRegNumber): Observable<School> {
		return this.http.get<School>(`${this.SchoolAPIurl}/?schoolRegNumber=${schoolRegNumber}`);
	}
}
