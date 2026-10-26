import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Purchase } from '../models/purchases';
import { ApiResponse } from '../models/items';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private baseUrl = `${environment.apiUrl}/purchases`;

  constructor(private http: HttpClient) {}

  listarPendentes(): Observable<ApiResponse<Purchase[]>> {
    return this.http.get<ApiResponse<Purchase[]>>(this.baseUrl);
  }

  listarCompradas(): Observable<ApiResponse<Purchase[]>> {
    return this.http.get<ApiResponse<Purchase[]>>(`${this.baseUrl}/bought`);
  }

  marcarComprada(id: number): Observable<ApiResponse<Purchase>> {
    return this.http.put<ApiResponse<Purchase>>(`${this.baseUrl}/${id}/bought`, {});
  }
}
