import { Injectable, signal } from '@angular/core';

export interface ModalState {
  isBagOpen: boolean;
  isUserOpen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // Signals para estado dos modais
  private _modalState = signal<ModalState>({
    isBagOpen: false,
    isUserOpen: false
  });

  public modalState = this._modalState.asReadonly();
  public isBagOpen = computed(() => this.modalState().isBagOpen);
  public isUserOpen = computed(() => this.modalState().isUserOpen);

  toggleBag(): void {
    this._modalState.update(state => ({
      isBagOpen: !state.isBagOpen,
      isUserOpen: false
    }));
  }

  toggleUser(): void {
    this._modalState.update(state => ({
      isUserOpen: !state.isUserOpen,
      isBagOpen: false
    }));
  }

  openBag(): void {
    this._modalState.set({ isBagOpen: true, isUserOpen: false });
  }

  openUser(): void {
    this._modalState.set({ isUserOpen: true, isBagOpen: false });
  }

  closeAllModals(): void {
    this._modalState.set({ isBagOpen: false, isUserOpen: false });
  }

  // Método para verificar se algum modal está aberto
  get hasOpenModal(): boolean {
    const state = this.modalState();
    return state.isBagOpen || state.isUserOpen;
  }
}

// Computed function precisa ser importada
import { computed } from '@angular/core';