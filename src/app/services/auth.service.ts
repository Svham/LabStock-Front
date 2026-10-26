import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, UserResponse } from '../models/auth';

// Nome da "gaveta" do localStorage onde o usuário logado fica guardado
const CHAVE_USUARIO = 'labstock.usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  // Usuário logado. Começa lendo o localStorage, para a sessão sobreviver ao F5.
  private usuario: UserResponse | null = this.lerDoStorage();

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request).pipe(
      tap((resposta) => {
        // Só guarda se o backend confirmou o login
        if (resposta.success) {
          this.usuario = resposta.data;
          localStorage.setItem(CHAVE_USUARIO, JSON.stringify(resposta.data));
        }
      })
    );
  }

  // Cadastro público: o backend cria o usuário sempre como aluno (STUDENT)
  register(request: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/register`, request);
  }

  logout(): void {
    this.usuario = null;
    localStorage.removeItem(CHAVE_USUARIO);
  }

  // Atualiza o usuário guardado (ex.: depois de editar o perfil), sem precisar logar de novo
  atualizarUsuario(dados: Partial<UserResponse>): void {
    if (!this.usuario) return;

    this.usuario = { ...this.usuario, ...dados };
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(this.usuario));
  }

  usuarioLogado(): UserResponse | null {
    return this.usuario;
  }

  estaLogado(): boolean {
    return this.usuario !== null;
  }

  temPerfil(...perfis: string[]): boolean {
    return this.usuario !== null && perfis.includes(this.usuario.role);
  }

  isLab(): boolean {
    return this.temPerfil('LAB');
  }

  isTeacher(): boolean {
    return this.temPerfil('TEACHER');
  }

  isStudent(): boolean {
    return this.temPerfil('STUDENT');
  }

  private lerDoStorage(): UserResponse | null {
    const texto = localStorage.getItem(CHAVE_USUARIO);
    if (!texto) return null;

    try {
      return JSON.parse(texto) as UserResponse;
    } catch {
      // Valor corrompido na gaveta: descarta e trata como não logado
      localStorage.removeItem(CHAVE_USUARIO);
      return null;
    }
  }
}
