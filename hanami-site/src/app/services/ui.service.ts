// src/app/services/ui.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  isCartOpen = signal(false);
  isSearchOpen = signal(false);
  isProfileOpen = signal(false);

  toggleCart() {
    this.isCartOpen.set(!this.isCartOpen());
    // Garante que outros modais fechem
    if (this.isCartOpen()) {
      this.isSearchOpen.set(false);
      this.isProfileOpen.set(false);
    }
  }

  toggleSearch() {
    this.isSearchOpen.set(!this.isSearchOpen());
    if (this.isSearchOpen()) {
      this.isCartOpen.set(false);
      this.isProfileOpen.set(false);
    }
  }

  toggleProfile() {
    this.isProfileOpen.set(!this.isProfileOpen());
    if (this.isProfileOpen()) {
      this.isCartOpen.set(false);
      this.isSearchOpen.set(false);
    }
  }

  closeAllModals() {
    this.isCartOpen.set(false);
    this.isSearchOpen.set(false);
    this.isProfileOpen.set(false);
  }
}