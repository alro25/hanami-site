import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../componentes/models/product.model';

export interface BagItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class BagService {
  private _bagItems = signal<BagItem[]>([]);

  public bagItems = this._bagItems.asReadonly();
  public itemCount = computed(() => 
    this._bagItems().reduce((total, item) => total + item.quantity, 0)
  );
  public totalPrice = computed(() =>
    this._bagItems().reduce((total, item) => 
      total + (item.product.price * item.quantity), 0
    )
  );

  addToBag(product: Product): void {
    this._bagItems.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      if (existingItem) {
        return items.map(item =>
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...items, { product, quantity: 1 }];
      }
    });
  }

  removeFromBag(productId: number): void {
    this._bagItems.update(items =>
      items.filter(item => item.product.id !== productId)
    );
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromBag(productId);
      return;
    }

    this._bagItems.update(items =>
      items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  clearBag(): void {
    this._bagItems.set([]);
  }

  checkout() {
    // Simula um checkout
    const orderCode = 'ORD-' + Date.now();
    
    // Limpa o carrinho após checkout
    this.clearBag();
    
    return {
      subscribe: (callback: any) => {
        callback(orderCode);
        return { unsubscribe: () => {} };
      }
    };
  }
}