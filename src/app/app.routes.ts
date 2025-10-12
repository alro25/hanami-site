import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { ContatoComponent } from './componentes/contato/contato.component';
import { SideModalComponent } from './componentes/side-modal/side-modal.component';
import { ProfileModalContentComponent } from './componentes/profile-modal-content/profile-modal-content.component';
import { RegisterComponent } from './componentes/register/register.component';

export const routes: Routes = [
    {path: "", pathMatch: 'full', redirectTo: 'home'},
    {path:'login', component: LoginComponent},
    {path:'home', component: HomeComponent},
    {path:'dashboard', component: DashboardComponent},
    {path:'contato', component: ContatoComponent},
    {path:'side-modal', component: SideModalComponent},
    {path:'prifile-modal-content', component: ProfileModalContentComponent},
    {path:'register', component: RegisterComponent}
];
