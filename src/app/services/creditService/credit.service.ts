import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface AddCreditDto{
    delta: number,
   reason?:string,
   reference_type?: string,
   reference_id?: number,
  metadata?: { note: string }
}

@Injectable({ providedIn: 'root' })
export class CreditService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;


  addCredits(userId: number, data: AddCreditDto) {
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/credits/adjust`, data);
  }

  getCreditsHistoric(id: number) {
    return this.http.get<any>(`${this.apiUrl}/users/${id}/credits/transactions?limit=10000&offset=0`);
  }
  
}