import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
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

export const routes: Routes = [
    {path : "", redirectTo: "login", pathMatch: "full"},
    {path : "login", component: LoginComponent},
    {path: "items", component: ItemslistComponent},
    {path: "admin", component: PrincipalComponent, children: [
        {path: "items", component: ItemslistComponent},
        {path: "items/new", component: ItemsdetailsComponent},
        {path: "items/edit/:id", component: ItemsdetailsComponent},
        {path: "projects", component: ProjectslistComponent},
        {path: "projects/new", component: ProjectsdetailsComponent},
        {path: "projects/edit/:id", component: ProjectsdetailsComponent},
        {path: "lendings", component: LendingslistComponent},
        {path: "lendings/new", component: LendingrequestComponent},
        {path: "lendings/my", component: MylendingsComponent},
        {path: "damaged", component: DamagedlistComponent},
        {path: "damaged/new", component: DamagedregisterComponent},
        {path: "purchases", component: PurchaseslistComponent},
        {path: "users", component: UserslistComponent},
    ]}
];
