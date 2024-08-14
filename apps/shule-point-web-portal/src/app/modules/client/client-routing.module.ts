import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientComponent } from './client.component';

const routes: Routes = [
	{
		path: '',
		component: ClientComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'home' },
			{
				path: 'home',
				loadComponent: () => import('./pages/dash-home/dash-home.component').then((c) => c.DashHomeComponent),
				title: 'ShulePoint | Home',
			},
			{
				path: 'manage-classrooms',
				loadComponent: () =>
					import('./pages/manage-classrooms/manage-classrooms.component').then((c) => c.ManageClassroomsComponent),
				title: 'ShulePoint | Manage Classrooms',
			},
			{
				path: 'manage-classrooms/view-classroom/:classroomID',
				loadComponent: () =>
					import('./pages/manage-classrooms/pages/view-classroom/view-classroom.component').then(
						(c) => c.ViewClassroomComponent
					),
				title: 'ShulePoint | View Classroom',
			},
			{
				path: 'manage-students',
				loadComponent: () =>
					import('./pages/manage-students/manage-students.component').then((c) => c.ManageStudentsComponent),
				title: 'ShulePoint | View Students',
			},
			{
				path: 'manage-staffs',
				loadComponent: () =>
					import('./pages/manage-staffs/manage-staffs.component').then((c) => c.ManageStaffsComponent),
				title: 'ShulePoint | Manage Staffs',
			},
			{
				path: 'manage-school',
				loadComponent: () =>
					import('./pages/manage-school/manage-school.component').then((c) => c.ManageSchoolComponent),
				title: 'ShulePoint | Manage School',
			},
			{
				path: 'activity-reports',
				loadComponent: () =>
					import('./pages/activity-reports/activity-reports.component').then((c) => c.ActivityReportsComponent),
				title: 'ShulePoint | Activity Reports',
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ClientRoutingModule {}
