import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // Signals para estado da UI
  private _isBagOpen = signal<boolean>(false);
  private _isSearchOpen = signal<boolean>(false);
  private _isProfileOpen = signal<boolean>(false);

  // Getters públicos - SEM o $
  public isBagOpen = this._isBagOpen.asReadonly();
  public isSearchOpen = this._isSearchOpen.asReadonly();
  public isProfileOpen = this._isProfileOpen.asReadonly();

  toggleBag(): void {
    this._isBagOpen.set(!this._isBagOpen());
    this._isSearchOpen.set(false);
    this._isProfileOpen.set(false);
  }

  toggleSearch(): void {
    this._isSearchOpen.set(!this._isSearchOpen());
    this._isBagOpen.set(false);
    this._isProfileOpen.set(false);
  }

  toggleProfile(): void {
    this._isProfileOpen.set(!this._isProfileOpen());
    this._isBagOpen.set(false);
    this._isSearchOpen.set(false);
  }

  closeAllModals(): void {
    this._isBagOpen.set(false);
    this._isSearchOpen.set(false);
    this._isProfileOpen.set(false);
  }
}