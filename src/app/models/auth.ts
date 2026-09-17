export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: UserResponse;
}
