import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Damaged, DamagedRequest } from '../models/damaged';
import { ApiResponse } from '../models/items';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DamagedService {
  private baseUrl = `${environment.apiUrl}/damaged`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ApiResponse<Damaged[]>> {
    return this.http.get<ApiResponse<Damaged[]>>(this.baseUrl);
  }

  criar(request: DamagedRequest): Observable<ApiResponse<Damaged>> {
    return this.http.post<ApiResponse<Damaged>>(this.baseUrl, request);
  }
}
