import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ClientGuard } from './guards/client.guard';
import { DeviceGuard } from './guards/device.guard';
import { LoggedInGuard } from './guards/logged-in.guard';
import { StaffGuard } from './guards/staff.guard';

const routes = [
	{
		path: '',
		title: 'ShulePoint | Welcome',
		canActivate: [DeviceGuard, LoggedInGuard],
		loadComponent: () => import('../app/pages/home/home.component').then((c) => c.HomeComponent),
	},
	{
		path: 'accessDenied',
		title: 'ShulePoint | Access Denied',
		loadComponent: () =>
			import('../app/pages/access-denied/access-denied.component').then((c) => c.AccessDeniedComponent),
	},
	{
		path: 'resetPassword',
		title: 'ShulePoint | Reset Password',
		canActivate: [DeviceGuard, LoggedInGuard],
		loadComponent: () =>
			import('../app/pages/reset-password/reset-password.component').then((c) => c.ResetPasswordComponent),
	},
	{
		path: 'admin',
		canActivate: [DeviceGuard, StaffGuard],
		loadChildren: () => import('../app/modules/admin/admin.module').then((m) => m.AdminModule),
	},
	{
		path: 'dashboard',
		canActivate: [DeviceGuard, ClientGuard],
		loadChildren: () => import('../app/modules/client/client.module').then((m) => m.ClientModule),
	},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: 'enabled',
			onSameUrlNavigation: 'reload',
			anchorScrolling: 'enabled',
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
