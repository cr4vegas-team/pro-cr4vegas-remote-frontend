import { AuthModule } from './shared/auth/auth.module';
import { registerLocaleData } from '@angular/common';
// ==================================================
// MODULES
// ==================================================
import { HttpClientModule } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import {
  LOCALE_ID,
  NgModule
} from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';
// ==================================================
// COMPONENTS
// ==================================================
import { AppComponent } from './app.component';
import { GeneralModule } from './modules/general/general.module';
import { SessionModule } from './modules/session/session.module';
import { UnitModule } from './modules/unit/unit.module';
import { WrapModule } from './modules/wrap/wrap.module';
import { WebsocketService } from './shared/services/websocket.service';
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
    AuthModule
  ],

  providers: [{ provide: LOCALE_ID, useValue: 'es' }],

  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private readonly _webSocketService: WebsocketService) {
    this._webSocketService.connect();
  }
}
