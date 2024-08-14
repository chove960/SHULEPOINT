import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Classroom, classroomAttendance } from '@shule-point/dataModels';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
	providedIn: 'root',
})
export class ClassroomService {
	ClassroomAPIurl = `${environment.APIurl}/classroom`;

	constructor(private http: HttpClient) {}

	createClassroom(classroom: Classroom): Observable<Classroom> {
		return this.http.post<Classroom>(`${this.ClassroomAPIurl}/create`, classroom, httpOptions);
	}

	getClassrooms(schoolRegNumber): Observable<Classroom[]> {
		return this.http.get<Classroom[]>(`${this.ClassroomAPIurl}/all?schoolRegNumber=${schoolRegNumber}`);
	}

	getClassroom(classroomID): Observable<Classroom> {
		return this.http.get<Classroom>(`${this.ClassroomAPIurl}/?classroomID=${classroomID}`);
	}

	assignSeat(classroomID, seatAssignment): Observable<Classroom> {
		return this.http.put<Classroom>(
			`${this.ClassroomAPIurl}/assignSeat?classroomID=${classroomID}`,
			seatAssignment,
			httpOptions
		);
	}

	createAttendance(classroomID, attendance: classroomAttendance): Observable<Classroom> {
		return this.http.put<Classroom>(
			`${this.ClassroomAPIurl}/createAttendance?classroomID=${classroomID}`,
			attendance,
			httpOptions
		);
	}

	uploadRefMaterials(classroomID, refMaterial) {
		return this.http.put<Classroom>(
			`${this.ClassroomAPIurl}/uploadRefMaterials?classroomID=${classroomID}`,
			refMaterial,
			httpOptions
		);
	}
}
