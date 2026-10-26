import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

import { DamagedService } from '../../../services/damaged.service';
import { Damaged } from '../../../models/damaged';

@Component({
  selector: 'app-damagedlist',
  standalone: true,
  imports: [CommonModule, RouterLink, MdbRippleModule],
  templateUrl: './damagedlist.component.html',
  styleUrl: './damagedlist.component.scss'
})
export class DamagedlistComponent implements OnInit {
  registros: Damaged[] = [];

  carregando = false;
  erro = '';

  constructor(private damagedService: DamagedService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;

    this.damagedService.listar().subscribe({
      next: (res) => {
        // Os mais recentes primeiro
        this.registros = [...res.data].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar danos:', err);
        this.erro = 'Não foi possível carregar os registros de dano.';
        this.carregando = false;
      }
    });
  }
}
