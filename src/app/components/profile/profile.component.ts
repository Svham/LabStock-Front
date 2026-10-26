import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UpdateProfileRequest } from '../../models/users';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MdbRippleModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  private auth = inject(AuthService);

  usuario = this.auth.usuarioLogado();

  form: FormGroup;

  salvando = false;
  erro = '';
  sucesso = '';

  private rotulosPerfil: Record<string, string> = {
    STUDENT: 'Aluno',
    TEACHER: 'Professor',
    LAB: 'Laboratorista'
  };

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      name: [this.usuario?.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: [this.usuario?.email, [Validators.required, Validators.email]],
      // A senha é opcional: vazia = não muda. Se preencher, o backend exige de 6 a 50 caracteres.
      password: ['', [Validators.minLength(6), Validators.maxLength(50)]],
      confirmPassword: ['']
    });
  }

  get perfilDoUsuario(): string {
    return this.usuario ? (this.rotulosPerfil[this.usuario.role] ?? this.usuario.role) : '';
  }

  get senhasDiferentes(): boolean {
    return this.form.value.password !== this.form.value.confirmPassword;
  }

  salvar(): void {
    if (!this.usuario) return;

    if (this.form.invalid || this.senhasDiferentes) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.erro = '';
    this.sucesso = '';

    const { name, email, password } = this.form.value;
    const dados: UpdateProfileRequest = { name, email };
    if (password) {
      dados.password = password;
    }

    this.userService.atualizarPerfil(this.usuario.id, dados).subscribe({
      next: (res) => {
        // Atualiza o usuário guardado no login para o menu mostrar o nome novo
        this.auth.atualizarUsuario({ name: res.data.name, email: res.data.email });
        this.usuario = this.auth.usuarioLogado();
        this.form.patchValue({ password: '', confirmPassword: '' });
        this.form.markAsUntouched();
        this.sucesso = 'Perfil atualizado com sucesso!';
        this.salvando = false;
      },
      error: (err) => {
        console.error('Erro ao atualizar perfil:', err);
        // O backend explica o motivo (ex: "Email já está em uso")
        this.erro = err.error?.message ?? 'Erro ao atualizar o perfil. Tente novamente.';
        this.salvando = false;
      }
    });
  }

  get name() { return this.form.get('name'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get confirmPassword() { return this.form.get('confirmPassword'); }
}
