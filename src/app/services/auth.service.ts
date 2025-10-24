import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  nome: string;
  email: string;
  password: string;
  role: 'user' | 'admin'; // Adicionando role
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'hanami_auth';
  private readonly USERS_KEY = 'hanami_users';

  // Signals para estado de autenticação
  private _isAuthenticated = signal<boolean>(this.getInitialAuthState());
  private _currentUser = signal<string | null>(this.getStoredCurrentUser());
  private _currentUserName = signal<string | null>(this.getStoredCurrentUserName());
  private _currentUserRole = signal<'user' | 'admin' | null>(this.getStoredCurrentUserRole());

  public isAuthenticated = this._isAuthenticated.asReadonly();
  public currentUser = this._currentUser.asReadonly();
  public currentUserName = this._currentUserName.asReadonly();
  public currentUserRole = this._currentUserRole.asReadonly();

  constructor(private router: Router) {}

  private getInitialAuthState(): boolean {
    return this.getFromStorage(this.STORAGE_KEY) === 'true';
  }

  private getStoredCurrentUser(): string | null {
    return this.getFromStorage('currentUser');
  }

  private getStoredCurrentUserName(): string | null {
    return this.getFromStorage('currentUserName');
  }

  private getStoredCurrentUserRole(): 'user' | 'admin' | null {
    return this.getFromStorage('currentUserRole') as 'user' | 'admin' | null;
  }

  private getFromStorage(key: string): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setToStorage(key: string, value: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  }

  private removeFromStorage(key: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
    }
  }

  login(email: string, password: string): Observable<boolean> {
    return of(this.authenticateUser(email, password)).pipe(
      delay(500)
    );
  }

  private authenticateUser(email: string, password: string): boolean {
    const users = this.getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this._isAuthenticated.set(true);
      this._currentUser.set(email);
      this._currentUserName.set(user.nome);
      this._currentUserRole.set(user.role);
      
      this.setToStorage(this.STORAGE_KEY, 'true');
      this.setToStorage('currentUser', email);
      this.setToStorage('currentUserName', user.nome);
      this.setToStorage('currentUserRole', user.role);
      
      return true;
    }
    return false;
  }

  logout(): void {
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
    this._currentUserName.set(null);
    this._currentUserRole.set(null);
    
    this.removeFromStorage(this.STORAGE_KEY);
    this.removeFromStorage('currentUser');
    this.removeFromStorage('currentUserName');
    this.removeFromStorage('currentUserRole');
    
    this.router.navigate(['/']);
  }

  register(nome: string, email: string, password: string): Observable<boolean> {
    return of(this.registerUser(nome, email, password)).pipe(
      delay(500)
    );
  }

  private registerUser(nome: string, email: string, password: string): boolean {
    const users = this.getStoredUsers();
    
    // Verifica se usuário já existe
    if (users.find(u => u.email === email)) {
      return false;
    }

    // Adiciona novo usuário como 'user'
    const newUser: User = { nome, email, password, role: 'user' };
    users.push(newUser);
    this.setStoredUsers(users);
    
    // Não faz login automático - redireciona para login
    return true;
  }

  private getStoredUsers(): User[] {
    const stored = this.getFromStorage(this.USERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Usuários padrão para demonstração
    return [
      { nome: 'Administrador', email: 'admin@hanami.com', password: 'admin123', role: 'admin' },
      { nome: 'Cliente Teste', email: 'cliente@hanami.com', password: '123456', role: 'user' }
    ];
  }

  private setStoredUsers(users: User[]): void {
    this.setToStorage(this.USERS_KEY, JSON.stringify(users));
  }

  getDisplayName(): string {
    return this._currentUserName() || this._currentUser()?.split('@')[0] || 'Visitante';
  }

  isAdmin(): boolean {
    return this._currentUserRole() === 'admin';
  }
}