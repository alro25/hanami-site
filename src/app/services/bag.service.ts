import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';

export interface BagItem {
  product: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class BagService {
  // Signal para os itens da sacola
  private bagItemsSignal = signal<BagItem[]>([]);

  // Computed values - SEM o $
  public bagItems = computed(() => this.bagItemsSignal());
  public bagTotal = computed(() => 
    this.bagItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );
  public itemCount = computed(() => 
    this.bagItems().reduce((count, item) => count + item.quantity, 0)
  );

  addToBag(product: any): void {
    const currentItems = this.bagItemsSignal();
    const existingItem = currentItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      this.bagItemsSignal.set(
        currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this.bagItemsSignal.set([...currentItems, { product, quantity: 1 }]);
    }
  }

  removeFromBag(productId: string): void {
    this.bagItemsSignal.set(
      this.bagItems().filter(item => item.product.id !== productId)
    );
  }

  updateQuantity(productId: string, change: number): void {
    this.bagItemsSignal.set(
      this.bagItems().map(item => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean) as BagItem[]
    );
  }

  clearBag(): void {
    this.bagItemsSignal.set([]);
  }

  checkout(): Observable<string> {
    return new Observable<string>(subscriber => {
      setTimeout(() => {
        // Generate order code
        const orderCode = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Clear the bag
        this.clearBag();
        
        // Emit the order code
        subscriber.next(orderCode);
        subscriber.complete();
      }, 1000);
    });
  }
}