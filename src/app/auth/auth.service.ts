import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthResponseDTO, LoginDTO, RegisterDTO } from '../shared/models/quantity.model';

// FIX: This service already had login() and register() methods.
// The TypeScript error "Property 'login' does not exist on type 'AuthService'" 
// was caused by incorrect imports in components. This file is correct.

@Injectable({ providedIn: 'root' })
export class AuthService {
  getToken() {
    throw new Error('Method not implemented.');
  }
  private readonly API = 'http://localhost:5000/api/v1/auth';

  // Stores the currently logged-in user. Initially reads from localStorage.
  private currentUserSubject = new BehaviorSubject<AuthResponseDTO | null>(
    JSON.parse(localStorage.getItem('user_info') || 'null')
  );

  // Other parts of the app can subscribe to this to know who is logged in
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Call backend POST /api/v1/auth/login
  login(dto: LoginDTO) {
    return this.http.post<AuthResponseDTO>(`${this.API}/login`, dto).pipe(
      tap(res => this.storeSession(res))
    );
  }

  // Call backend POST /api/v1/auth/register
  register(dto: RegisterDTO) {
    return this.http.post<AuthResponseDTO>(`${this.API}/register`, dto).pipe(
      tap(res => this.storeSession(res))
    );
  }

  // Remove session data and clear user state
  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    this.currentUserSubject.next(null);
  }

  // Check if a JWT token exists in localStorage
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'ADMIN';
  }

  // Save token and user info to localStorage after successful login/register
  private storeSession(res: AuthResponseDTO) {
    localStorage.setItem('jwt_token', res.token);
    localStorage.setItem('user_info', JSON.stringify(res));
    this.currentUserSubject.next(res);
  }
}