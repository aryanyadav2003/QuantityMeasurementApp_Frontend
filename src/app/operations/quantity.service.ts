import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { QuantityDTO } from '../shared/models/quantity.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class QuantityService {
  private readonly API = `${environment.apiUrl}api/v1/quantities`;

  constructor(private http: HttpClient) {}

  // Compare two quantities (e.g. 2 feet vs 24 inches)
  compare(q1: QuantityDTO, q2: QuantityDTO) {
    return this.http.post<any>(`${this.API}/compare`, {
      thisQuantity: q1,
      thatQuantity: q2
    });
  }

  // Convert a quantity to a different unit
  convert(q: QuantityDTO, targetUnit: string) {
    return this.http.post<any>(`${this.API}/convert`, {
      thisQuantity: q,
      targetUnit
    });
  }

  // Add two quantities together
  add(q1: QuantityDTO, q2: QuantityDTO, targetUnit: string) {
    return this.http.post<any>(`${this.API}/add`, {
      thisQuantity: q1,
      thatQuantity: q2,
      targetUnit
    });
  }

  // Subtract second quantity from first
  subtract(q1: QuantityDTO, q2: QuantityDTO, targetUnit: string) {
    return this.http.post<any>(`${this.API}/subtract`, {
      thisQuantity: q1,
      thatQuantity: q2,
      targetUnit
    });
  }

  // Divide first quantity by second
  divide(q1: QuantityDTO, q2: QuantityDTO) {
    return this.http.post<any>(`${this.API}/divide`, {
      thisQuantity: q1,
      thatQuantity: q2
    });
  }

  // Get full history — requires JWT token (user must be logged in)
  getHistory() {
    return this.http.get<any[]>(`${this.API}/history`);
  }

  // Get history filtered by operation type
  getByOperation(op: string) {
    return this.http.get<any>(`${this.API}/history/operation/${op}`);
  }

  // Get history filtered by measurement type
  getByType(type: string) {
    return this.http.get<any>(`${this.API}/history/type/${type}`);
  }

  // Get total count of measurements
  getCount() {
    return this.http.get<{ totalCount: number }>(`${this.API}/count`);
  }
}