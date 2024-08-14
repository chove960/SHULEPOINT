import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Student, StudentAssessment, StudentAssessmentUpdates, studentReport } from '@shule-point/dataModels';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
	providedIn: 'root',
})
export class StudentService {
	StudentAPIurl = `${environment.APIurl}/student`;

	constructor(private http: HttpClient) {}

	registerStudent(student: Student): Observable<Student> {
		return this.http.post<Student>(`${this.StudentAPIurl}/register`, student, httpOptions);
	}

	getStudents(schoolRegNumber, page, studentFilters): Observable<{ students: Student[]; meta: {} }> {
		const params = new HttpParams()
			.set('schoolRegNumber', schoolRegNumber)
			.set('page', page)
			.set('studentFilters', JSON.stringify(studentFilters));
		return this.http.get<{ students: Student[]; meta: {} }>(`${this.StudentAPIurl}/all`, { params: params });
	}

	getStudent(schoolRegNumber, studentID): Observable<Student> {
		return this.http.get<Student>(`${this.StudentAPIurl}/?schoolRegNumber=${schoolRegNumber}&studentID=${studentID}`);
	}

	searchStudent(schoolRegNumber, searchEntry, page, studentFilters): Observable<{ students: Student[]; meta: {} }> {
		const params = new HttpParams()
			.set('schoolRegNumber', schoolRegNumber)
			.set('searchEntry', searchEntry)
			.set('page', page)
			.set('studentFilters', JSON.stringify(studentFilters));
		return this.http.get<{ students: Student[]; meta: {} }>(`${this.StudentAPIurl}/search`, { params: params });
	}

	getStudentsByGradeLevel(schoolRegNumber, gradeLevel): Observable<Student[]> {
		return this.http.get<Student[]>(
			`${this.StudentAPIurl}/byGradeLevel?schoolRegNumber=${schoolRegNumber}&gradeLevel=${gradeLevel}`
		);
	}

	createProgressReport(studentID, reportCard: studentReport): Observable<Student> {
		return this.http.post<Student>(
			`${this.StudentAPIurl}/progress-report?&studentID=${studentID}`,
			reportCard,
			httpOptions
		);
	}

	deleteProgressReport(studentID, schoolTermName, gradeLevel): Observable<Student> {
		return this.http.delete<Student>(
			`${this.StudentAPIurl}/progress-report?&studentID=${studentID}&gradeLevel=${gradeLevel}&schoolTermName=${schoolTermName}`
		);
	}

	updateProgressReport(studentID, gradeLevel, schoolTermName, AssessmentUpdates: StudentAssessmentUpdates) {
		return this.http.put<Student>(
			`${this.StudentAPIurl}/progress-report?&studentID=${studentID}&gradeLevel=${gradeLevel}&schoolTermName=${schoolTermName}`,
			AssessmentUpdates
		);
	}
}
