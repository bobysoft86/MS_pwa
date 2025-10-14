import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from 'src/app/core/interfaces/user.interface';


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
export class UserService {
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

  /** Usuario actual (síncrono) */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** Login: llama a la API, guarda token+usuario y emite el estado */
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

  /** (Opcional) Obtener perfil con token ya guardado */
  getProfile() {
    return this.http.get<User>(`${environment.apiUrl}/auth/profile`).pipe(
      tap(user => this.setUser(user))
    );
  }
  
     getStoredUser(): User | null {
      const raw = localStorage.getItem(this.USER_KEY);
      try { return raw ? JSON.parse(raw) as User : null; }
      catch { return null; }
    }

    getAllUsers() {
      return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    deleteUser(id: number) {
      return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }

    createUser(data:RegisterDto ) {
      return this.http.post<User>(`${environment.apiUrl}/auth/register`, data);
    }

    getUserById(id: any) {
      return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    updateUser(id: any, data: Partial<User>) {
      return this.http.patch<User>(`${environment.apiUrl}/users/${id}`, data);
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


}