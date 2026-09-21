import { Routes } from '@angular/router';
import { LoginComponent } from './components/layout/login/login.component';
import { PrincipalComponent } from './components/layout/principal/principal.component';
import { ItemsdetailsComponent} from './components/items/itemsdetails/itemsdetails.component';
import { ItemslistComponent} from './components/items/itemslist/itemslist.component';
import { ProjectslistComponent } from './components/projects/projectslist/projectslist.component';
import { ProjectsdetailsComponent } from './components/projects/projectsdetails/projectsdetails.component';

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
    ]}
];
