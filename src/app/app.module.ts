import { registerLocaleData } from '@angular/common';
// ==================================================
// MODULES
// ==================================================
import { HttpClientModule } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID, NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
// ==================================================
// COMPONENTS
// ==================================================
import { AppComponent } from './app.component';
import { GeneralModule } from './modules/general/general.module';
import { SessionModule } from './modules/session/session.module';
import { UnitModule } from './modules/unit/unit.module';
import { WrapModule } from './modules/wrap/wrap.module';
import { SharedModule } from './shared/shared.module';

export function tokenGetter(): string {
  return localStorage.getItem('access_token');
}

registerLocaleData(localeEs, 'es');
@NgModule({
  // ===========================================================
  //  DECLARATIONS
  // ===========================================================
  declarations: [AppComponent],
  // ===========================================================
  //  IMPORTS
  // ===========================================================
  imports: [
    SocketIoModule.forRoot({
      url: environment.ws.url,
      options: {}
    }),

    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['http://localhost:8881'],
      },
    }),

    SharedModule,
    UnitModule,
    WrapModule,
    SessionModule,
    GeneralModule,
  ],

  providers: [{ provide: LOCALE_ID, useValue: 'es' }],

  bootstrap: [AppComponent],
})
export class AppModule {}
