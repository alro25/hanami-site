import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { ContactComponent } from './componentes/contact/contact.component';
import { SideModalComponent } from './componentes/side-modal/side-modal.component';
import { ProfileModalContentComponent } from './componentes/profile-modal-content/profile-modal-content.component';
import { RegisterComponent } from './componentes/register/register.component';
import { HeaderComponent } from './componentes/header/header.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { ProductsComponent } from './componentes/products/products.component';
import { AboutUsComponent } from './componentes/about-us/about-us.component';

export const routes: Routes = [
    {path: "", pathMatch: 'full', redirectTo: 'home'},
    {path:'login', component: LoginComponent},
    {path:'home', component: HomeComponent},
    {path:'dashboard', component: DashboardComponent},
    {path:'contact', component: ContactComponent},
    {path:'side-modal', component: SideModalComponent},
    {path:'prifile-modal-content', component: ProfileModalContentComponent},
    {path:'register', component: RegisterComponent},
    {path:'header', component: HeaderComponent},
    {path:'footer', component: FooterComponent},
    {path:'products', component: ProductsComponent},
    {path:'about-us', component: AboutUsComponent},
    { path: '**', redirectTo: '' }
];
