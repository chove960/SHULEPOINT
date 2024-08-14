import { Component, OnInit, Input, ViewChild, TemplateRef, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Overlay, OverlayConfig, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import Swal from 'sweetalert2';

const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
});

import { Classroom, refMaterial } from '@shule-point/dataModels';

import { StudentService } from '../../../../../../../../services/student.service';
import { ClassroomService } from '../../../../../../../../services/classroom.service';

@Component({
	selector: 'shule-point-sis-classroom-reference-materials',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	imports: [CommonModule, OverlayModule, FormsModule],
	templateUrl: './classroom-reference-materials.component.html',
	styleUrls: ['./classroom-reference-materials.component.scss'],
})
export class ClassroomReferenceMaterialsComponent implements OnInit {
	@Input('classroom') classroom: Classroom;
	overlayRef: OverlayRef;

	today;
	datepipe: DatePipe = new DatePipe('en-US', 'Africa/Nairobi');

	newRefMaterial: refMaterial = {
		name: '',
		file: '',
		subject: '',
		type: '',
		topic: '',
		uploadedOn: this.datepipe.transform(Date.now(), 'dd-MM-YYYY'),
	};

	@ViewChild('newRefMaterialsForm') RefMaterialForm: any;

	@ViewChild('UploadRefMaterialsModal') tplUploadRefMaterials: TemplateRef<unknown>;

	constructor(
		private viewContainerRef: ViewContainerRef,
		private overlay: Overlay,
		private studentService: StudentService,
		private classroomService: ClassroomService
	) {}

	ngOnInit(): void {
		this.today = this.datepipe.transform(Date.now(), 'dd/MMM/YYYY');
	}

	openUploadRefMaterialsModal() {
		const config = new OverlayConfig({
			hasBackdrop: true,
			backdropClass: ['modal-shadow'],
			panelClass: ['modal-container'],
		});

		this.overlayRef = this.overlay.create(config);

		this.overlayRef.attach(new TemplatePortal(this.tplUploadRefMaterials, this.viewContainerRef));
	}

	closeModal() {
		this.overlayRef.dispose();
	}

	onFileChange(event: any) {
		for (var i = 0; i < event.target.files.length; i++) {
			const file = event.target.files[i];
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				this.newRefMaterial.file = reader.result as string;
			};
		}
	}

	onSubmitRefMaterials({ value, valid }: { value: any; valid: boolean | null }): void {
		if (!valid) {
			return;
		}

		this.classroomService.uploadRefMaterials(this.classroom._id, this.newRefMaterial).subscribe(
			(classroom) => {
				if (classroom !== null) {
					this.classroom = classroom;

					this.RefMaterialForm.reset();
					this.closeModal();
				}
			},
			(error) => {
				Toast.fire({
					icon: 'error',
					title: error.error.error,
				});
			}
		);
	}
}
