import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'isAuthenticated';
  private readonly USERS_KEY = 'registeredUsers';
  private readonly CURRENT_USER_KEY = 'currentUser';

  // Signals - SEM o $
  private _isAuthenticated = signal<boolean>(this.getInitialAuthState());
  private _currentUser = signal<string | null>(this.getInitialCurrentUser());

  public isAuthenticated = this._isAuthenticated.asReadonly();
  public currentUser = this._currentUser.asReadonly();

  constructor(private router: Router) {}

  private getInitialAuthState(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.STORAGE_KEY) === 'true';
    }
    return false;
  }

  private getInitialCurrentUser(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.CURRENT_USER_KEY);
    }
    return null;
  }

  login(email: string, password: string): Observable<boolean> {
    // Simula uma chamada API com delay
    return of(this.authenticateUser(email, password)).pipe(
      delay(500) // Simula delay de rede
    );
  }

  private authenticateUser(email: string, password: string): boolean {
    const users = this.getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this._isAuthenticated.set(true);
      this._currentUser.set(email);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, 'true');
        localStorage.setItem(this.CURRENT_USER_KEY, email);
      }
      return true;
    }
    return false;
  }

  logout(): void {
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
    this.router.navigate(['/']);
  }

  register(email: string, password: string): Observable<boolean> {
    return of(this.registerUser(email, password)).pipe(
      delay(500)
    );
  }

  private registerUser(email: string, password: string): boolean {
    const users = this.getStoredUsers();
    
    if (users.find(u => u.email === email)) {
      return false;
    }

    users.push({ email, password });
    this.setStoredUsers(users);
    
    // Auto-login após registro
    return this.authenticateUser(email, password);
  }

  getUsername(): string {
    return this._currentUser() || 'Usuário';
  }

  private getStoredUsers(): User[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.USERS_KEY);
      return stored ? JSON.parse(stored) : [
        { email: 'admin@admin.com', password: 'admin123' },
        { email: 'teste@teste.com', password: '123456' }
      ];
    }
    return [
      { email: 'admin@admin.com', password: 'admin123' },
      { email: 'teste@teste.com', password: '123456' }
    ];
  }

  private setStoredUsers(users: User[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }
}