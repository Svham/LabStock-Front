import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

import { AuthService } from '../../services/auth.service';
import { ItemService } from '../../services/item.service';
import { LendingService } from '../../services/lending.service';
import { PurchaseService } from '../../services/purchase.service';
import { ProjectService } from '../../services/project.service';
import { Item } from '../../models/items';
import { LendingStatus } from '../../models/lendings';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MdbRippleModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private itemService = inject(ItemService);
  private lendingService = inject(LendingService);
  private purchaseService = inject(PurchaseService);
  private projectService = inject(ProjectService);

  usuario = this.auth.usuarioLogado();
  isLab = this.auth.isLab();
  isTeacher = this.auth.isTeacher();
  isStudent = this.auth.isStudent();

  // Números dos cartões. null = ainda carregando (ou falhou): a tela mostra "..."
  itensAtivos: number | null = null;
  itensDisponiveis: number | null = null;
  itensEstoqueBaixo: Item[] = [];
  estoqueBaixoCarregado = false;
  emprestimosPendentes: number | null = null;
  comprasPendentes: number | null = null;
  projetosAtivos: number | null = null;
  meusPendentes: number | null = null;
  meusEmUso: number | null = null;

  private rotulosPerfil: Record<string, string> = {
    STUDENT: 'Aluno',
    TEACHER: 'Professor',
    LAB: 'Laboratorista'
  };

  get perfilDoUsuario(): string {
    return this.usuario ? (this.rotulosPerfil[this.usuario.role] ?? this.usuario.role) : '';
  }

  ngOnInit(): void {
    this.carregarItens();

    if (this.isLab) {
      this.carregarEmprestimosPendentes();
      this.carregarComprasPendentes();
    }
    if (this.isTeacher) {
      this.carregarProjetosAtivos();
    }
    if (this.isStudent) {
      this.carregarMeusEmprestimos();
    }
  }

  private carregarItens(): void {
    this.itemService.listar(0, 1000).subscribe({
      next: (res) => {
        const ativos = res.data.filter(i => !i.isInactive);
        this.itensAtivos = ativos.length;
        this.itensDisponiveis = ativos.filter(i => i.availableQuantity > 0).length;
        // Mesma regra da lista de itens: disponível abaixo do mínimo = estoque baixo
        this.itensEstoqueBaixo = ativos.filter(i => i.availableQuantity < i.minQuantity);
        this.estoqueBaixoCarregado = true;
      },
      error: (err) => console.error('Erro ao carregar itens do dashboard:', err)
    });
  }

  private carregarEmprestimosPendentes(): void {
    this.lendingService.listar(LendingStatus.PENDING).subscribe({
      next: (res) => this.emprestimosPendentes = res.data.length,
      error: (err) => console.error('Erro ao carregar empréstimos pendentes:', err)
    });
  }

  private carregarComprasPendentes(): void {
    this.purchaseService.listarPendentes().subscribe({
      next: (res) => this.comprasPendentes = res.data.length,
      error: (err) => console.error('Erro ao carregar compras pendentes:', err)
    });
  }

  private carregarProjetosAtivos(): void {
    this.projectService.listar().subscribe({
      next: (res) => this.projetosAtivos = res.data.filter(p => !p.isInactive).length,
      error: (err) => console.error('Erro ao carregar projetos:', err)
    });
  }

  private carregarMeusEmprestimos(): void {
    if (!this.usuario) return;

    this.lendingService.listarPorAluno(this.usuario.id).subscribe({
      next: (res) => {
        this.meusPendentes = res.data.filter(e => e.status === LendingStatus.PENDING).length;
        // Aprovado e ainda não devolvido = o item está comigo agora
        this.meusEmUso = res.data.filter(e => e.status === LendingStatus.APPROVED && !e.returned).length;
      },
      error: (err) => console.error('Erro ao carregar meus empréstimos:', err)
    });
  }
}
