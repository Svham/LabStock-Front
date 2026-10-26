import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard = "porteiro" da rota: decide se o usuário pode entrar nela.
// Retornar true libera; retornar uma rota (UrlTree) redireciona.

// Exige apenas estar logado
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.estaLogado() ? true : router.createUrlTree(['/login']);
};

// Exige estar logado E ter um dos perfis informados. Uso: roleGuard('LAB')
export function roleGuard(...perfis: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.estaLogado()) {
      return router.createUrlTree(['/login']);
    }

    // Logado mas sem permissão: volta para a página inicial
    return auth.temPerfil(...perfis) ? true : router.createUrlTree(['/admin/dashboard']);
  };
}
