import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

import { PurchaseService } from '../../../services/purchase.service';
import { Purchase } from '../../../models/purchases';

type Visao = 'pendentes' | 'compradas';

@Component({
  selector: 'app-purchaseslist',
  standalone: true,
  imports: [CommonModule, MdbRippleModule],
  templateUrl: './purchaseslist.component.html',
  styleUrl: './purchaseslist.component.scss'
})
export class PurchaseslistComponent implements OnInit {
  compras: Purchase[] = [];

  visao: Visao = 'pendentes';
  carregando = false;
  erro = '';
  processandoId: number | null = null;

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit(): void {
    this.carregar();
  }

  trocarVisao(visao: Visao): void {
    if (this.visao === visao) return;
    this.visao = visao;
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    const requisicao = this.visao === 'pendentes'
      ? this.purchaseService.listarPendentes()
      : this.purchaseService.listarCompradas();

    requisicao.subscribe({
      next: (res) => {
        // As atualizadas mais recentemente primeiro
        this.compras = [...res.data].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar compras:', err);
        this.erro = 'Não foi possível carregar as compras.';
        this.carregando = false;
      }
    });
  }

  marcarComprada(compra: Purchase): void {
    if (!confirm(`Marcar "${compra.itemName}" (${compra.suggestion} un.) como comprado?`)) return;

    this.erro = '';
    this.processandoId = compra.id;

    this.purchaseService.marcarComprada(compra.id).subscribe({
      next: () => {
        this.processandoId = null;
        this.carregar();
      },
      error: (err) => {
        console.error('Erro ao marcar compra:', err);
        // O backend explica o motivo (ex: "Sugestão já foi marcada como comprada")
        this.erro = err.error?.message ?? 'Erro ao marcar a compra como realizada.';
        this.processandoId = null;
      }
    });
  }
}
