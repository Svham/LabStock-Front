export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// Todos os campos são opcionais: o backend só altera o que for enviado
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  password?: string;
}
