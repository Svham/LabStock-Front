import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

import { AuthService } from '../../../services/auth.service';
import { RegisterRequest } from '../../../models/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MdbRippleModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form: FormGroup;

  salvando = false;
  erro = '';
  sucesso = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/\S/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      // Só existe no front: serve para a pessoa digitar a senha duas vezes e não errar
      confirmPassword: ['', Validators.required]
    });
  }

  get senhasDiferentes(): boolean {
    return this.form.value.password !== this.form.value.confirmPassword;
  }

  cadastrar(): void {
    if (this.form.invalid || this.senhasDiferentes) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';
    this.sucesso = false;

    const { name, email, password } = this.form.value;
    const dados: RegisterRequest = { name, email, password };

    this.authService.register(dados).subscribe({
      next: () => {
        this.sucesso = true;
        this.form.reset();
        this.salvando = false;
      },
      error: (err) => {
        console.error('Erro ao cadastrar:', err);
        // O backend explica o motivo (ex: "Email já cadastrado")
        this.erro = err.error?.message ?? 'Erro ao realizar o cadastro. Tente novamente.';
        this.salvando = false;
      }
    });
  }

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }
}
