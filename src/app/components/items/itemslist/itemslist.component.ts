import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { ItemService } from '../../../services/item.service';
import { Item, Categoria } from '../../../models/items';

@Component({
  selector: 'app-itemslist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MdbFormsModule, MdbRippleModule],
  templateUrl: './itemslist.component.html',
  styleUrl: './itemslist.component.scss'
})
export class ItemslistComponent implements OnInit {
  items: Item[] = [];

  page = 0;
  size = 10;
  totalPages = 0;
  carregando = false;
  fimDaLista = false;

  filtroNome = '';
  filtroCategoria: Categoria | '' = '';
  categorias = Object.values(Categoria);

  isLab = true; // TODO: pegar do AuthService depois

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.carregarItems();
  }

  carregarItems(reset: boolean = false): void {
    if (this.carregando || this.fimDaLista) return;

    if (reset) {
      this.page = 0;
      this.items = [];
      this.fimDaLista = false;
    }

    this.carregando = true;

    this.itemService.listar(
      this.page,
      this.size,
      this.filtroNome || undefined,
      this.filtroCategoria || undefined
    ).subscribe({
      next: (res) => {
        this.items = [...this.items, ...res.content];
        this.totalPages = res.totalPages;
        this.fimDaLista = res.last;
        this.page++;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar items:', err);
        this.carregando = false;
      }
    });
  }

  aplicarFiltro(): void {
    this.carregarItems(true);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const bottomOfPage = document.body.offsetHeight - 200;

    if (scrollPosition >= bottomOfPage) {
      this.carregarItems();
    }
  }

  toggleInativar(item: Item): void {
    this.itemService.toggleInativar(item.id).subscribe({
      next: (atualizado) => {
        item.isInactive = atualizado.isInactive;
      },
      error: (err) => console.error('Erro ao inativar item:', err)
    });
  }

  deletar(item: Item): void {
    if (!confirm(`Deseja realmente excluir "${item.name}"?`)) return;

    this.itemService.deletar(item.id).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.id !== item.id);
      },
      error: (err) => console.error('Erro ao deletar item:', err)
    });
  }
}