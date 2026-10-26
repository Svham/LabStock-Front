import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

import { LendingService } from '../../../services/lending.service';
import { UserService } from '../../../services/user.service';
import { Lending, rotuloStatus, classeStatus } from '../../../models/lendings';
import { User } from '../../../models/users';

@Component({
  selector: 'app-mylendings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MdbRippleModule],
  templateUrl: './mylendings.component.html',
  styleUrl: './mylendings.component.scss'
})
export class MylendingsComponent implements OnInit {
  // TODO: quando o usuário logado for guardado no login, o aluno deixa de ser um select
  alunos: User[] = [];
  alunoSelecionadoId: number | null = null;

  emprestimos: Lending[] = [];

  carregando = false;
  erro = '';

  // Deixa as funções compartilhadas disponíveis no template
  rotuloStatus = rotuloStatus;
  classeStatus = classeStatus;

  constructor(
    private lendingService: LendingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.carregarAlunos();
  }

  carregarAlunos(): void {
    this.userService.listar().subscribe({
      next: (res) => {
        this.alunos = res.data.filter(u => u.role === 'STUDENT');
      },
      error: (err) => console.error('Erro ao carregar alunos:', err)
    });
  }

  carregarEmprestimos(): void {
    if (this.alunoSelecionadoId === null) return;

    this.carregando = true;
    this.erro = '';

    this.lendingService.listarPorAluno(this.alunoSelecionadoId).subscribe({
      next: (res) => {
        // Os mais recentes primeiro
        this.emprestimos = [...res.data].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar empréstimos do aluno:', err);
        this.erro = 'Não foi possível carregar os empréstimos.';
        this.carregando = false;
      }
    });
  }
}
