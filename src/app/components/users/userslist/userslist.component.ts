import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

import { UserService } from '../../../services/user.service';
import { User } from '../../../models/users';

@Component({
  selector: 'app-userslist',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbRippleModule],
  templateUrl: './userslist.component.html',
  styleUrl: './userslist.component.scss'
})
export class UserslistComponent implements OnInit {
  usuarios: User[] = [];

  carregando = false;
  erro = '';
  sucesso = '';
  processandoId: number | null = null;

  filtroBusca = '';

  // valor que o backend espera + texto que aparece na tela
  perfis = [
    { valor: 'STUDENT', rotulo: 'Aluno' },
    { valor: 'TEACHER', rotulo: 'Professor' },
    { valor: 'LAB', rotulo: 'Laboratorista' }
  ];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;

    this.userService.listar(this.filtroBusca || undefined).subscribe({
      next: (res) => {
        this.usuarios = res.data;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.erro = 'Não foi possível carregar os usuários.';
        this.carregando = false;
      }
    });
  }

  aplicarFiltro(): void {
    this.carregar();
  }

  rotuloPerfil(valor: string): string {
    return this.perfis.find(p => p.valor === valor)?.rotulo ?? valor;
  }

  alterarPerfil(usuario: User, evento: Event): void {
    const select = evento.target as HTMLSelectElement;
    const novoPerfil = select.value;

    if (novoPerfil === usuario.role) return;

    if (!confirm(`Alterar o perfil de "${usuario.name}" para ${this.rotuloPerfil(novoPerfil)}?`)) {
      select.value = usuario.role;
      return;
    }

    this.erro = '';
    this.sucesso = '';
    this.processandoId = usuario.id;

    this.userService.alterarRole(usuario.id, novoPerfil).subscribe({
      next: (res) => {
        usuario.role = res.data.role;
        this.sucesso = `Perfil de ${usuario.name} alterado para ${this.rotuloPerfil(usuario.role)}.`;
        this.processandoId = null;
      },
      error: (err) => {
        console.error('Erro ao alterar perfil:', err);
        // Volta o select para o perfil que continua valendo no banco
        select.value = usuario.role;
        this.erro = err.error?.message ?? 'Erro ao alterar o perfil.';
        this.processandoId = null;
      }
    });
  }

  excluir(usuario: User): void {
    if (!confirm(`Deseja realmente excluir o usuário "${usuario.name}"?`)) return;

    this.erro = '';
    this.sucesso = '';
    this.processandoId = usuario.id;

    this.userService.excluir(usuario.id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
        this.sucesso = `Usuário ${usuario.name} excluído.`;
        this.processandoId = null;
      },
      error: (err) => {
        console.error('Erro ao excluir usuário:', err);
        this.erro = err.error?.message ?? 'Erro ao excluir o usuário.';
        this.processandoId = null;
      }
    });
  }
}
