import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageCroppedEvent, ImageCropperModule } from 'ngx-image-cropper';

@Component({
	selector: 'shule-point-web-portal-sq-image-uploader',
	encapsulation: ViewEncapsulation.Emulated,
	standalone: true,
	imports: [CommonModule, ImageCropperModule],
	templateUrl: './sq-image-uploader.component.html',
	styleUrls: ['./sq-image-uploader.component.scss'],
})
export class SqImageUploaderComponent implements OnInit {
	imageChangedEvent: any = '';
	croppedImage: any = '';

	@Output() newPicEvent = new EventEmitter<string>();

	constructor() {}

	ngOnInit(): void {}

	fileChangeEvent(event: any): void {
		const imageEditor: HTMLElement | null = document.querySelector('.image-editor');
		const imageEditorShadow: HTMLElement | null = document.querySelector('.image-editor-shadow');

		this.imageChangedEvent = event;

		imageEditor?.setAttribute('style', 'display: flex');
		imageEditorShadow?.setAttribute('style', 'display: flex');
	}

	imageCropped(event: ImageCroppedEvent) {
		this.croppedImage = event.base64;
	}

	saveImage() {
		const imageEditor: HTMLElement | null = document.querySelector('.image-editor');
		const imageEditorShadow: HTMLElement | null = document.querySelector('.image-editor-shadow');
		const profileImage: HTMLImageElement | null = document.querySelector('#pic');

		imageEditor?.setAttribute('style', 'display: none');
		imageEditorShadow?.setAttribute('style', 'display: none');
		profileImage?.setAttribute('style', 'display: block');

		this.newPicEvent.emit(this.croppedImage);
	}

	uploadImage(e: any) {
		e.preventDefault();
		const imageInput: HTMLFormElement | null = document.querySelector('#pic-upload');

		imageInput?.click();
	}
}
