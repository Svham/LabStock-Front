import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  usuario!: string;
  senha!: string;

  router = inject(Router);
  authService = inject(AuthService);

  logar() {
    const login = {
      email: this.usuario,
      password: this.senha
    };

    this.authService.login(login).subscribe({
      next: (resposta) => {
        if (resposta.success) {
          this.router.navigate(['/admin/items']);
        } else {
          alert(resposta.message);
        }
      },
      error: (erro) => {
        console.error(erro);
        alert('Erro ao conectar com o servidor!');
      }
    });
  }

}
