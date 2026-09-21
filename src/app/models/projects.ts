import { Categoria } from './items';

export interface Project {
  id: number;
  name: string;
  isInactive: boolean;
  createdAt: string;
  items: ProjectItem[];
}

export interface ProjectRequest {
  name: string;
}

export interface ProjectItem {
  itemId: number;
  itemName: string;
  category: Categoria;
  quantityNeeded: number;
  availableQuantity: number;
}

export interface ProjectItemRequest {
  itemId: number;
  quantityNeeded: number;
}
