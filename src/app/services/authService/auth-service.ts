import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';



export interface User {
  id: number;
  email: string;
  name?: string;
  // agrega aquí lo que devuelva tu API (role, avatar, etc.)
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {

 private http = inject(HttpClient);

  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  /** Usuario actual como observable para suscribirte desde componentes */
  currentUser$ = this.currentUserSubject.asObservable();

  /** Flag síncrono */
  get isLogged(): boolean {
    return !!this.token;
  }

  /** Token actual (si existe) */
  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }


  tokenIsValid() {
    return this.token;
  }

   login(dto: LoginDto) {
     return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, dto).pipe(
       tap(resp => this.saveSession(resp)),
       map(resp => resp.user) // devuelve el usuario para comodidad
     );
   }
register(dto: RegisterDto) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/register`, dto).pipe(
      tap(resp => this.saveSession(resp)),
      map(resp => resp.user) // devuelve el usuario para comodidad
    );
  }
  /** Logout: borra token+usuario y emite null */
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }
   
     // ----------------- helpers -----------------
   
     private saveSession(resp: LoginResponse) {
       localStorage.setItem(this.TOKEN_KEY, resp.token);
       localStorage.setItem(this.USER_KEY, JSON.stringify(resp.user));
       this.currentUserSubject.next(resp.user);
     }
   
     private setUser(user: User) {
       localStorage.setItem(this.USER_KEY, JSON.stringify(user));
       this.currentUserSubject.next(user);
     }
   
     private getStoredUser(): User | null {
       const raw = localStorage.getItem(this.USER_KEY);
       try { return raw ? JSON.parse(raw) as User : null; }
       catch { return null; }
     }
}