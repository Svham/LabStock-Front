import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item, ItemRequest, PageResponse, Categoria, ApiResponse } from '../models/items';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private baseUrl = `${environment.apiUrl}/items`;

  constructor(private http: HttpClient) {}

  listar(page: number, size: number, name?: string, category?: Categoria): Observable<ApiResponse<Item[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (name) {
      params = params.set('name', name);
    }
    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<ApiResponse<Item[]>>(this.baseUrl, { params });
  }

  buscarPorId(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.baseUrl}/${id}`);
  }

  criar(item: ItemRequest): Observable<Item> {
    return this.http.post<Item>(this.baseUrl, item);
  }

  editar(id: number, item: ItemRequest): Observable<Item> {
    return this.http.put<Item>(`${this.baseUrl}/${id}`, item);
  }

  toggleInativar(id: number): Observable<Item> {
    return this.http.patch<Item>(`${this.baseUrl}/${id}/inactivate`, {});
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
