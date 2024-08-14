import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';

const routes: Routes = [
	{
		path: '',
		component: AdminComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'home' },
			{
				path: 'home',
				loadComponent: () =>
					import('./pages/admin-dash-home/admin-dash-home.component').then((c) => c.AdminDashHomeComponent),
				title: 'ShulePoint | Home',
			},
			{
				path: 'manage-schools',
				loadComponent: () =>
					import('./pages/manage-schools/manage-schools.component').then((c) => c.ManageSchoolsComponent),
				title: 'ShulePoint | Manage Schools',
			},
			{
				path: 'manage-schools/view-school/:schoolRegNumber',
				loadComponent: () =>
					import('./pages/manage-schools/pages/view-school/view-school.component').then(
						(c) => c.ViewSchoolComponent
					),
				title: 'ShulePoint | View School',
			},
			{
				path: 'sys-admins',
				loadComponent: () => import('./pages/sys-admins/sys-admins.component').then((c) => c.SysAdminsComponent),
				title: 'ShulePoint | Sys. Admins',
			},
			{
				path: 'sys-reports',
				loadComponent: () => import('./pages/sys-reports/sys-reports.component').then((c) => c.SysReportsComponent),
				title: 'ShulePoint | Sys. Reports',
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AdminRoutingModule {}
