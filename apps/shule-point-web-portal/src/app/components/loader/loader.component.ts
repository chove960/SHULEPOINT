import { Component, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
	selector: 'shule-point-web-portal-loader',
	templateUrl: './loader.component.html',
	styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
	options: AnimationOptions = {
		path: '/assets/animations/Loading.json',
	};

	constructor() {}

	ngOnInit(): void {}
}
