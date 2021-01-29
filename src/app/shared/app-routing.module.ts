import { PageOrderComponent } from './../modules/session/order/components/page-order/page-order.component';
import { PageAlarmComponent } from './../modules/session/alarm/components/page-alarm/page-alarm.component';
import { PageActionComponent } from './../modules/session/action/components/page-action/page-action.component';
import { PageRegistryComponent } from './../modules/session/registry/components/page-registry/page-registry.component';
import { PageSessionComponent } from './../modules/session/session/components/page-session/page-session.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../modules/auth/auth/guards/auth.guard';
import { PageUnitGenericComponent } from '../modules/unit/unit-generic/components/page-unit-generic/page-unit-generic.component';
import { PageUnitHydrantComponent } from '../modules/unit/unit-hydrant/components/page-unit-hydrant/page-unit-hydrant.component';
import { PageUnitPondComponent } from '../modules/unit/unit-pond/components/page-unit-pond/page-unit-pond.component';
import { PageSectorComponent } from '../modules/wrap/sector/components/page-sector/page-sector.component';
import { PageSetComponent } from '../modules/wrap/set/components/page-set/page-set.component';
import { LoginComponent } from './components/page-login/page-login.component';
import { MapComponent } from './components/page-map/page-map.component';
import { PageUserComponent } from '../modules/auth/user/components/page-user/page-user.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'map', component: MapComponent, canActivate: [AuthGuard] },
  { path: 'sectors', component: PageSectorComponent, canActivate: [AuthGuard] },
  { path: 'sets', component: PageSetComponent, canActivate: [AuthGuard] },

  {
    path: 'units-generics',
    component: PageUnitGenericComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'units-hydrants',
    component: PageUnitHydrantComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'units-ponds',
    component: PageUnitPondComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    component: PageUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sessions',
    component: PageSessionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'registries',
    component: PageRegistryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'actions',
    component: PageActionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'alarms',
    component: PageAlarmComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    component: PageOrderComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'ignore',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
