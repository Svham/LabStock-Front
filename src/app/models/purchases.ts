import { Categoria } from './items';

export interface Purchase {
  id: number;
  itemId: number;
  itemName: string;
  category: Categoria;
  suggestion: number;
  bought: boolean;
  createdAt: string;
  updatedAt: string;
}
