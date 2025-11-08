import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BagService } from '../../services/bag.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-bag-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bag-modal.component.html',
  styleUrls: ['./bag-modal.component.css']
})
export class BagModalComponent {
  bagService = inject(BagService);
  uiService = inject(UiService);
  router = inject(Router);

  proceedToCheckout(): void {
    this.uiService.closeAllModals();
    this.router.navigate(['/checkout']);
  }

  // Método para continuar comprando
  continueShopping(): void {
    this.uiService.closeAllModals();
  }

  // Método para formatar preços
  formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }

  // Método para atualizar a quantidade de um item
  updateQuantity(productId: number, newQuantity: number): void {
    if (newQuantity < 1) return;
    this.bagService.updateQuantity(productId, newQuantity);
  }

  // Método para remover um item
  removeItem(productId: number): void {
    this.bagService.removeFromBag(productId);
  }
}