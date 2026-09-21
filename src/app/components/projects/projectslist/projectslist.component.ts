import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/projects';

@Component({
  selector: 'app-projectslist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MdbFormsModule, MdbRippleModule],
  templateUrl: './projectslist.component.html',
  styleUrl: './projectslist.component.scss'
})
export class ProjectslistComponent implements OnInit {
  projects: Project[] = [];

  carregando = false;
  filtroNome = '';

  isTeacher = true; // TODO: pegar do AuthService depois

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.carregarProjects();
  }

  carregarProjects(): void {
    this.carregando = true;

    this.projectService.listar(this.filtroNome || undefined).subscribe({
      next: (res) => {
        this.projects = res.data;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar projetos:', err);
        this.carregando = false;
      }
    });
  }

  aplicarFiltro(): void {
    this.carregarProjects();
  }

  toggleInativar(project: Project): void {
    this.projectService.toggleInativar(project.id).subscribe({
      next: (res) => {
        project.isInactive = res.data.isInactive;
      },
      error: (err) => console.error('Erro ao inativar projeto:', err)
    });
  }

  deletar(project: Project): void {
    if (!confirm(`Deseja realmente excluir "${project.name}"?`)) return;

    this.projectService.deletar(project.id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.id !== project.id);
      },
      error: (err) => console.error('Erro ao deletar projeto:', err)
    });
  }
}
