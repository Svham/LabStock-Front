import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

import { ProjectService } from '../../../services/project.service';
import { ProjectRequest } from '../../../models/projects';

@Component({
  selector: 'app-projectsdetails',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MdbFormsModule, MdbRippleModule],
  templateUrl: './projectsdetails.component.html',
  styleUrl: './projectsdetails.component.scss'
})
export class ProjectsdetailsComponent implements OnInit {
  form: FormGroup;

  modoEdicao = false;
  projectId: number | null = null;

  salvando = false;
  erro = '';

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
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
    }
  }

  carregarProject(id: number): void {
    this.projectService.buscarPorId(id).subscribe({
      next: (res) => {
        const project = res.data;
        this.form.patchValue({
          name: project.name
        });
      },
      error: (err) => {
        console.error('Erro ao carregar projeto:', err);
        this.erro = 'Não foi possível carregar o projeto.';
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

    const dados: ProjectRequest = this.form.value;

    const request = this.modoEdicao && this.projectId
      ? this.projectService.editar(this.projectId, dados)
      : this.projectService.criar(dados);

    request.subscribe({
      next: () => {
        this.salvando = false;
        this.router.navigate(['/admin/projects']);
      },
      error: (err) => {
        console.error('Erro ao salvar projeto:', err);
        this.erro = 'Erro ao salvar o projeto. Verifique os dados e tente novamente.';
        this.salvando = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/admin/projects']);
  }

  // getters pra facilitar validação no HTML
  get name() { return this.form.get('name'); }
}
