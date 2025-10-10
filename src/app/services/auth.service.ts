import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Use a signal for authentication state
  private _isAuthenticated = signal<boolean>(this.checkInitialAuth());
  
  // Computed signal that will trigger template updates
  isAuthenticated = computed(() => this._isAuthenticated());

  login(username: string, password: string): boolean {
    console.log('Login attempt:', username); // Debug log
    
    if (username === 'admin' && password === '123456') {
      this._isAuthenticated.set(true);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
      console.log('Login successful'); // Debug log
      return true;
    }
    console.log('Login failed'); // Debug log
    return false;
  }

  logout() {
    console.log('Logging out'); // Debug log
    this._isAuthenticated.set(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
  }

  private checkInitialAuth(): boolean {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const isAuthenticated = savedAuth === 'true';
    console.log('Initial auth check:', isAuthenticated); // Debug log
    return isAuthenticated;
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'Usuário';
  }
  isAuth = computed(() => this._isAuthenticated());
}