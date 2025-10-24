import { Injectable, signal, Type } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private _isBagOpen = signal(false);
  private _isUserOpen = signal(false);
  private _isAdminOpen = signal(false);
  private _activeModal = signal<Type<any> | null>(null);

  isBagOpen = this._isBagOpen.asReadonly();
  isUserOpen = this._isUserOpen.asReadonly();
  isAdminOpen = this._isAdminOpen.asReadonly();
  activeModal = this._activeModal.asReadonly();

  // Método corrigido para abrir modal por tipo
  openModal(modalType: 'user' | 'admin' | 'bag'): void {
    this.closeAllModals();
    
    switch (modalType) {
      case 'user':
        this._isUserOpen.set(true);
        break;
      case 'admin':
        this._isAdminOpen.set(true);
        break;
      case 'bag':
        this._isBagOpen.set(true);
        break;
    }
  }

  // Métodos toggle individuais
  toggleBag(): void {
    if (this._isBagOpen()) {
      this.closeAllModals();
    } else {
      this.openModal('bag');
    }
  }

  toggleUser(): void {
    if (this._isUserOpen()) {
      this.closeAllModals();
    } else {
      this.openModal('user');
    }
  }

  toggleAdmin(): void {
    if (this._isAdminOpen()) {
      this.closeAllModals();
    } else {
      this.openModal('admin');
    }
  }

  closeAllModals(): void {
    this._isBagOpen.set(false);
    this._isUserOpen.set(false);
    this._isAdminOpen.set(false);
    this._activeModal.set(null);
  }

  get hasOpenModal(): boolean {
    return this._isBagOpen() || this._isUserOpen() || this._isAdminOpen();
  }
}