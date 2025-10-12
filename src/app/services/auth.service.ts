import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
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

  isAuthenticated = signal<boolean>(this.checkInitialAuthState());

  constructor(private router: Router) {}

  private checkInitialAuthState(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.STORAGE_KEY) === 'true';
    }
    return false;
  }

  login(email: string, password: string): boolean {
    const users = this.getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.isAuthenticated.set(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, 'true');
      }
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated.set(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.router.navigate(['/']);
  }

  register(email: string, password: string): boolean {
    const users = this.getStoredUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return false;
    }

    // Add new user
    users.push({ email, password });
    this.setStoredUsers(users);
    
    // Auto-login after registration
    return this.login(email, password);
  }

  private getStoredUsers(): User[] {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.USERS_KEY);
      return stored ? JSON.parse(stored) : [
        { email: 'admin@admin.com', password: 'admin' }
      ];
    }
    return [{ email: 'admin@admin.com', password: 'admin' }];
  }

  private setStoredUsers(users: User[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }
}