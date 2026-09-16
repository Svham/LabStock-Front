export enum Categoria {
  ELETRONICA = 'ELETRONICA',
  MECANICA = 'MECANICA',
  ELETROMECANICA = 'ELETROMECANICA',
  ESTRUTURAL = 'ESTRUTURAL'
}

export interface Item {
  id: number;
  name: string;
  category: Categoria;
  quantity: number;
  availableQuantity: number;
  minQuantity: number;
  isInactive: boolean;
  createdAt: string;
}

export interface ItemRequest {
  name: string;
  category: Categoria;
  quantity: number;
  minQuantity: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;      // página atual
  size: number;
  last: boolean;
}
