import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

import { ItemService } from '../../../services/item.service';
import { Categoria, ItemRequest } from '../../../models/items';

@Component({
  selector: 'app-itemsdetails',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MdbFormsModule, MdbRippleModule,],
  templateUrl: './itemsdetails.component.html',
  styleUrl: './itemsdetails.component.scss'
})
export class ItemsdetailsComponent implements OnInit {
  form: FormGroup;
  categorias = Object.values(Categoria);

  modoEdicao = false;
  itemId: number | null = null;

  salvando = false;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      minQuantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.modoEdicao = true;
      this.itemId = Number(idParam);
      this.carregarItem(this.itemId);
    }
  }

  carregarItem(id: number): void {
    this.itemService.buscarPorId(id).subscribe({
      next: (item) => {
        this.form.patchValue({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          minQuantity: item.minQuantity
        });
      },
      error: (err) => {
        console.error('Erro ao carregar item:', err);
        this.erro = 'Não foi possível carregar o item.';
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';

    const dados: ItemRequest = this.form.value;

    const request = this.modoEdicao && this.itemId
      ? this.itemService.editar(this.itemId, dados)
      : this.itemService.criar(dados);

    request.subscribe({
      next: () => {
        this.salvando = false;
        this.router.navigate(['/admin/items']);
      },
      error: (err) => {
        console.error('Erro ao salvar item:', err);
        this.erro = 'Erro ao salvar o item. Verifique os dados e tente novamente.';
        this.salvando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/items']);
  }

  // getters pra facilitar validação no HTML
  get name() { return this.form.get('name'); }
  get category() { return this.form.get('category'); }
  get quantity() { return this.form.get('quantity'); }
  get min() { return this.form.get('min'); }
}
