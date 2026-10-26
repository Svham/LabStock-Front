import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MdbCollapseModule, MdbDropdownModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  private router = inject(Router);
  auth = inject(AuthService);

  // Lido a cada uso (e não guardado uma vez) para o nome mudar no menu quando o perfil for editado
  get usuario() {
    return this.auth.usuarioLogado();
  }

  private rotulosPerfil: Record<string, string> = {
    STUDENT: 'Aluno',
    TEACHER: 'Professor',
    LAB: 'Laboratorista'
  };

  get perfilDoUsuario(): string {
    return this.usuario ? (this.rotulosPerfil[this.usuario.role] ?? this.usuario.role) : '';
  }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
