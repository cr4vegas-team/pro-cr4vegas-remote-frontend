import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from '../app/components/pages/login/login.component';
import { MapComponent } from '../app/components/pages/map/map.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
    { path: 'map', component: MapComponent, canActivate: [AuthGuard] },
    { path: '**', component: LoginComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }