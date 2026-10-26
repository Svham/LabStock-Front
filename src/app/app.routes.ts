import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
import { RegisterComponent } from './components/layout/register/register.component';
import { PrincipalComponent } from './components/layout/principal/principal.component';
import { ItemsdetailsComponent} from './components/items/itemsdetails/itemsdetails.component';
import { ItemslistComponent} from './components/items/itemslist/itemslist.component';
import { ProjectslistComponent } from './components/projects/projectslist/projectslist.component';
import { ProjectsdetailsComponent } from './components/projects/projectsdetails/projectsdetails.component';
import { LendingrequestComponent } from './components/lendings/lendingrequest/lendingrequest.component';
import { LendingslistComponent } from './components/lendings/lendingslist/lendingslist.component';
import { DamagedlistComponent } from './components/damaged/damagedlist/damagedlist.component';
import { DamagedregisterComponent } from './components/damaged/damagedregister/damagedregister.component';
import { PurchaseslistComponent } from './components/purchases/purchaseslist/purchaseslist.component';
import { UserslistComponent } from './components/users/userslist/userslist.component';
import { MylendingsComponent } from './components/lendings/mylendings/mylendings.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard, roleGuard } from './guards/auth.guard';

// Quem pode entrar em cada tela (regra do guia do front):
//   LAB      -> itens (cadastro/edição), empréstimos (gerenciar), danos, compras, usuários
//   TEACHER  -> projetos (cadastro/edição)
//   STUDENT  -> solicitar empréstimo e ver os próprios empréstimos
//   Todos    -> listas de itens e de projetos e o próprio perfil
export const routes: Routes = [
    {path : "", redirectTo: "login", pathMatch: "full"},
    {path : "login", component: LoginComponent},
    {path : "register", component: RegisterComponent},
    {path: "admin", component: PrincipalComponent, canActivate: [authGuard], children: [
        {path: "items", component: ItemslistComponent},
        {path: "items/new", component: ItemsdetailsComponent, canActivate: [roleGuard('LAB')]},
        {path: "items/edit/:id", component: ItemsdetailsComponent, canActivate: [roleGuard('LAB')]},
        {path: "projects", component: ProjectslistComponent},
        {path: "projects/new", component: ProjectsdetailsComponent, canActivate: [roleGuard('TEACHER')]},
        {path: "projects/edit/:id", component: ProjectsdetailsComponent, canActivate: [roleGuard('TEACHER')]},
        {path: "lendings", component: LendingslistComponent, canActivate: [roleGuard('LAB')]},
        {path: "lendings/new", component: LendingrequestComponent, canActivate: [roleGuard('STUDENT')]},
        {path: "lendings/my", component: MylendingsComponent, canActivate: [roleGuard('STUDENT')]},
        {path: "damaged", component: DamagedlistComponent, canActivate: [roleGuard('LAB')]},
        {path: "damaged/new", component: DamagedregisterComponent, canActivate: [roleGuard('LAB')]},
        {path: "purchases", component: PurchaseslistComponent, canActivate: [roleGuard('LAB')]},
        {path: "users", component: UserslistComponent, canActivate: [roleGuard('LAB')]},
        {path: "profile", component: ProfileComponent},
    ]},
    {path: "**", redirectTo: "login"}
];
