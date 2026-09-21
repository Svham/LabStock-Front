import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

import { ProjectService } from '../../../services/project.service';
import { ItemService } from '../../../services/item.service';
import { ProjectRequest, ProjectItem, ProjectItemRequest } from '../../../models/projects';
import { Item } from '../../../models/items';

@Component({
  selector: 'app-projectsdetails',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MdbFormsModule, MdbRippleModule],
  templateUrl: './projectsdetails.component.html',
  styleUrl: './projectsdetails.component.scss'
})
export class ProjectsdetailsComponent implements OnInit {
  form: FormGroup;

  modoEdicao = false;
  projectId: number | null = null;

  salvando = false;
  erro = '';

  // Itens vinculados
  itensVinculados: ProjectItem[] = [];

  // Dropdown de itens disponíveis
  itensDisponiveis: Item[] = [];
  itemSelecionadoId: number | null = null;
  quantidadeNecessaria = 1;
  vinculando = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private itemService: ItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.modoEdicao = true;
      this.projectId = Number(idParam);
      this.carregarProject(this.projectId);
      this.carregarItensDisponiveis();
    }
  }

  carregarProject(id: number): void {
    this.projectService.buscarPorId(id).subscribe({
      next: (res) => {
        const project = res.data;
        this.form.patchValue({ name: project.name });
        this.itensVinculados = project.items || [];
      },
      error: (err) => {
        console.error('Erro ao carregar projeto:', err);
        this.erro = 'Não foi possível carregar o projeto.';
      }
    });
  }

  carregarItensDisponiveis(): void {
    this.itemService.listar(0, 1000).subscribe({
      next: (res) => {
        // Só itens ativos podem ser vinculados
        this.itensDisponiveis = res.data.filter(i => !i.isInactive);
      },
      error: (err) => console.error('Erro ao carregar itens disponíveis:', err)
    });
  }

  // Filtra os itens do dropdown removendo os que já estão vinculados
  get itensDisponiveisFiltrados(): Item[] {
    const idsVinculados = this.itensVinculados.map(v => v.itemId);
    return this.itensDisponiveis.filter(i => !idsVinculados.includes(i.id));
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';

    const dados: ProjectRequest = this.form.value;

    const request = this.modoEdicao && this.projectId
      ? this.projectService.editar(this.projectId, dados)
      : this.projectService.criar(dados);

    request.subscribe({
      next: (res) => {
        this.salvando = false;

        if (!this.modoEdicao) {
          // Acabou de criar → entra em modo edição pra permitir vincular itens
          this.modoEdicao = true;
          this.projectId = res.data.id;
          this.itensVinculados = res.data.items || [];
          this.carregarItensDisponiveis();
        }
      },
      error: (err) => {
        console.error('Erro ao salvar projeto:', err);
        this.erro = 'Erro ao salvar o projeto. Verifique os dados e tente novamente.';
        this.salvando = false;
      }
    });
  }

  vincularItem(): void {
    if (!this.projectId || !this.itemSelecionadoId || this.quantidadeNecessaria < 1) return;

    this.vinculando = true;

    const request: ProjectItemRequest = {
      itemId: this.itemSelecionadoId,
      quantityNeeded: this.quantidadeNecessaria
    };

    this.projectService.vincularItem(this.projectId, request).subscribe({
      next: () => {
        this.itemSelecionadoId = null;
        this.quantidadeNecessaria = 1;
        this.vinculando = false;
        this.carregarProject(this.projectId!);
      },
      error: (err) => {
        console.error('Erro ao vincular item:', err);
        this.erro = 'Erro ao vincular item ao projeto.';
        this.vinculando = false;
      }
    });
  }

  desvincularItem(item: ProjectItem): void {
    if (!this.projectId) return;
    if (!confirm(`Remover "${item.itemName}" do projeto?`)) return;

    this.projectService.desvincularItem(this.projectId, item.itemId).subscribe({
      next: () => {
        this.itensVinculados = this.itensVinculados.filter(v => v.itemId !== item.itemId);
      },
      error: (err) => console.error('Erro ao desvincular item:', err)
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/projects']);
  }

  voltarParaLista(): void {
    this.router.navigate(['/admin/projects']);
  }

  // getters pra facilitar validação no HTML
  get name() { return this.form.get('name'); }
}
