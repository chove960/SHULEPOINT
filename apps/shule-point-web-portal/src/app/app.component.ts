import { Component } from '@angular/core';
import { LoaderService } from './services/loader.service';

@Component({
	selector: 'shule-point-web-portal-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	constructor(public loaderService: LoaderService) {}
}
