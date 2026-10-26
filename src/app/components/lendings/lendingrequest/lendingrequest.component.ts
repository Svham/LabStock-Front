import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

import { ItemService } from '../../../services/item.service';
import { UserService } from '../../../services/user.service';
import { LendingService } from '../../../services/lending.service';
import { Item } from '../../../models/items';
import { User } from '../../../models/users';
import { LendingRequest } from '../../../models/lendings';

@Component({
  selector: 'app-lendingrequest',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MdbRippleModule],
  templateUrl: './lendingrequest.component.html',
  styleUrl: './lendingrequest.component.scss'
})
export class LendingrequestComponent implements OnInit {
  form: FormGroup;

  itens: Item[] = [];
  alunos: User[] = [];
  professores: User[] = [];

  salvando = false;
  erro = '';
  sucesso = '';

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private userService: UserService,
    private lendingService: LendingService
  ) {
    this.form = this.fb.group({
      // TODO: quando o usuário logado for guardado no login, o aluno deixa de ser um select
      studentId: [null, Validators.required],
      teacherId: [null, Validators.required],
      itemId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.carregarItens();
    this.carregarUsuarios();
  }

  carregarItens(): void {
    this.itemService.listar(0, 1000).subscribe({
      next: (res) => {
        // Só faz sentido pedir item ativo e com estoque disponível
        this.itens = res.data.filter(i => !i.isInactive && i.availableQuantity > 0);
      },
      error: (err) => console.error('Erro ao carregar itens:', err)
    });
  }

  carregarUsuarios(): void {
    this.userService.listar().subscribe({
      next: (res) => {
        this.alunos = res.data.filter(u => u.role === 'STUDENT');
        this.professores = res.data.filter(u => u.role === 'TEACHER');
      },
      error: (err) => console.error('Erro ao carregar usuários:', err)
    });
  }

  // Item escolhido no select (para mostrar o estoque disponível)
  get itemSelecionado(): Item | undefined {
    return this.itens.find(i => i.id === this.form.value.itemId);
  }

  get excedeEstoque(): boolean {
    const item = this.itemSelecionado;
    return !!item && this.form.value.quantity > item.availableQuantity;
  }

  solicitar(): void {
    if (this.form.invalid || this.excedeEstoque) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';
    this.sucesso = '';

    const dados = this.form.value as LendingRequest;

    this.lendingService.criar(dados).subscribe({
      next: (res) => {
        this.sucesso = `Empréstimo de ${res.data.quantity}x "${res.data.itemName}" solicitado! Aguardando aprovação do laboratório.`;
        this.form.reset({ studentId: null, teacherId: null, itemId: null, quantity: 1 });
        this.salvando = false;
        this.carregarItens();
      },
      error: (err) => {
        console.error('Erro ao solicitar empréstimo:', err);
        // O backend explica o motivo (ex: "Estoque insuficiente. Disponível: 3")
        this.erro = err.error?.message ?? 'Erro ao solicitar o empréstimo. Tente novamente.';
        this.salvando = false;
      }
    });
  }

  get studentId() { return this.form.get('studentId'); }
  get teacherId() { return this.form.get('teacherId'); }
  get itemId() { return this.form.get('itemId'); }
  get quantity() { return this.form.get('quantity'); }
}
