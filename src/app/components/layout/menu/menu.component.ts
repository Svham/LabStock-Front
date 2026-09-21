import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MdbCollapseModule, MdbDropdownModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  private router = inject(Router);

  sair(): void {
    // TODO: limpar sessão/AuthService quando existir persistência
    this.router.navigate(['/login']);
  }
}
