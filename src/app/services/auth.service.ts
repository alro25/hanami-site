import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Rename the signal to avoid conflict
  private _isAuthenticated = signal<boolean>(false);

  // Method to get the authentication state
  isAuthenticated() {
    return this._isAuthenticated.asReadonly();
  }

  login() {
    this._isAuthenticated.set(true);
  }

  logout() {
    this._isAuthenticated.set(false);
  }

  // Optional: For demo purposes, you can set initial state
  checkInitialAuth() {
    // Check if user was previously authenticated (e.g., from localStorage)
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth === 'true') {
      this._isAuthenticated.set(true);
    }
  }
}