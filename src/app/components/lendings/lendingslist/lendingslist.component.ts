import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { Observable } from 'rxjs';

import { LendingService } from '../../../services/lending.service';
import { Lending, LendingStatus } from '../../../models/lendings';
import { ApiResponse } from '../../../models/items';

@Component({
  selector: 'app-lendingslist',
  standalone: true,
  imports: [CommonModule, FormsModule, MdbRippleModule],
  templateUrl: './lendingslist.component.html',
  styleUrl: './lendingslist.component.scss'
})
export class LendingslistComponent implements OnInit {
  emprestimos: Lending[] = [];

  carregando = false;
  erro = '';
  processandoId: number | null = null;

  filtroStatus: LendingStatus | '' = '';
  statusOpcoes = Object.values(LendingStatus);

  constructor(private lendingService: LendingService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;

    this.lendingService.listar(this.filtroStatus || undefined).subscribe({
      next: (res) => {
        this.emprestimos = res.data;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar empréstimos:', err);
        this.erro = 'Não foi possível carregar os empréstimos.';
        this.carregando = false;
      }
    });
  }

  aprovar(emprestimo: Lending): void {
    this.executar(this.lendingService.aprovar(emprestimo.id), emprestimo.id);
  }

  rejeitar(emprestimo: Lending): void {
    if (!confirm(`Rejeitar o empréstimo de ${emprestimo.quantity}x "${emprestimo.itemName}" para ${emprestimo.studentName}?`)) return;
    this.executar(this.lendingService.rejeitar(emprestimo.id), emprestimo.id);
  }

  devolver(emprestimo: Lending): void {
    if (!confirm(`Registrar a devolução de ${emprestimo.quantity}x "${emprestimo.itemName}" por ${emprestimo.studentName}?`)) return;
    this.executar(this.lendingService.devolver(emprestimo.id), emprestimo.id);
  }

  // Roda a ação no backend e, se der certo, recarrega a lista para mostrar o status novo
  private executar(acao: Observable<ApiResponse<Lending>>, id: number): void {
    this.erro = '';
    this.processandoId = id;

    acao.subscribe({
      next: () => {
        this.processandoId = null;
        this.carregar();
      },
      error: (err) => {
        console.error('Erro ao atualizar empréstimo:', err);
        // O backend explica o motivo (ex: "Apenas empréstimos pendentes podem ser aprovados")
        this.erro = err.error?.message ?? 'Erro ao atualizar o empréstimo.';
        this.processandoId = null;
      }
    });
  }

  // Aprovado e ainda não devolvido = o item está emprestado agora
  emUso(emprestimo: Lending): boolean {
    return emprestimo.status === LendingStatus.APPROVED && !emprestimo.returned;
  }

  rotuloStatus(emprestimo: Lending): string {
    if (emprestimo.status === LendingStatus.PENDING) return 'Pendente';
    if (emprestimo.status === LendingStatus.REJECTED) return 'Rejeitado';
    return emprestimo.returned ? 'Devolvido' : 'Em uso';
  }

  classeStatus(emprestimo: Lending): string {
    if (emprestimo.status === LendingStatus.PENDING) return 'bg-warning text-dark';
    if (emprestimo.status === LendingStatus.REJECTED) return 'bg-danger';
    return emprestimo.returned ? 'bg-success' : 'bg-primary';
  }

  rotuloOpcao(status: LendingStatus): string {
    if (status === LendingStatus.PENDING) return 'Pendentes';
    if (status === LendingStatus.APPROVED) return 'Aprovados';
    return 'Rejeitados';
  }
}
