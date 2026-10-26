import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

import { LendingService } from '../../../services/lending.service';
import { AuthService } from '../../../services/auth.service';
import { Lending, rotuloStatus, classeStatus } from '../../../models/lendings';

@Component({
  selector: 'app-mylendings',
  standalone: true,
  imports: [CommonModule, RouterLink, MdbRippleModule],
  templateUrl: './mylendings.component.html',
  styleUrl: './mylendings.component.scss'
})
export class MylendingsComponent implements OnInit {
  emprestimos: Lending[] = [];

  carregando = false;
  erro = '';

  // Deixa as funções compartilhadas disponíveis no template
  rotuloStatus = rotuloStatus;
  classeStatus = classeStatus;

  constructor(
    private lendingService: LendingService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarEmprestimos();
  }

  carregarEmprestimos(): void {
    const aluno = this.auth.usuarioLogado();
    if (!aluno) return;

    this.carregando = true;
    this.erro = '';

    this.lendingService.listarPorAluno(aluno.id).subscribe({
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
