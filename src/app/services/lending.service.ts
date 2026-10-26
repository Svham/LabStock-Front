import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lending, LendingRequest } from '../models/lendings';
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
}
