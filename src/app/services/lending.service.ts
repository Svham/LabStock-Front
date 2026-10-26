import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lending, LendingRequest, LendingStatus } from '../models/lendings';
import { ApiResponse } from '../models/items';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LendingService {
  private baseUrl = `${environment.apiUrl}/lendings`;

  constructor(private http: HttpClient) {}

  criar(request: LendingRequest): Observable<ApiResponse<Lending>> {
    return this.http.post<ApiResponse<Lending>>(this.baseUrl, request);
  }

  listar(status?: LendingStatus): Observable<ApiResponse<Lending[]>> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ApiResponse<Lending[]>>(this.baseUrl, { params });
  }

  aprovar(id: number): Observable<ApiResponse<Lending>> {
    return this.http.put<ApiResponse<Lending>>(`${this.baseUrl}/${id}/approve`, {});
  }

  rejeitar(id: number): Observable<ApiResponse<Lending>> {
    return this.http.put<ApiResponse<Lending>>(`${this.baseUrl}/${id}/reject`, {});
  }

  devolver(id: number): Observable<ApiResponse<Lending>> {
    return this.http.put<ApiResponse<Lending>>(`${this.baseUrl}/${id}/return`, {});
  }
}
