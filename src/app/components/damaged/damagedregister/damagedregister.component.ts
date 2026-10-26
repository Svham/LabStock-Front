import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

import { ItemService } from '../../../services/item.service';
import { UserService } from '../../../services/user.service';
import { DamagedService } from '../../../services/damaged.service';
import { Item } from '../../../models/items';
import { User } from '../../../models/users';
import { DamagedRequest } from '../../../models/damaged';

@Component({
  selector: 'app-damagedregister',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MdbRippleModule],
  templateUrl: './damagedregister.component.html',
  styleUrl: './damagedregister.component.scss'
})
export class DamagedregisterComponent implements OnInit {
  form: FormGroup;

  itens: Item[] = [];
  alunos: User[] = [];
  laboratoristas: User[] = [];

  salvando = false;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private userService: UserService,
    private damagedService: DamagedService,
    private router: Router
  ) {
    this.form = this.fb.group({
      itemId: [null, Validators.required],
      studentId: [null, Validators.required],
      // TODO: quando o usuário logado for guardado no login, o laboratorista deixa de ser um select
      labId: [null, Validators.required],
      // O pattern recusa motivo só com espaços (o backend também recusa)
      reason: ['', [Validators.required, Validators.pattern(/\S/)]],
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
        // O dano só pode ser registrado em item ativo e com estoque
        this.itens = res.data.filter(i => !i.isInactive && i.quantity > 0);
      },
      error: (err) => console.error('Erro ao carregar itens:', err)
    });
  }

  carregarUsuarios(): void {
    this.userService.listar().subscribe({
      next: (res) => {
        this.alunos = res.data.filter(u => u.role === 'STUDENT');
        this.laboratoristas = res.data.filter(u => u.role === 'LAB');
      },
      error: (err) => console.error('Erro ao carregar usuários:', err)
    });
  }

  get itemSelecionado(): Item | undefined {
    return this.itens.find(i => i.id === this.form.value.itemId);
  }

  // O backend compara o dano com o estoque TOTAL do item (quantity), não com o disponível
  get excedeEstoque(): boolean {
    const item = this.itemSelecionado;
    return !!item && this.form.value.quantity > item.quantity;
  }

  registrar(): void {
    if (this.form.invalid || this.excedeEstoque) {
      this.form.markAllAsTouched();
      return;
    }

    const item = this.itemSelecionado;
    const quantidade = this.form.value.quantity;
    if (!confirm(`Registrar dano de ${quantidade}x "${item?.name}"? O estoque do item será reduzido e o registro não pode ser desfeito.`)) return;

    this.salvando = true;
    this.erro = '';

    const dados = this.form.value as DamagedRequest;

    this.damagedService.criar(dados).subscribe({
      next: () => {
        this.salvando = false;
        this.router.navigate(['/admin/damaged']);
      },
      error: (err) => {
        console.error('Erro ao registrar dano:', err);
        // O backend explica o motivo (ex: "Quantidade danificada maior que o estoque total")
        this.erro = err.error?.message ?? 'Erro ao registrar o dano. Tente novamente.';
        this.salvando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/damaged']);
  }

  get itemId() { return this.form.get('itemId'); }
  get studentId() { return this.form.get('studentId'); }
  get labId() { return this.form.get('labId'); }
  get reason() { return this.form.get('reason'); }
  get quantity() { return this.form.get('quantity'); }
}
