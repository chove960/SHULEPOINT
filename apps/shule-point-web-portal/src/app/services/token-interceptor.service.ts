import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';
import { LoaderService } from './loader.service';
import { finalize } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
	public get loaderService(): LoaderService {
		return this._loaderService;
	}
	public set loaderService(value: LoaderService) {
		this._loaderService = value;
	}
	constructor(private injector: Injector, private _loaderService: LoaderService) {}

	intercept(req: any, next: any) {
		const authService = this.injector.get(AuthService);
		this.loaderService.isLoading.next(true);

		if (authService.loggedIn()) {
			const tokenizedReq = req.clone({
				setHeaders: {
					authToken: authService.getToken(),
				},
			});

			return next.handle(tokenizedReq).pipe(
				finalize(() => {
					this.loaderService.isLoading.next(false);
				})
			);
		} else {
			return next.handle(req).pipe(
				finalize(() => {
					this.loaderService.isLoading.next(false);
				})
			);
		}
	}
}
