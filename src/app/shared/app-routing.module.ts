import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from './guards/auth.guard';
import { PageUnitGenericComponent } from '../modules/unit/unit-generic/components/page-unit-generic/page-unit-generic.component';
import { PageUnitHydrantComponent } from '../modules/unit/unit-hydrant/components/page-unit-hydrant/page-unit-hydrant.component';
import { PageUnitPondComponent } from '../modules/unit/unit-pond/components/page-unit-pond/page-unit-pond.component';
import { PageSectorComponent } from '../modules/wrap/sector/components/page-sector/page-sector.component';
import { PageSetComponent } from '../modules/wrap/set/components/page-set/page-set.component';
import { PageStationComponent } from '../modules/wrap/station/components/page-station/page-station.component';
import { LoginComponent } from './components/page-login/page-login.component';
import { MapComponent } from './components/page-map/page-map.component';

const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'map', component: MapComponent, canActivate: [AuthGuard] },

    { path: 'stations', component: PageStationComponent, canActivate: [AuthGuard] },
    { path: 'sectors', component: PageSectorComponent, canActivate: [AuthGuard] },
    { path: 'sets', component: PageSetComponent, canActivate: [AuthGuard] },

    { path: 'units-generics', component: PageUnitGenericComponent, canActivate: [AuthGuard] },
    { path: 'units-hydrants', component: PageUnitHydrantComponent, canActivate: [AuthGuard] },
    { path: 'units-ponds', component: PageUnitPondComponent, canActivate: [AuthGuard] },

    { path: '**', component: LoginComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'ignore' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }