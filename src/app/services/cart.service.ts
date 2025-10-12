import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';

export interface CartItem {
  product: any;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Signal para os itens do carrinho
  private cartItemsSignal = signal<CartItem[]>([]);

  // Computed values - SEM o $
  public cartItems = computed(() => this.cartItemsSignal());
  public cartTotal = computed(() => 
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );
  public itemCount = computed(() => 
    this.cartItems().reduce((count, item) => count + item.quantity, 0)
  );

  addToCart(product: any): void {
    const currentItems = this.cartItemsSignal();
    const existingItem = currentItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      this.cartItemsSignal.set(
        currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this.cartItemsSignal.set([...currentItems, { product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: string): void {
    this.cartItemsSignal.set(
      this.cartItems().filter(item => item.product.id !== productId)
    );
  }

  updateQuantity(productId: string, change: number): void {
    this.cartItemsSignal.set(
      this.cartItems().map(item => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[]
    );
  }

  clearCart(): void {
    this.cartItemsSignal.set([]);
  }

  checkout(): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      setTimeout(() => {
        this.clearCart();
        subscriber.next(true);
        subscriber.complete();
      }, 1000);
    });
  }
}