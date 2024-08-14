import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoaderComponent } from './components/loader/loader.component';

import { TokenInterceptorService } from './services/token-interceptor.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

import { LottieModule } from 'ngx-lottie';

export function playerFactory(): any {
	return import('lottie-web');
}

@NgModule({
	declarations: [AppComponent, LoaderComponent],
	imports: [
		BrowserModule,
		OverlayModule,
		AppRoutingModule,
		HttpClientModule,
		LottieModule.forRoot({ player: playerFactory }),
	],
	providers: [
		AuthService,
		UserService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptorService,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
